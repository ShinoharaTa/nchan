<script lang="ts">
  import { page } from "$app/stores";
  import NavigationBar from "$lib/components/navbar.svelte";
  import Post from "$lib/components/post.svelte";
  import { newThread, post } from "$lib/nostr";
  import type { Nostr } from "nosvelte";
  import { Event, NostrApp, UniqueEventList } from "nosvelte";
  import { writable } from "svelte/store";
  import "websocket-polyfill";
  const channel_id: string = $page.params.channel_id;

  let name = "";
  let postContent = "";

  const submit = async () => {
    const threadId = await newThread(name, "");
    if (!threadId) {
      return;
    }
    const result = await post(postContent, threadId);
    if (result) {
      name = "";
      postContent = "";
    }
  };
</script>

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
</NavigationBar>
<div class="container">
  <section class="">
    <div>
      <div class="mt-3">スレッドタイトル</div>
      <input type="text" bind:value={name} class="w-100" />
      <!-- <div class="mt-3">スレッド詳細</div>
      <textarea class="w-100" rows="4" bind:value={about}></textarea> -->
      <div class="mt-3">1スレ目投稿</div>
      <textarea class="w-100" rows="4" bind:value={postContent}></textarea>
      <div class="mt-2 text-danger note">
        新規スレが一覧に反映されるまで、仕組みの都合上、最大5分ほど待つ場合があります。<br
        />
        ※鯖落ちのときは諦めて。
      </div>
      <div class="mt-3">
        <button on:click={submit}>新規スレッド</button>
      </div>
    </div>
  </section>
</div>

<style>
  .note {
    font-size: 0.8rem;
  }
</style>
