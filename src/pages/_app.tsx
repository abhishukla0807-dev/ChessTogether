import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import type { AppProps } from "next/app";
import Layout from "@/sections/layout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GlobalStyles } from "@mui/material";

const queryClient = new QueryClient();

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <GlobalStyles
        styles={{
          "html, body": {
            overflow: "hidden !important",
            height: "100%",
            margin: "0 !important",
            padding: "0 !important",
          },
          "#__next": {
            height: "100%",
            overflow: "hidden",
          },
          "nextjs-portal, #__next-build-watcher, [data-nextjs-toast], [data-nextjs-dev-overlay], [data-nextjs-dialog-overlay]": {
            display: "none !important",
            visibility: "hidden !important",
            opacity: "0 !important",
            pointerEvents: "none !important",
          },
        }}
      />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </QueryClientProvider>
  );
}
