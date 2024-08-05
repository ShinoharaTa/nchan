export function parseContent(text: string) {
  const urlPattern = /(https?:\/\/[^\s]+)/g;
  const twitterPattern = /(https?:\/\/(twitter\.com|x\.com)\/[^\s]+)/g;
  const imagePattern = /(https?:\/\/[^\s]+\.(jpg|png|gif))/g;
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

export const relays = ["wss://r.kojira.io", "wss://yabu.me"];

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
import { addDays, startOfDay, format, parseISO, isAfter } from "date-fns";
const pool = new SimplePool();

export const post = async (content: string, thread: string) => {
  if (!nsec) {
    if (
      window.confirm("匿名投稿しますか？\n今日のみ有効なキーを自動生成します。")
    ) {
      // キー生成
      const key = generatePrivateKey();
      localStorage.setItem("nchan_private_key", key);
      const expireDate = format(
        startOfDay(addDays(new Date(), 1)),
        "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"
      );
      localStorage.setItem("nchan_private_key_expire", expireDate);
      nsec = key;
    } else {
      if (
        window.confirm(
          "秘密鍵を登録しますか？\n投稿を破棄して設定ページを開きます。"
        )
      ) {
        // 鍵設定のページへ
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
  event.tags.push(['e', thread, "", 'root']);
  const post = finishEvent(event, nsec);
  new Promise(() => {
    const pub = pool.publish(relays, post);
    pub.on("failed", (ev: Event) => {
      console.error("failed to send event", ev);
    });
  });
  return true;
};