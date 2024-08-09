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
<div>
  <label>
    タイトル:<br />
    <input type="text" bind:value={name} placeholder="タイトル"/>
  </label>
  <!-- <label>
    スレッド詳細:<br />
    <textarea bind:value={about}></textarea>
  </label> -->
  <label>
    内容:<br />
    <textarea bind:value={postContent} placeholder="内容"></textarea>
  </label>
  <button on:click={submit}>新規スレッド作成</button>
  <small>
    * 新規スレが一覧に反映されるまで、仕組みの都合上、最大5分ほど待つ場合があります。<br />
    * 鯖落ちのときは諦めて。
  </small>
</div>

<style>
  label {
    margin-bottom: 12px;
  }
  input,
  textarea {
    width: 100%;
    max-width: 600px;
    margin-top: 4px;
  }
  button {
    margin-bottom: 12px;
  }
  small {
    display: block;
  }
</style>