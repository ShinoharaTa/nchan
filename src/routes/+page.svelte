<script lang="ts">
  import { goto } from "$app/navigation";
  import { parseCreated } from "$lib/app";
  import Author from "$lib/components/author.svelte";
  import NavigationBar from "$lib/components/navbar.svelte";
  import { getThreadList } from "$lib/nostr";
  import { onMount } from "svelte";
  import "websocket-polyfill";

  let threads = [];
  let loading = true;
  onMount(async () => {
    threads = await getThreadList();
    loading = false;
  });

  const reload = async () => {
    threads = await getThreadList();
    loading = false;
  };

  const newThread = () => goto("/new");
</script>

<NavigationBar>
  <div slot="left">
    <img src="/blank.svg" alt="" height="24px" />
  </div>
  <div slot="right">
    <a href="/settings/keys"><img src="/gear.svg" alt="" height="24px" /></a>
  </div>
</NavigationBar>

<div class="container">
  {#if loading}
    <p>Loading...</p>
  {:else}
    <section>
      <button on:click={newThread}>スレ立て</button>
      <button on:click={reload}>一覧リロード</button>
    </section>
    <section class="mt-3">
      {#each threads as thread}
        <!-- {JSON.stringify(thread)} -->
        <div class="mb-3">
          <h4 class="ellipsis">
            <a href="/{thread.id}"
              >{thread.name !== "" ? thread.name : "スレタイなし"}</a
            >
          </h4>
          <div class="detail">
            <Author hex={thread.author} />
            Latest update: {parseCreated(thread.latest_update)}
          </div>
          <div class="height-limit">
            {#each thread.events as event}
              <div class="outline mt-2">
                <div
                  class="ps-2"
                  style="border-left: 6px solid #{event.pubkey.slice(0, 6)};"
                >
                  <!-- <div class="detail"><Author hex={event.pubkey} style="simple" /> {parseCreated(event.created_at)}</div> -->
                  <div class="detail text-break">{event.content}</div>
                </div>
              </div>
            {/each}
          </div>
        </div>
        <style>
          .detail {
            font-size: 0.8rem;
          }
        </style>
      {/each}
    </section>
  {/if}
</div>

<style>
  .height-limit {
    overflow-y: hidden;
    max-height: 120px;
  }
</style>
