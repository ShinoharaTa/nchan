<script lang="ts">
  import { goto } from "$app/navigation";
  import { generateKey } from "$lib/app";
  import NavigationBar from "$lib/components/navbar.svelte";
  import { addYears, format, parseISO, startOfDay, subDays } from "date-fns";
  import { nip19 } from "nostr-tools";

  const title = {
    name: "設定",
    imagePath: "",
  };
  const prev = {
    name: "« 戻る",
    func: () => {
      goto("/");
    },
  };

  let nsec = "";
  let expireString = "";
  if (typeof window !== "undefined") {
    const hex = localStorage.getItem("nchan_private_key") ?? "";
    nsec = hex ? nip19.nsecEncode(hex) : "";
    expireString = localStorage.getItem("nchan_private_key_expire") ?? "";
  }
  //   localStorage.removeItem("nchan_private_key");
  //   localStorage.removeItem("nchan_private_key_expire");
  const onClickGenerateKey = () => {
    if (window.confirm("現在のキーを破棄して新規キーを生成しますか？")) {
      const { key, expireDate } = generateKey();
      nsec = nip19.nsecEncode(key);
      expireString = expireDate;
    }
  };

  const onClickSetOriginalKey = () => {
    if (window.confirm("設定済みのキーを上書きしますか？")) {
      const decode = nip19.decode(nsec);
      if (decode.type !== "nsec") {
        window.alert("nsecで始まる秘密鍵をいれるんや");
        return;
      }
      localStorage.setItem("nchan_private_key", decode.data);
      const expireDate = format(
        startOfDay(addYears(new Date(), 1)),
        "yyyy-MM-dd'T'HH:mm:ss.SSSxxx",
      );
      localStorage.setItem("nchan_private_key_expire", expireDate);
      expireString = expireDate;
    }
  };
</script>

<NavigationBar {title} {prev} />

<div class="container">
  <section>
    <h4>設定中の秘密鍵</h4>
    <div>
      <textarea
        bind:value={nsec}
        placeholder="キーを生成してください"
        class="w-100"
        rows="3"
      ></textarea>
    </div>
    <div>
      {#if expireString}
        有効期限：{format(subDays(parseISO(expireString), 1), "yyyy/MM/dd")}
      {/if}
    </div>
    <div>
      <button on:click={onClickGenerateKey}>キーを新規生成する</button>
      <button on:click={onClickSetOriginalKey}>入力したキーを使用する</button>
    </div>
  </section>
</div>
