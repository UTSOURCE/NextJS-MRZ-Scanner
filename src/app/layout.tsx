import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MRZ Scanner",
  description: "MRZ Scanner using Dynamsoft Label Recognizer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
