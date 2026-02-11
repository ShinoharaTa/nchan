import type { SingleThread } from "./nostr";

const API_BASE_URL = "https://thread.nchan.vip";

type ChannelsResponse = {
  data: SingleThread[];
  meta: {
    count: number;
    sort: string;
    limit: number;
    with_messages: boolean;
    timestamp: string;
  };
};

export type SortOption = "latest" | "oldest" | "created_new" | "created_old";

export const fetchThreadList = async (
  sort: SortOption = "latest",
): Promise<SingleThread[]> => {
  const params = new URLSearchParams({
    with_messages: "true",
    sort,
    limit: "50",
  });
  const res = await fetch(`${API_BASE_URL}/channels?${params}`);
  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }
  const json: ChannelsResponse = await res.json();
  return json.data;
};
