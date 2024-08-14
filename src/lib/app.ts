import { format, fromUnixTime } from "date-fns";

export const parseCreated = (time: number) =>
  format(fromUnixTime(time), "yyyy/MM/dd HH:mm:ss");

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
