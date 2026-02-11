<script lang="ts">
  import { goto } from "$app/navigation";
  import { parseCreated } from "$lib/app";
  import Author from "$lib/components/author.svelte";
  import NavigationBar from "$lib/components/navbar.svelte";
  import ThemeToggle from "$lib/components/theme-toggle.svelte";
  import { fetchThreadList, type SortOption } from "$lib/api";
  import { onMount } from "svelte";

  let threads: Awaited<ReturnType<typeof fetchThreadList>> = [];
  let loading = true;
  let currentSort: SortOption = "latest";

  const load = async (sort: SortOption = currentSort) => {
    loading = true;
    currentSort = sort;
    threads = await fetchThreadList(sort);
    loading = false;
  };

  onMount(() => load());

  const newThread = () => goto("/new");
</script>

<NavigationBar>
  <div slot="left">
    <img src="/blank.svg" alt="" height="24px" />
  </div>
  <div slot="right" class="flex">
    <ThemeToggle />
    <a href="/settings/keys"><img src="/gear.svg" class="path" alt="" height="24px" /></a>
  </div>
</NavigationBar>
<div>
  {#if loading}
    <p class="center">Loading...</p>
  {:else}
  <div class="flex">
    <button on:click={newThread}>スレ立て</button>
    <button on:click={() => load()}>一覧リロード</button>
    <select bind:value={currentSort} on:change={() => load()}>
      <option value="latest">最新書込順</option>
      <option value="oldest">古い書込順</option>
      <option value="created_new">新スレ順</option>
      <option value="created_old">古スレ順</option>
    </select>
  </div>

  <div class="thread-index">
    <p>[スレッド一覧]</p>
    {#each threads as thread, i}
      <span>{i + 1}: </span><a href="#{thread.id}">{thread.name !== "" ? thread.name : "スレタイなし"}</a>&nbsp;
    {/each}
  </div>

  {#each threads as thread}
    <!-- {JSON.stringify(thread)} -->
    <section id={thread.id}>
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
    border: 1px solid #888;
    padding: 8px;
    margin-bottom: 12px;
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
  .thread-index {
    border: 1px solid #888;
    padding: 8px;
    margin-bottom: 12px;
    font-size: 0.9rem;
    line-height: 1.5;
  }
  .thread-index p {
    font-weight: bold;
    margin-bottom: 4px;
  }
</style>
