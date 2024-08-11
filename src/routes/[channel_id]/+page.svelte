<script lang="ts">
  import { page } from "$app/stores";
  import NavigationBar from "$lib/components/navbar.svelte";
  import Post from "$lib/components/post.svelte";
  import { post, relays, req } from "$lib/nostr";
  import type { Nostr } from "nosvelte";
  import { Event, NostrApp, UniqueEventList } from "nosvelte";
  import { writable } from "svelte/store";
  import "websocket-polyfill";
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

  const submitKeydown = (event: KeyboardEvent) => {
    if (event.ctrlKey && event.key === "Enter") {
      submit();
    }
  };
</script>

<NavigationBar>
  <div slot="left">
    <a href="/">
      <img src="/left.svg" class="path" alt="" height="24px" />
    </a>
  </div>
  <div slot="right">
    <a href="/settings/keys">
      <img src="/gear.svg" class="path" alt="" height="24px" />
    </a>
  </div>
</NavigationBar>

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
    <p class="center">Loading...</p>
  </div>
  <div slot="error" let:error class="container">
    <p class="center">{error}</p>
  </div>
  <main>
    <Event queryKey={[]} id={channel_id} let:event>
      <h2 class="mb-2 ellipsis">
        {JSON.parse(event.content).name ?? "タイトルなし"}
      </h2>
    </Event>
    <section>
      {#each sorted(events) as event (event.id)}
        <Post {event} />
      {/each}
    </section>
    <form>
      <label>
        <textarea
          bind:value={postContent}
          on:keydown={submitKeydown}
        ></textarea>
      </label>
      <button on:click={submit}>書き込む</button>
    </form>
  </main>
  </UniqueEventList>
</NostrApp>
