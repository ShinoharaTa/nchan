<script lang="ts">
import type { Nostr } from "nosvelte";
import "websocket-polyfill";
import { getThreadList } from "$lib/app";
import Thread from "$lib/components/thread.svelte";
import { format, fromUnixTime } from "date-fns";
import { onMount } from "svelte";

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
        {format(fromUnixTime(thread.latest_update), "yyyy/MM/dd HH:mm:ss")}
        <span class="px-2" style="background-color: #{thread.author.slice(0, 6)}88;">{thread.author.slice(0, 8)}</span>
    </div>
    <div class="height-limit">
      {#each thread.events as event}
      <div class="outline mt-2">
        <div class="ps-2" style="border-left: 6px solid #{event.pubkey.slice(0, 6)};">
          <div class="detail">{format(fromUnixTime(event.created_at), "yyyy/MM/dd HH:mm:ss")} {event.pubkey.slice(0, 8)} </div>
          <div class="content lf">{event.content}</div>
          <!--
          <div class="content lf">{parsed.other_urls}</div>
          {#each parsed.image_urls as image}
            <img src={image} alt="" srcset="" class="img-fluid">
          {/each}
          {#each parsed.twitter_urls as url}
              <blockquote class="twitter-tweet">
                  <a href={url}>{url}</a>
              </blockquote>
          {/each} -->
        </div>
      </div>
        <!-- {JSON.stringify(event)} -->
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