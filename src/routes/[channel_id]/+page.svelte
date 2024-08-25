<script lang="ts">
  import { page } from "$app/stores";
  import Modal from "$lib/components/modal.svelte";
  import NavigationBar from "$lib/components/navbar.svelte";
  import Post from "$lib/components/post.svelte";
  import {
    generateKey,
    getChannelMeta,
    getSingleEvent,
    newAuthor,
    post,
    relays,
    req,
  } from "$lib/nostr";
  import {
    getAnonymousKey,
    getSecKey,
    modal,
    saveToAnonymousKey,
  } from "$lib/store";
  import type { Event, Kind } from "nostr-tools";
  import type { Nostr } from "nosvelte";
  import { NostrApp, UniqueEventList } from "nosvelte";
  import { onMount, tick } from "svelte";
  import { writable } from "svelte/store";
  import "websocket-polyfill";
  const channel_id: string = $page.params.channel_id;

  // 取得したイベントを時系列で並べ替える
  const sorted = (events: Nostr.Event[]) => {
    return [...events].sort((a, b) => a.created_at - b.created_at);
  };

  const limitLists = [20, 50, 100];
  const selectedLimit = writable(20);
  let channelNameLoaded = false;
  let channelName = "";
  const initLoading = async () => {
    channelName = await getChannelMeta(channel_id);
    channelNameLoaded = true;
  };

  let postContent = "";
  let replyId: string | null = null;
  let parentEvent: Event<Kind.Text>;
  let anonymous = true;
  $: submitDisabled = !postContent.trim();

  const submit = async () => {
    let seckey = anonymous ? getAnonymousKey() : getSecKey();
    if (!seckey) {
      if (anonymous) {
        if (window.confirm("匿名秘密鍵を新規生成しますか？")) {
          const { key, expire } = generateKey();
          saveToAnonymousKey(key, expire);
          newAuthor(key);
          seckey = key;
        } else {
          alert("投稿を中止します");
          return;
        }
      } else {
        alert("投稿するには鍵の生成または登録が必要です");
        return;
      }
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

  const openReply = async (id: string) => {
    const event = await getSingleEvent(id);
    if (!event) return;
    parentEvent = event;
    modal.set(true);
  };

  initLoading();
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

<Modal>
  <div class="flex flex-between" slot="header">
    <h2></h2>
    <button on:click={() => modal.set(false)}>Close</button>
  </div>
  <div slot="content">
    <Post event={parentEvent} action={false}></Post>
  </div>
  <div slot="footer"></div>
</Modal>

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
      {#if channelNameLoaded}
        <h2 class="mb-2 ellipsis">
          {channelName ?? "タイトルなし"}
        </h2>
      {/if}
      <section>
        {#each sorted(events) as event (event.id)}
          <Post
            {event}
            on:reply={(e) => (replyId = e.detail.id)}
            on:openReply={(e) => openReply(e.detail.id)}
          />
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
        <button on:click={submit} type="button" disabled={submitDisabled}
          >書き込む</button
        >
      </form>
    </main>
  </UniqueEventList>
</NostrApp>
