import type { Metadata } from "next";
import "@fontsource-variable/dm-sans";
import "./styles.css";
export const metadata: Metadata = { title: "Lessonfolio | Teacher workspace", description: "Prepare, review and publish classroom lessons." };
export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
