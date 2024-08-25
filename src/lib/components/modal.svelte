<script>
  import { modal } from "$lib/store";
  import { onDestroy, onMount } from "svelte";

  let isOpen = false;

  const handleClose = () => {
    isOpen = false;
    modal.set(false); // モーダルを閉じるときにstoreをクリア
  };

  $: {
    const unsubscribe = modal.subscribe((value) => {
      isOpen = !!value;
    });

    onDestroy(() => {
      unsubscribe();
    });
  }

  // モーダルが開かれているときにスクロールを禁止
  onMount(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = "";
    };
  });
</script>

{#if isOpen}
  <div class="overlay" on:click={handleClose}></div>
  <div class="modal">
    <div class="header">
      <slot name="header"></slot>
    </div>
    <div class="content">
      <slot name="content"></slot>
    </div>
    <div class="footer">
      <slot name="footer"></slot>
    </div>
  </div>
{/if}
