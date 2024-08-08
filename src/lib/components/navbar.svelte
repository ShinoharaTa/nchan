<script lang="ts">
  export let addHeight = 0
</script>

<div class="container bg-light fixed-top py-2">
  <section class="d-flex align-items-center">
    <div class="flex-shrink-0">
      <slot name="left" />
    </div>
    <div class="fs-2 flex-fill px-2 ellipsis text-center">
      <img src="/logo.svg" alt="" height="32px" />
    </div>
    <div class="flex-shrink-0">
      <slot name="right" />
    </div>
  </section>
  <section>
    <slot />
  </section>
</div>
<div class="header-padding"></div>
<div style="height: {addHeight}px"></div>

<style>
  .header-padding {
    height: 64px;
  }
</style>
