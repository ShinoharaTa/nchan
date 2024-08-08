<script lang="ts">
import { NostrApp, UniqueEventList, Event } from "nosvelte";
import type { Nostr } from "nosvelte";
import { format, fromUnixTime } from "date-fns";
import "websocket-polyfill";
import { page } from "$app/stores";
import { writable } from "svelte/store";
import Post from "$lib/components/post.svelte";
import { relays, req, post } from "$lib/app";
import { goto } from "$app/navigation";
import NavigationBar from "$lib/components/navbar.svelte";

const title = {
	name: "設定",
	imagePath: "",
};
const prev = {
	name: "« 戻る",
	func: () => {
		goto("/");
	},
};
const next = {
	name: "",
	func: () => {
		goto("/settings/keys");
	},
};

const channel_id: string = $page.params.channel_id;

// 取得したイベントを時系列で並べ替える
const sorted = (events: Nostr.Event[]) => {
	return [...events].sort((a, b) => a.created_at - b.created_at);
};

const limitLists = [20, 50, 100];
const selectedLimit = writable(20);

let postContent = "";
const submit = async () => {
	const result = await post(postContent, channel_id);
	if (result) {
		postContent = "";
	}
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
    <div slot="loading" class="container">
      <p>Loading...</p>
    </div>
    <div slot="error" let:error class="container">
      <p>{error}</p>
    </div>
    <Event queryKey={[]} id={channel_id} let:event>
      <NavigationBar title={{name: JSON.parse(event.content).name ?? "タイトルなし"}} {prev} {next} >
        <!-- <section class="d-flex align-items-center justify-content-between">
          <div>
            表示件数
            <select bind:value={$selectedLimit}>
              {#each limitLists as limit}
                <option value={limit}>{limit}件</option>
              {/each}
            </select>
          </div>
        </section> -->
      </NavigationBar>
    </Event>
    <div class="container">
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
    </div>
    </UniqueEventList>
  </NostrApp>
