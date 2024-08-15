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
    <a href="/settings/keys"><img src="/gear.svg" class="path" alt="" height="24px" /></a>
  </div>
</NavigationBar>
<div>
  {#if loading}
    <p class="center">Loading...</p>
  {:else}
  <div class="flex">
    <button on:click={newThread}>スレ立て</button>
    <button on:click={reload}>一覧リロード</button>
  </div>
  {#each threads as thread}
    <!-- {JSON.stringify(thread)} -->
    <section>
      <h2>
        <a href="/{thread.id}">
          {thread.name !== "" ? thread.name : "スレタイなし"}
        </a>
      </h2>
      {#each thread.events.reverse() as event}
        <article>
            <p class="ellipsis">
              <span style="background: #{event.pubkey.slice(0, 6)}66">
                {event.pubkey.slice(0, 6)}
              </span>
              {event.content}</p>
            </article>
        {/each}
      <aside class="flex">
        Latest update: {parseCreated(thread.latest_update)}
        <Author hex={thread.author} />
      </aside>
    </section>
  {/each}
  {/if}
</div>

<style>
  section {
    padding: 16px 0;
  }
  article {
    padding: 2px 0;
  }
  aside{
    margin-top: 12px;
    font-size: 0.8rem;
  }
  h2 {
    margin-bottom: 12px;
  }
</style>
