<script lang="ts">
  import { page } from "$app/stores";
  import NavigationBar from "$lib/components/navbar.svelte";
  import { newThread, post } from "$lib/nostr";
  import { getAnonymousKey, getSecKey } from "$lib/store";
  import "websocket-polyfill";
  const channel_id: string = $page.params.channel_id;

  let name = "";
  let postContent = "";
  let anonymous = true;
  $: submitDisabled = !name.trim() || !postContent.trim();

  const submit = async () => {
    const seckey = anonymous ? getAnonymousKey() : getSecKey();
    if (!seckey) {
      alert("投稿するには鍵の生成または登録が必要です");
      return;
    }
    const threadId = await newThread(name, "", seckey);
    if (!threadId) return;
    const result = await post(postContent, threadId, seckey, null);
    if (result) {
      alert("新しいスレッドを作成しました");
      name = "";
      postContent = "";
    }
  };
</script>

<NavigationBar>
  <div slot="left">
    <a href="/">
      <img src="/left.svg" class="path" alt="" height="24px" />
    </a>
  </div>
  <div slot="right">
    <a href="/settings/keys">
      <img src="/gear.svg" class="path" alt="" height="24px" />
    </a>
  </div>
</NavigationBar>
<div>
  <label>
    タイトル:<br />
    <input type="text" bind:value={name} placeholder="タイトル" />
  </label>
  <label>
    内容:<br />
    <textarea bind:value={postContent} placeholder="内容"></textarea>
  </label>
  <div class="flex">
    <input
      id="anonymous_new_thread"
      name="anonymous_new_thread"
      type="checkbox"
      bind:checked={anonymous}
    />
    <label for="anonymous_new_thread">匿名でスレ立て</label>
  </div>
  <button on:click={submit} disabled={submitDisabled}>新規スレッド作成</button>
  <small>
    *
    新規スレが一覧に反映されるまで、仕組みの都合上、最大5分ほど待つ場合があります。<br
    />
    * 鯖落ちのときは諦めて。
  </small>
</div>

<style>
  button {
    margin-bottom: 12px;
  }
  small {
    display: block;
  }
</style>
