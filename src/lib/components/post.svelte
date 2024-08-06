<script lang="ts">
import type { Nostr } from "nosvelte";
import { Event } from "nosvelte";
import { format, fromUnixTime } from "date-fns";
import { parseContent } from "$lib/app";

export let event: Nostr.Event<Nostr.Kind.Text>;
const parsed = parseContent(event.content);
</script>

<div class="outline mt-2">
  <div class="ps-2" style="border-left: 6px solid #{event.pubkey.slice(0, 6)};">
    <div class="detail">{event.pubkey.slice(0, 8)} {format(fromUnixTime(event.created_at), "yyyy/MM/dd HH:mm:ss")}</div>
    <div class="content lf">{parsed.text_without_urls}</div>
    <div class="content lf">{parsed.other_urls}</div>
    {#each parsed.image_urls as image}
      <img src={image} alt="" srcset="" class="img-fluid">
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
</style>