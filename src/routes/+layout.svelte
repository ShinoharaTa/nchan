<script>
  import { onMount } from "svelte";
  import "../styles/style.scss";
  onMount(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then((registration) => {
          console.log(
            "ServiceWorker registration successful with scope: ",
            registration.scope,
          );
        })
        .catch((error) => {
          console.error("ServiceWorker registration failed: ", error);
        });
    }
  });
</script>

<div class="h-min-100vh d-flex flex-column">
  <slot />
  <div class="py-2 mt-3 bg-dark text-white mt-auto" style="font-size: 0.8rem;">
    <div class="container detail text-center footer-ios">Copyright 2024 - T.Shinohara</div>
  </div>
</div>

<style>
  .h-min-100vh {
    min-height: 100vh;
    min-height: 100dvh;
  }
</style>
