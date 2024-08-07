<script lang="ts">
import type { Nostr } from "nosvelte";
import { parseContent, parseCreated } from "$lib/app";
import Author from "./author.svelte";

export let event: Nostr.Event<Nostr.Kind.Text>;
const parsed = parseContent(event.content);
</script>

<div class="outline mt-3">
  <div class="ps-2" style="border-left: 6px solid #{event.pubkey.slice(0, 6)};">
    <div class="detail pt-1"><Author hex={event.pubkey} style="simple" /> {parseCreated(event.created_at)}</div>
    <div class="content lf">{parsed.text_without_urls}</div>
    <div class="content lf">{parsed.other_urls}</div>
    {#each parsed.image_urls as image}
      <img src={image} alt="" srcset="" class="img-fluid content-image">
    {/each}
    {#each parsed.twitter_urls as url}
        <blockquote class="twitter-tweet">
            <a href={url}>{url}</a>
        </blockquote>
    {/each}
  </div>
</div>

<style>
  .detail {
    font-size: 0.8rem;
  }

  .content-image{
    max-height: 200px
  }
</style>