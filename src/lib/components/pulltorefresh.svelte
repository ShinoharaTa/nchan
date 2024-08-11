<script lang="ts">
  import { createEventDispatcher, onDestroy, onMount } from 'svelte';

  const dispatch = createEventDispatcher();

  let touchStartY = 0;
  let touchMoveY = 0;

  function handleTouchStart(event: TouchEvent) {
    touchStartY = event.touches[0].clientY;
  }

  function handleTouchMove(event: TouchEvent) {
    touchMoveY = event.touches[0].clientY;
    if (touchMoveY - touchStartY > 100) {
      // カスタムイベントを発火
      dispatch('refresh');
      // デフォルトのpull-to-refreshを無効化
      event.preventDefault();
    }
  }

  onMount(() => {
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
  });

  onDestroy(() => {
    window.removeEventListener('touchstart', handleTouchStart);
    window.removeEventListener('touchmove', handleTouchMove);
  });
</script>

<div class="pull-to-refresh">
  <slot />
</div>

<style>
  /* 必要に応じてスタイルを追加 */
  .pull-to-refresh {
    position: relative;
    overflow: hidden;
  }
</style>
