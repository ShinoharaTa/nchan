export function parseContent(text: string) {
  const urlPattern = /(https?:\/\/[^\s]+)/g;
  const twitterPattern = /(https?:\/\/(twitter\.com|x\.com)\/[^\s]+)/g;
  const imagePattern = /(https?:\/\/[^\s]+\.(jpg|jpeg|png|gif|webp))/g;
  const youtubePattern = /(https?:\/\/www\.youtube\.com\/watch\?v=[^\s]+)/g;

  const urls: string[] = text.match(urlPattern) || [];
  const twitterUrls: string[] = text.match(twitterPattern) || [];
  const imageUrls: string[] = text.match(imagePattern) || [];
  const youtubeUrls: string[] = text.match(youtubePattern) || [];

  const textWithoutUrls = text.replace(urlPattern, "").trim();

  const otherUrls = urls.filter(
    (url) =>
      !twitterUrls.includes(url) &&
      !imageUrls.includes(url) &&
      !youtubeUrls.includes(url)
  );

  return {
    original_text: text,
    urls,
    text_without_urls: textWithoutUrls,
    twitter_urls: twitterUrls,
    image_urls: imageUrls,
    youtube_urls: youtubeUrls,
    other_urls: otherUrls,
  };
}

export const relays = [
  "wss://relay-jp.nostr.wirednet.jp",
  "wss://r.kojira.io",
  "wss://yabu.me",
  "wss://relay-jp.shino3.net",
];

import { createRxForwardReq } from "rx-nostr";
export const req = createRxForwardReq();
let nsec: string | null = null;

const initKey = () => {
  if (typeof window !== "undefined") {
    try {
      const expireString =
        localStorage.getItem("nchan_private_key_expire") ?? null;
      if (!expireString) {
        throw new Error("nothing to expire string.");
      }
      if (isAfter(parseISO(expireString), new Date())) {
        nsec = localStorage.getItem("nchan_private_key") ?? null;
      } else {
        throw new Error("expired.");
      }
    } catch (e) {
      console.log("private_key_delete", e);
      localStorage.removeItem("nchan_private_key");
      localStorage.removeItem("nchan_private_key_expire");
    }
  }
};

initKey();

import { generatePrivateKey, finishEvent, Kind, SimplePool } from "nostr-tools";
import type { EventTemplate, Event } from "nostr-tools";
import { addDays, startOfDay, format, parseISO, isAfter, fromUnixTime } from "date-fns";
const pool = new SimplePool();
import { NostrFetcher } from "nostr-fetch";
import type { NostrEvent, FetchFilter } from "nostr-fetch";
import { simplePoolAdapter } from "@nostr-fetch/adapter-nostr-tools";
import { goto } from "$app/navigation";

export const generateKey = () => {
  const key = generatePrivateKey();
  localStorage.setItem("nchan_private_key", key);
  const expireDate = format(
    startOfDay(addDays(new Date(), 1)),
    "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"
  );
  localStorage.setItem("nchan_private_key_expire", expireDate);
  return { key, expireDate };
};

export const post = async (content: string, thread: string) => {
  if (!nsec) {
    if (
      window.confirm("匿名投稿しますか？\n今日のみ有効なキーを自動生成します。")
    ) {
      // キー生成
      const { key } = generateKey();
      nsec = key;
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
  const post = finishEvent(event, nsec);
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
}

export const getThreadList = async (): Promise<SingleThread[]> => {
  const result = await pool.get(relays, {
    kinds: [30078],
    "#d": ["nchan_list"],
  });
  return result ? JSON.parse(result.content) : [];
};

export const parseCreated = (time: number) => format(fromUnixTime(time), "yyyy/MM/dd HH:mm")