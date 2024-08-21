<script>
  import NavigationBar from "$lib/components/navbar.svelte";
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
<article>
  <section>
    <h2>んちゃんねるとは</h2>
    <p>
      当サイト、んちゃんねるは Nostr
      プロトコルに則ったパブリックチャットを主体とした WEB
      アプリケーションです。Nostr
      とは「リレーを介してやり取りされる、投稿やそれ以外のもの」の略称で、本人を指名するものは公開鍵と秘密鍵のペアになります。
      複数のリレー（と呼ばれるサーバー）に対して接続し、冗長化もされるなどの特徴があります。
    </p>
    <p>Nostr の頭文字「N」をとって n-channel → んちゃんねる と呼んでいます。</p>
    <p>
      ※Nostrに関しての詳しい解説等は以下のブログを御覧ください。<br />
      <a href="https://zenn.dev/mattn/articles/cf43423178d65c" target="_blank"
        >Nostr の面白さをエンジニア目線で解説してみる - Zenn</a
      >
    </p>
    <p>
      「んちゃんねる」においても例外なく以下、複数のリレーに接続しています。<br
      />
      ※予告なく追加・削除される場合があります
    </p>
    <ul>
      <li>wss://relay-jp.nostr.wirednet.jp</li>
      <li>wss://yabu.me</li>
      <li>wss://r.kojira.io</li>
      <li>wss://relay-jp.shino3.net</li>
    </ul>
  </section>
  <section>
    <h2>んちゃんねるの特徴は</h2>
    <p>
      この項では、んちゃんねるが他のクライアントアプリと異なる点について説明していきます。
    </p>
    <h3>匿名でも使用できること</h3>
    <p>
      アカウントを作るのは大変ですよね。登録とかも手間がかかります。Nostrにはアカウント登録の概念はなく「鍵」と呼ばれるものを使用します。この鍵を1日単位で生成することができます。
      <br />
      Nostr を当たり前に使用している方向けに「コテハン」の機能を用意しています。他のクライアント等で生成された秘密鍵を登録することで、そのアカウントで投稿することが出来るようになります。
    </p>
    <h3>表示速度 ＞＞＞ 快適性</h3>
    <p>
      Websocket
      を使用するメリットを享受するために、プロフィール情報などは可能な限り取得しない設計です。なぜならテキストだけならとても早いから。都内の混み合った駅、電波の弱いビルの地下、そんな場所でも安定して使えることを目指しています。
    </p>
  </section>
  <section>
    <h2>注意事項</h2>
    <ul>
      <li>
        このアプリ上での見た目はまるで匿名掲示板ですが、他のクライアントではパブリックチャットとして機能します。
      </li>
      <li>
        匿名機能を搭載したクライアントですが利用者の接続情報等のリレーサーバー上のログに残ります。
      </li>
      <li>
        Nostr
        の仕組み上「削除」に関してはリレー側である程度サポートされていますが完全な削除は難しい場合があります。
      </li>
    </ul>
  </section>
  <section>
    <h2>Nostrクライアント開発者向け</h2>
    <p>
      2024年8月22日以降の投稿にタグが含まれます。クライアントで意図的にブロックすることが可能です。
    </p>
    <h3>tagsに含まれる識別子</h3>
    <ul>
      <li>["via", "nchan.shino3.net"]</li>
      <li>["client", "nchan.shino3.net"]</li>
    </ul>
    <h3>対象のKind</h3>
    <ul>
      <li>kind 0：ユーザープロフィール</li>
      <li>kind 40：パブリックチャット</li>
      <li>kind 41：パブリックチャットのMetadata</li>
      <li>kind 42：パブリックチャットへの投稿</li>
    </ul>
  </section>
  <section>
    <h2>免責事項</h2>
    <p>
      当アプリケーションの利用およびNostrにおけるトラブルなど、私は一切の関与をしません。
    </p>
  </section>
</article>

<style lang="scss">
  section {
    margin-bottom: 2rem;
  }
  h2 {
    margin-top: 1rem;
    margin-bottom: 1.5rem;
  }
  h3 {
    margin-bottom: 1rem;
  }
  p {
    white-space: initial;
    word-break: initial;
    line-height: 1.5rem;
    padding-bottom: 1rem;
  }
  ul {
    margin-left: 2rem;
    > li {
      line-height: 1.6rem;
    }
    margin-bottom: 1.5rem;
  }
</style>
