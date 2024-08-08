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

<slot />
<div class="py-2 mt-3 bg-dark text-white" style="font-size: 0.8rem;">
  <div class="container detail text-center">Copyright 2024 - T.Shinohara</div>
</div>
