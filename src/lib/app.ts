import { format, fromUnixTime } from "date-fns";

export const parseCreated = (time: number) =>
  format(fromUnixTime(time), "yyyy/MM/dd HH:mm:ss");

export function sanitizeDisplayText(text: string) {
  return text
    .normalize("NFKC")
    .replace(/[\u200B-\u200F\u202A-\u202E\u2066-\u2069]/g, "")
    .replace(/\p{M}/gu, "")
    .replace(/[\p{Cc}\p{Cf}]/gu, (char) =>
      ["\n", "\r", "\t"].includes(char) ? char : "",
    );
}

export function parseContent(text: string) {
  const sanitizedText = sanitizeDisplayText(text);
  const urlPattern = /(https?:\/\/[^\s]+)/g;
  const twitterPattern = /(https?:\/\/(twitter\.com|x\.com)\/[^\s]+)/g;
  const imagePattern = /(https?:\/\/[^\s]+\.(jpg|jpeg|png|gif|webp))/g;
  const youtubePattern = /(https?:\/\/www\.youtube\.com\/watch\?v=[^\s]+)/g;

  const urls: string[] = sanitizedText.match(urlPattern) || [];
  const twitterUrls: string[] = sanitizedText.match(twitterPattern) || [];
  const imageUrls: string[] = sanitizedText.match(imagePattern) || [];
  const youtubeUrls: string[] = sanitizedText.match(youtubePattern) || [];

  const textWithoutUrls = sanitizedText.replace(urlPattern, "").trim();

  const otherUrls = urls.filter(
    (url) =>
      !twitterUrls.includes(url) &&
      !imageUrls.includes(url) &&
      !youtubeUrls.includes(url)
  );

  return {
    original_text: sanitizedText,
    urls,
    text_without_urls: textWithoutUrls,
    twitter_urls: twitterUrls,
    image_urls: imageUrls,
    youtube_urls: youtubeUrls,
    other_urls: otherUrls,
  };
}
