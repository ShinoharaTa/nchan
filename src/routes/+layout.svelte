<script>
  import { page } from "$app/stores";
  import Modal from "$lib/components/modal.svelte";
  import { removeIdentifiedKey, initTheme } from "$lib/store";
  import { onMount } from "svelte";
  import "../styles/style.scss";

  onMount(() => {
    initTheme();
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

  console.log($page.url.host);
  let openHikkoshiModal = $page.url.host === "nchan.shino3.net";

  const migrateNewSite = () => {
    removeIdentifiedKey();
    location.href = "https://nchan.vip";
  };
</script>

<div class="h-min-100vh">
  <Modal isOpen={openHikkoshiModal}>
    <div class="flex flex-between" slot="header">
      <h2>お知らせ</h2>
    </div>
    <div slot="content">
      <p>
        現在のドメイン（https://nchan.shino3.net）から新ドメイン（https://nchan.vip）へ移行しました。このドメインは近いうちに廃止される予定です。
      </p>
      <p>
        「移行する」ボタンを押すと、登録されている秘密鍵などを消去し、新ドメインへ移行します。
      </p>
      <p>※ホーム画面へ追加したPWAなどはご自身で削除してください</p>
    </div>
    <div slot="footer" class="flex">
      <button on:click={() => (openHikkoshiModal = false)}>閉じる</button>
      <button on:click={migrateNewSite}>移行する</button>
    </div>
  </Modal>
  <slot />
  <footer>
    <p>
      <a href="about">About</a>
      <a href="https://github.com/ShinoharaTa/nchan" target="_blank">GitHub</a>
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
