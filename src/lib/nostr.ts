import { createRxForwardReq } from "rx-nostr";
import { generatePrivateKey, finishEvent, Kind, SimplePool } from "nostr-tools";
import type { EventTemplate, Event } from "nostr-tools";
import { addDays, startOfDay, format } from "date-fns";
const pool = new SimplePool();
import { NostrFetcher } from "nostr-fetch";
import type { NostrEvent, FetchFilter } from "nostr-fetch";
import { simplePoolAdapter } from "@nostr-fetch/adapter-nostr-tools";
import { goto } from "$app/navigation";
import { saveToLocalStorage, getSeckey } from "./store";

export const req = createRxForwardReq();

export const relays = [
  "wss://relay-jp.nostr.wirednet.jp",
  "wss://r.kojira.io",
  "wss://yabu.me",
  "wss://relay-jp.shino3.net",
];
export const generateKey = () => {
  const key = generatePrivateKey();
  const expire = format(
    startOfDay(addDays(new Date(), 1)),
    "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"
  );
  return { key, expire };
};

export const post = async (content: string, thread: string) => {
  let seckey = getSeckey();
  if (!seckey) {
    if (
      window.confirm("匿名投稿しますか？\n今日のみ有効なキーを自動生成します。")
    ) {
      // キー生成
      const { key, expire } = generateKey();
      saveToLocalStorage(key, expire);
      seckey = key;
    } else {
      if (
        window.confirm(
          "秘密鍵を登録しますか？\n投稿を破棄して設定ページを開きます。"
        )
      ) {
        goto("/settings/keys");
      } else {
        window.alert("投稿を中止します");
      }
      return false;
    }
  }
  // 投稿する
  const event: EventTemplate<Kind.ChannelMessage> = {
    kind: Kind.ChannelMessage,
    content,
    tags: [],
    created_at: Math.floor(new Date().getTime() / 1000),
  };
  event.tags.push(["e", thread, "", "root"]);
  const post = finishEvent(event, seckey);
  new Promise(() => {
    const pub = pool.publish(relays, post);
    pub.on("failed", (ev: Event) => {
      console.error("failed to send event", ev);
    });
  });
  return true;
};

const fetcher = NostrFetcher.withCustomPool(simplePoolAdapter(pool));
export const getSingleItem = async (params: { kind: number; id: string }) => {
  const filters: FetchFilter = { kinds: [params.kind], "#e": [params.id] };
  const lastData: NostrEvent | undefined = await fetcher.fetchLastEvent(
    relays,
    filters
  );
  return lastData;
};

type SingleThread = {
  id: string;
  author: string;
  latest_update: number;
  name: string;
  events: {
    content: string;
    pubkey: string;
    created_at: number;
  }[];
};

export const getThreadList = async (): Promise<SingleThread[]> => {
  const result = await pool.get(relays, {
    kinds: [30078],
    "#d": ["nchan_list"],
  });
  return result ? JSON.parse(result.content) : [];
};
