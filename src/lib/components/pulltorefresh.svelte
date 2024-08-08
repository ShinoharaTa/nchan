<script lang="ts">
  import { createEventDispatcher, onDestroy, onMount } from "svelte";

  const dispatch = createEventDispatcher();

  let touchStartY = 0;
  let touchMoveY = 0;
  let isLoading = false;

  function handleTouchStart(event: TouchEvent) {
    if (isLoading) return;
    touchStartY = event.touches[0].clientY;
  }

  function handleTouchMove(event: TouchEvent) {
    if (isLoading) return;
    touchMoveY = event.touches[0].clientY;
    const pullDistance = touchMoveY - touchStartY;
    if (pullDistance > 64) {
      event.preventDefault();
      event.stopPropagation();
      dispatch("refresh");
      isLoading = true;
    }
  }

  onMount(() => {
    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
  });

  onDestroy(() => {
    window.removeEventListener("touchstart", handleTouchStart);
    window.removeEventListener("touchmove", handleTouchMove);
  });

  export const stopLoading = () => {
    isLoading = false;
  }
</script>

<div class="pull-to-refresh">
  {#if isLoading}
    <div class="loading">Loading...</div>
  {/if}
  <slot />
</div>

<style>
  /* 必要に応じてスタイルを追加 */
  .pull-to-refresh {
    position: relative;
    overflow: hidden;
  }
</style>
