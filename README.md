# webpack static site template

webpack のみで実装した LP や静的 web サイトの開発環境です。

## Command

```bash
pnpm install
pnpm start
pnpm run build
```

## ファイル構成

### 全体

```txt
/
├─public
└─src
    ├─images
    │  └─svg
    ├─js
    │  └─components
    ├─shared
    ├─styles
    │  ├─foundation
    │  │  ├─base
    │  │  ├─extend
    │  │  ├─mixin
    │  │  ├─reset
    │  │  ├─var
    │  │  └─vendor
    │  ├─helper
    │  ├─layout
    │  ├─module
    │  │  ├─block
    │  │  └─element
    │  └─unique
    └─views
        ├─page
        └─_include
            ├─common
            ├─mixin
            └─_data
```

### 各ディレクトリについて

| ディレクトリ名 | 用途                                                                                                      |
| -------------- | --------------------------------------------------------------------------------------------------------- |
| `public`       | 出力先                                                                                                    |
| `src`          | 開発ディレクトリ                                                                                          |
| `images`       | 画像に使用                                                                                                |
| `js`           | scss ファイルの開発ディレクトリ<br>babel を通して es5 に変換されて`public`へ出力される                    |
| `shared`       | php、mp4、json など圧縮不要なファイルを `public` に移すためのディレクトリ<br>ディレクトリごと移管される。 |
| `styles`       | scss ファイルの開発ディレクトリ<br>css に変換されて`public`へ出力される                                   |
| `views`        | pug ファイルの開発ディレクトリ<br>html に変換されて`public`へ出力される                                   |

## meta 情報の一括管理

meta 情報は以下のファイルで一括管理される。

`src/views/_include/_data/_meta.pug`

```pug
var meta = {
  "global": {
    "og_site_name": "サイト名",
    "og_image": "https://a.com/ogp.png",
    "title": "タイトル",
    "og_type": "website"
  },
  "home": {
    "title": "タイトル",
    "description": "description",
    "url": "https://a.com",
    "path": "/"
  }
};
```

`src/views/index.pug`

各個別ページの page の値が meta の key となる。

```pug
block var
  - var page = 'home';
```

## .env について

pug および scss で画像パスを相対パスから他サーバーへの絶対パスへ切り替えが可能になっています。

`IMAGE_URL`に`IMAGE_URL='https://www.aa.com/'`など入力する

```env
# IMAGE_URLに外部サーバー画像URLをセット（/まで入力）
# IMAGE_URLが空の場合、相対パスがセットされる。

IMAGE_URL=''
```

`src/views/_include/_template.pug`

```pug
- const IMAGE_URL = self.htmlWebpackPlugin.options.data
- const path = meta[page].path
- const img = IMAGE_URL ==='' ? `${path}assets/images/` : `${IMAGE_URL}assets/images/`
```

`src/styles/foundation/mixin/_bgi.scss`

```scss
@mixin bgi($url) {
  // .envのIMAGE_URLを確認し、入力があれば書き換える
  @if ($IMAGE_URL == "") {
    $img: "../../assets/images/";
    background-image: url($img + $url);
  } @else {
    background-image: url($IMAGE_URL + $url);
  }
}
```

## 別端末の同期機能　 devserver の URL について

同じ Wi-fi に接続している場合、devserver で開いた URL を別端末で開けば同期される

## Media Queries について

[include-media](https://eduardoboucas.github.io/include-media/#features)で実装しています。

`src/styles/foundation/mixin/_mediaquerys.scss`にて指定しています。

## SSI に対応

SSI に対応しています。`shared`内に SSI する html を入れて pug に記載すると出力されます。

## PurgeCSS の Safelist

<https://purgecss.com/safelisting.html>
