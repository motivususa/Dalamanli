import StyledComponentsRegistry from "@/lib/registry";
import { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Kaya's iPod",
  description: "Kaya's iPod Classic on the web.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
      </body>
    </html>
  );
}
