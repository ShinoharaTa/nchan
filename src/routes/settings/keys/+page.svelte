<script lang="ts">
import { generateKey } from "$lib/app";
import { format, parseISO, subDays, startOfDay, addYears } from "date-fns";
import { nip19 } from "nostr-tools";

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

<section class="d-flex align-items-center justify-content-between">
    <div><a href="/">« 戻る</a></div>
    <h2 class="flex-fill text-center px-3">
        んちゃんねる - 設定
    </h2>
    <div><a href="/settings/keys">設定</a></div>
</section>

<section>
    <h4>設定中の秘密鍵</h4>
    <div>
        <textarea bind:value={nsec} placeholder="キーを生成してください" class="w-100" rows="3"></textarea>
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
