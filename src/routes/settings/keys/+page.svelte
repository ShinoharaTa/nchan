<script lang="ts">
  import { goto } from "$app/navigation";
  import NavigationBar from "$lib/components/navbar.svelte";
  import { generateKey } from "$lib/nostr";
  import { expire, getSeckey, saveToLocalStorage } from "$lib/store";
  import { addYears, format, parseISO, startOfDay, subDays } from "date-fns";
  import { nip19 } from "nostr-tools";
  import { get } from "svelte/store";

  let nsec = "";
  let expireString = "";
  if (typeof window !== "undefined") {
    const hex = getSeckey();
    nsec = hex ? nip19.nsecEncode(hex) : "";
    expireString = get(expire) ?? "";
  }

  const onClickGenerateKey = () => {
    if (window.confirm("現在のキーを破棄して新規キーを生成しますか？")) {
      const { key, expire } = generateKey();
      saveToLocalStorage(key, expire);
      nsec = nip19.nsecEncode(key);
      expireString = expire;
    }
  };

  const onClickSetOriginalKey = () => {
    if (window.confirm("設定済みのキーを上書きしますか？")) {
      const decode = nip19.decode(nsec);
      if (decode.type !== "nsec") {
        window.alert("nsecで始まる秘密鍵をいれるんや");
        return;
      }
      const expireDate = format(
        startOfDay(addYears(new Date(), 1)),
        "yyyy-MM-dd'T'HH:mm:ss.SSSxxx",
      );
      saveToLocalStorage(decode.data, expireDate);
      expireString = expireDate;
    }
  };
</script>

<NavigationBar>
  <div slot="left">
    <a href="/"><img src="/left.svg" class="path" alt="" height="24px" /></a>
  </div>
  <div slot="right">
    <img src="/blank.svg" alt="" height="24px" />
  </div>
</NavigationBar>
<div>
  <label>
    設定中の秘密鍵:<br>
    <textarea
      bind:value={nsec}
      placeholder="キーを生成してください"
    ></textarea>
  </label>
  <div>
    {#if expireString}
      有効期限：{format(subDays(parseISO(expireString), 1), "yyyy/MM/dd")}
    {/if}
  </div>
  <div class="flex">
    <button on:click={onClickGenerateKey}>キーを新規生成する</button>
    <button on:click={onClickSetOriginalKey}>入力したキーを使用する</button>
  </div>
</div>
