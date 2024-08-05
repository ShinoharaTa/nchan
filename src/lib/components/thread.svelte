<script lang="ts">
import type { Nostr } from "nosvelte";
import { format, fromUnixTime } from "date-fns";
// export let metadata: Nostr.Event<Nostr.Kind.Metadata>;
export let event: Nostr.Event<Nostr.Kind.Text>;
const content = JSON.parse(event.content);
</script>
<div class="mt-3">
    <h3>
        {content.name !== "" ? content.name : "スレタイなし"}
    </h3>
    <div>
        {format(fromUnixTime(event.created_at), "y/M/d h:m:ss")}
        {event.pubkey.slice(0, 8)}
    </div>
    <div class="ellipsis">
        <a href="/{event.id}">https://nchan.shino3.net/{event.id}</a>
    </div>
</div>