<script lang="ts">
import { NostrApp, UniqueEventList, Event } from "nosvelte";
import type { Nostr } from "nosvelte";
import { format, fromUnixTime } from "date-fns";
import "websocket-polyfill";
import { page } from "$app/stores";
import { writable } from "svelte/store";
import Post from "$lib/components/post.svelte";
import { relays, req, post } from "$lib/app";

const channel_id: string = $page.params.channel_id;

// 取得したイベントを時系列で並べ替える
const sorted = (events: Nostr.Event[]) => {
	return [...events].sort((a, b) => a.created_at - b.created_at);
};

const limitLists = [20, 50, 100];
const selectedLimit = writable(20);

let postContent = "";
const submit = () => {
	post(postContent, channel_id);
  postContent = "";
};
</script>

<NostrApp {relays}>
  <UniqueEventList
    queryKey={["timeline", "feed"]}
    filters={[
      {
        kinds: [42],
        limit: $selectedLimit,
        "#e": [channel_id]
      },
    ]}
    {req}
    let:events
  >
    <div slot="loading">
      <p>Loading...</p>
    </div>

    <div slot="error" let:error>
      <p>{error}</p>
    </div>
    <div class="sticky-top bg-white">
      <section class="d-flex align-items-center justify-content-between">
        <div><a href="/">« 戻る</a></div>
        <h2 class="flex-fill px-3">
          <Event queryKey={[]} id={channel_id} let:event>{JSON.parse(event.content).name ?? "タイトルなし"}</Event>
        </h2>
        <div>設定</div>
      </section>
      <section class="d-flex align-items-center justify-content-between">
        <div>
          表示件数
          <select bind:value={$selectedLimit}>
            {#each limitLists as limit}
              <option value={limit}>{limit}件</option>
            {/each}
          </select>
        </div>
      </section>
    </div>
    <section>
      {#each sorted(events) as event (event.id)}
        <Post {event} />
      {/each}
    </section>
    <section class="py-3">
      <div class="text-center">
        <textarea class="w-100" rows="4" bind:value={postContent}></textarea>
        <button on:click={submit}>投稿する</button>
      </div>
    </section>
  </UniqueEventList>
</NostrApp>
