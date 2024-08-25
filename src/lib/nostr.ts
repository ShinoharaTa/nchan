import { createRxForwardReq } from "rx-nostr";
import {
  generatePrivateKey,
  finishEvent,
  Kind,
  SimplePool,
  getPublicKey,
} from "nostr-tools";
import type { EventTemplate, Event } from "nostr-tools";
import { addDays, startOfDay, format } from "date-fns";
const pool = new SimplePool();
import { eventKind, NostrFetcher } from "nostr-fetch";
import type { NostrEvent, FetchFilter } from "nostr-fetch";
import { simplePoolAdapter } from "@nostr-fetch/adapter-nostr-tools";

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

export const post = async (
  content: string,
  thread: string,
  seckey: string,
  reply: string | null
) => {
  const event: EventTemplate<Kind.ChannelMessage> = {
    kind: Kind.ChannelMessage,
    content,
    tags: [],
    created_at: Math.floor(new Date().getTime() / 1000),
  };
  event.tags.push(["e", thread, "", "root"]);
  if (reply) {
    event.tags.push(["e", reply, "", "reply"]);
  }
  event.tags.push(["client", "nchan.shino3.net"]);
  const post = finishEvent(event, seckey);
  new Promise(() => {
    const pub = pool.publish(relays, post);
    pub.on("failed", (ev: Event) => {
      console.error("failed to send event", ev);
    });
  });
  return true;
};

export const newThread = async (
  name: string,
  about: string,
  seckey: string
) => {
  const content = {
    name,
    about,
    picture: "https://nchan.shino3.net/channel_img.png",
  };
  const event: EventTemplate<Kind.ChannelCreation> = {
    kind: Kind.ChannelCreation,
    content: JSON.stringify(content),
    tags: [],
    created_at: Math.floor(new Date().getTime() / 1000),
  };
  event.tags.push(["client", "nchan.shino3.net"]);
  const post = finishEvent(event, seckey);
  new Promise(() => {
    const pub = pool.publish(relays, post);
    pub.on("failed", (ev: Event) => {
      console.error("failed to send event", ev);
    });
  });
  return post.id;
};

export const newAuthor = async (seckey: string) => {
  const hex = getPublicKey(seckey);
  const content = {
    display_name: `んちゃんねるの名無しさん${hex.slice(0, 6)}`,
    name: `nchan_${hex.slice(0, 6)}`,
    about:
      "んちゃんねる (https://nchan.shino3.net) にて作られた匿名アカウントです",
    nip05: "",
    website: "",
    lud16: "shino3@getalby.com",
    picture: "https://nchan.shino3.net/channel_img.png",
  };
  const event: EventTemplate<Kind.Metadata> = {
    kind: Kind.Metadata,
    content: JSON.stringify(content),
    tags: [],
    created_at: Math.floor(new Date().getTime() / 1000),
  };
  event.tags.push(["client", "nchan.shino3.net"]);
  const post = finishEvent(event, seckey);
  new Promise(() => {
    const pub = pool.publish(relays, post);
    pub.on("failed", (ev: Event) => {
      console.error("failed to send event", ev);
    });
  });
  return;
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

export const getChannelMeta = async (id: string): Promise<string> => {
  const event = await pool.get(relays, {
      kinds: [40],
      ids: [id],
    })
    if(!event) return "";
    const metadata = await pool.list(relays, [

    {
      kinds: [41],
      "#e": [id],
      authors: [event.pubkey],
      limit: 1
    },
  ]
  )
    const latestMeta = metadata.length > 0 ? metadata.sort((a, b) => a.created_at - b.created_at)[0]: null;
  const parsedMeta = JSON.parse(latestMeta ? latestMeta.content : event.content
  )
  return parsedMeta.name
};
