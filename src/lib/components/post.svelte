<script lang="ts">
  import { parseContent, parseCreated } from "$lib/app";
  import type { Nostr } from "nosvelte";
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  export let event: Nostr.Event<Nostr.Kind.Text>;
  const parsed = parseContent(event.content);
  const reply_tag = event.tags.find(
    (tag) => tag.includes("e") && tag.includes("reply"),
  );
  const reply = reply_tag ? reply_tag[1].slice(0, 10) : null;
  function onClickReply(id: string) {
    dispatch("reply", { id });
    return null;
  }
</script>

<article>
  <div class="flex">
    <h3 style="color: #{event.pubkey.slice(0, 6)};">
      んちゃんねるから{event.pubkey.slice(0, 6)}がお送りします
    </h3>
    <time data-time={parseCreated(event.created_at)}
      >:{parseCreated(event.created_at)}</time
    >
    <aside>ID:{event.id.slice(0, 10)}</aside>
  </div>
  {#if reply}
    <a href="javascript: void(0);">{`>>${reply}`}</a>
  {/if}
  <p>{parsed.text_without_urls}</p>
  {#each parsed.other_urls as url}
    <p>
      <a href={url} target="_blank">
        {url}
      </a>
    </p>
  {/each}
  {#each parsed.image_urls as image}
    <a href={image} target="_blank">
      <img src={image} alt="" srcset="" />
    </a>
  {/each}
  {#each parsed.twitter_urls as url}
    <blockquote>
      <a href={url}>{url}</a>
    </blockquote>
  {/each}
  <div class="reply">
    <button class="small" on:click={onClickReply(event.id)}>
      <img src="/reply.svg" alt="" class="path" height="16px" /> リプライ</button
    >
  </div>
</article>

<style>
  .flex {
    gap: 4px 8px;
    margin-bottom: 8px;
  }
  article {
    padding: 16px 0;
  }
  .reply {
    margin-top: 8px;
  }
</style>
