import React from "react";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import "./globals.css";
import { Noto_Sans_Display } from "next/font/google";
import { ConfigProvider } from "antd";

const noto = Noto_Sans_Display({
  weight: ["300", "400", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Triathlon Tools",
};

const RootLayout = ({ children }: React.PropsWithChildren) => (
  <html lang="en" className={noto.className}>
    <head>
      <title>Triathlon Tools</title>
    </head>
    <body>
      <AntdRegistry>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: "#054a91",
              colorBgBase: "#dbe4ee",
            },
            components: {
              Layout: {
                headerBg: "#054a91",
              },
            },
          }}
        >
          {children}
        </ConfigProvider>
      </AntdRegistry>
    </body>
  </html>
);

export default RootLayout;
