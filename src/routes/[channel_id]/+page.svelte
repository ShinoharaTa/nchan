<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { post, relays, req } from "$lib/app";
  import NavigationBar from "$lib/components/navbar.svelte";
  import Post from "$lib/components/post.svelte";
  import { format, fromUnixTime } from "date-fns";
  import type { Nostr } from "nosvelte";
  import { Event, NostrApp, UniqueEventList } from "nosvelte";
  import { writable } from "svelte/store";
  import "websocket-polyfill";

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
        "#e": [channel_id],
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
      <NavigationBar>
        <div slot="left">
          <a href="/">
            <img src="/left.svg" alt="" height="24px" />
          </a>
        </div>
        <div slot="right">
          <a href="/settings/keys">
            <img src="/gear.svg" alt="" height="24px" />
          </a>
        </div>
        <div class="mt-2 fs-4 ellipsis">
          {JSON.parse(event.content).name ?? "タイトルなし"}
        </div>
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
