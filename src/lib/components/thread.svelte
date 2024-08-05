<script lang="ts">
import type { Nostr } from "nosvelte";
import { format, fromUnixTime } from "date-fns";
export let event: Nostr.Event<Nostr.Kind.Text>;
const content = JSON.parse(event.content);
</script>
<div class="mt-3">
    <h2 class="ellipsis">
        <a href="/{event.id}">{content.name !== "" ? content.name : "スレタイなし"}</a>
    </h2>
    <div class="detail">
        {format(fromUnixTime(event.created_at), "yyyy/MM/dd hh:mm:ss")}
        <span class="px-2" style="background-color: #{event.pubkey.slice(0, 6)}88;">{event.pubkey.slice(0, 8)}</span>
    </div>
</div>

<style>
    .detail {
        font-size: 0.8rem;
    }
</style>