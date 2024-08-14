<script lang="ts">
  import { page } from "$app/stores";
  import NavigationBar from "$lib/components/navbar.svelte";
  import Post from "$lib/components/post.svelte";
  import { post, relays, req } from "$lib/nostr";
  import { getAnonymousKey, getSecKey } from "$lib/store";
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
  let replyId: string | null = null;
  let anonymous = true;

  const submit = async () => {
    const seckey = anonymous ? getAnonymousKey() : getSecKey();
    if (!seckey) {
      alert("投稿するには鍵の生成または登録が必要です");
      return;
    }
    const result = await post(postContent, channel_id, seckey, replyId);
    if (result) {
      postContent = "";
      replyId = null;
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
          <Post {event} on:reply={(e) => (replyId = e.detail.id)} />
        {/each}
      </section>
      <form>
        {#if replyId}
          <p>リプライ &gt; {replyId}</p>
          <button on:click={() => (replyId = null)} type="button" class="small"
            >リプをキャンセル</button
          >
        {/if}
        <label>
          <textarea bind:value={postContent} on:keydown={submitKeydown}
          ></textarea>
        </label>
        <div class="flex">
          <input
            id="anonymous_new_thread"
            name="anonymous_new_thread"
            type="checkbox"
            bind:checked={anonymous}
          />
          <label for="anonymous_new_thread">匿名で書き込む</label>
        </div>
        <button on:click={submit} type="button">書き込む</button>
      </form>
    </main>
  </UniqueEventList>
</NostrApp>
