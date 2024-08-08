<div class="container bg-light sticky-top py-2">
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
