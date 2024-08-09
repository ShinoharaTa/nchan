<script lang="ts">
  import { parseContent, parseCreated } from "$lib/app";
  import type { Nostr } from "nosvelte";
  import Author from "./author.svelte";

  export let event: Nostr.Event<Nostr.Kind.Text>;
  const parsed = parseContent(event.content);
  const reply_tag = event.tags.find(
    (tag) => tag.includes("e") && tag.includes("reply"),
  );
  const reply = reply_tag ? reply_tag[1].slice(0, 10) : null;
</script>

<div class="outline mb-3">
  <div class="ps-2" style="border-left: 6px solid #{event.pubkey.slice(0, 6)};">
    <div class="detail pt-1" id="{reply}">
      <strong>名無しの{event.pubkey.slice(0, 6)}さん</strong>
      {parseCreated(event.created_at)}
      ID:{event.id.slice(0, 6)}
    </div>
    {#if reply}
      <div><a href="#{reply}">{`>>${reply}`}</a></div>
    {/if}
    <div class="content lf text-break">{parsed.text_without_urls}</div>
    <div class="content lf text-break">{parsed.other_urls}</div>
    {#each parsed.image_urls as image}
      <a href={image} target="_blank"
        ><img src={image} alt="" srcset="" class="img-fluid content-image" /></a
      >
    {/each}
    {#each parsed.twitter_urls as url}
      <blockquote class="twitter-tweet text-break">
        <a href={url}>{url}</a>
      </blockquote>
    {/each}
  </div>
</div>

<style>
  .detail {
    font-size: 0.8rem;
  }

  .content-image {
    max-height: 200px;
  }
</style>
