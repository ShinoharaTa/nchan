<script lang="ts">
import type { Nostr } from "nosvelte";
import "websocket-polyfill";
import { getThreadList } from "$lib/app";
import { format, fromUnixTime } from "date-fns";
import { onMount } from "svelte";
import { parseCreated } from "$lib/app";
import Author from "$lib/components/author.svelte";
import { goto } from "$app/navigation";
import NavigationBar from "$lib/components/navbar.svelte";

const title = {
	name: "んちゃんねる",
};
const next = {
	name: "設定",
	func: () => {
		goto("/settings/keys");
	},
};

let threads = [];
let loading = true;
onMount(async () => {
	threads = await getThreadList();
	loading = false;
});
</script>

<NavigationBar {title} {next} />

<div class="container">
{#if loading}
  <p>Loading...</p>
{:else}

<section>
{#each threads as thread}
  <!-- {JSON.stringify(thread)} -->
  <div class="mb-3">
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