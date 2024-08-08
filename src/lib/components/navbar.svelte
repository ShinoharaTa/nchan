<script lang="ts">
</script>

<div class="container bg-light sticky-top py-2">
  <section class="d-flex align-items-center">
    <div class="flex-shrink-0">
      <slot name="left" />
    </div>
    <div class="fs-2 flex-fill px-2 ellipsis">
      <slot name="title" />
    </div>
    <div class="flex-shrink-0">
      <slot name="right" />
    </div>
  </section>
  <!-- <section>
        <slot />
    </section> -->
</div>
