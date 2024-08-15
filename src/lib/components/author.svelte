<script lang="ts">
  export let hex: string;
  export let style: "simple" | "none" | undefined = undefined;
</script>

{#if style === "simple"}
  <strong>{hex.slice(0, 6)}</strong>
{:else if style === "none"}
  <span>{hex.slice(0, 6)}</span>
{:else}
  <span style="background-color: #{hex.slice(0, 6)}66;"
    >{hex.slice(0, 6)}</span
  >
{/if}
