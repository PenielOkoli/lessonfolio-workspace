import type { Metadata, Viewport } from "next";
import "@fontsource-variable/dm-sans";
import "./styles.css";
export const metadata: Metadata = {
  title: "Lessonfolio | Teacher workspace",
  applicationName: "Lessonfolio",
  description: "Prepare, review and publish classroom lessons.",
  icons: {
    icon: [ { url: "/folio-32.png", sizes: "32x32", type: "image/png" }, { url: "/folio.svg", sizes: "any", type: "image/svg+xml" } ],
    apple: { url: "/apple-touch-icon.png", sizes: "180x180" }
  }
};
export const viewport: Viewport = { themeColor: "#193f36" };
export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
