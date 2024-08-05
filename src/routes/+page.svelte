<script lang="ts">
import { NostrApp, UniqueEventList } from "nosvelte";
import type { Nostr } from "nosvelte";
import "websocket-polyfill";
import { relays, req } from "$lib/app";
import Thread from "$lib/components/thread.svelte";

const sorted = (events: Nostr.Event[]) => {
	return [...events].sort((a, b) => b.created_at - a.created_at);
};
</script>

<NostrApp {relays}>
  <UniqueEventList
    queryKey={["timeline", "feed"]}
    filters={[
      {
        kinds: [40],
        limit: 100,
      },
    ]}
    {req}
    let:events
  >
    <div slot="loading">
      <p>Loading...</p>
    </div>

    <div slot="error" let:error>
      <p>{error}</p>
    </div>

    <section class="d-flex align-items-center justify-content-between">
      <div></div>
      <h2 class="flex-fill text-center px-3">
        んちゃんねる
      </h2>
      <div>設定</div>
    </section>

    <section>
    {#each sorted(events) as event (event.id)}
        <!-- <Metadata
          queryKey={["timeline", "metadata", event.pubkey]}
          pubkey={event.pubkey}
          let:metadata
        >
      </Metadata> -->
      <Thread event={event}></Thread>
      {/each}
    </section>
  </UniqueEventList>
</NostrApp>
