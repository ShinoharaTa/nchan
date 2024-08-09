<script lang="ts">
  import { page } from "$app/stores";
  import NavigationBar from "$lib/components/navbar.svelte";
  import Post from "$lib/components/post.svelte";
  import { newThread } from "$lib/nostr";
  import type { Nostr } from "nosvelte";
  import { Event, NostrApp, UniqueEventList } from "nosvelte";
  import { writable } from "svelte/store";
  import "websocket-polyfill";
  const channel_id: string = $page.params.channel_id;

  let name = "";
  let about = "";

  const submit = async () => {
    const result = await newThread(name, about);
    if (result) {
      name = "";
      about = "";
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
      <div class="mt-3">スレッド詳細</div>
      <textarea class="w-100" rows="4" bind:value={about}></textarea>
      <button on:click={submit}>新規スレッド</button>
    </div>
  </section>
</div>
