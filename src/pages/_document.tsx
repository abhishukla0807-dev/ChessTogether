import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="data:," />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />

        <meta
          name="description"
          content="Play real-time multiplayer chess and master software engineering on ByteMate!"
        />

        {/* OG (Social networks) */}
        <meta property="og:title" content="ByteMate" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="ByteMate" />
        <meta
          property="og:description"
          content="Play real-time multiplayer chess and master software engineering on ByteMate!"
        />

        {/* Twitter */}
        <meta name="twitter:title" content="ByteMate" />
        <meta
          name="twitter:description"
          content="Play real-time multiplayer chess and master software engineering on ByteMate!"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:image"
          content="https://chesskit.org/social-networks-1200x630.png"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
