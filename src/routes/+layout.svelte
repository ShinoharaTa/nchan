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

<div class="h-min-100vh">
  <slot />
  <footer>
    <p>
      <a href="about">About</a>
      <a href="https://github.com/ShinoharaTa/nchan" target="_blank">GitHub</a
      >
    </p>
    <p>Copyright 2024 - T.Shinohara</p>
  </footer>
</div>

<style>
  .h-min-100vh {
    min-height: 100dvh;
    display: flex;
    flex-direction: column;
  }
  footer {
    margin-top: auto;
    text-align: center;
    font-size: 0.8rem;
  }
</style>
