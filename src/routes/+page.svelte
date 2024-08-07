<script lang="ts">
import type { Nostr } from "nosvelte";
import "websocket-polyfill";
import { getThreadList } from "$lib/app";
import { format, fromUnixTime } from "date-fns";
import { onMount } from "svelte";
import { parseCreated } from "$lib/app";
import Author from "$lib/components/author.svelte";

let threads = [];
let loading = true;
onMount(async () => {
	threads = await getThreadList();
	loading = false;
});
</script>

{#if loading}
  <p>Loading...</p>
{:else}
<section class="d-flex align-items-center justify-content-between">
  <div></div>
  <h2 class="flex-fill text-center px-3">
    んちゃんねる
  </h2>
  <div><a href="/settings/keys">設定</a></div>
</section>

<section>
{#each threads as thread}
  <!-- {JSON.stringify(thread)} -->
  <div class="mt-3">
    <h2 class="ellipsis">
        <a href="/{thread.id}">{thread.name !== "" ? thread.name : "スレタイなし"}</a>
    </h2>
    <div class="detail">
      <Author hex={thread.author} />
      Latest update: {parseCreated(thread.latest_update)}
    </div>
    <div class="height-limit">
      {#each thread.events as event}
      <div class="outline mt-2">
        <div class="ps-2" style="border-left: 6px solid #{event.pubkey.slice(0, 6)};">
          <!-- <div class="detail"><Author hex={event.pubkey} style="simple" /> {parseCreated(event.created_at)}</div> -->
          <div class="detail">{event.content}</div>
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

<style>
  .height-limit {
    overflow-y: hidden;
    max-height: 120px;
  }
</style>