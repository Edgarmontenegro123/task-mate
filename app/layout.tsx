import type { Metadata } from "next";
import NavBar from "./components/navBar/navBar";
import Footer from "./components/footer/footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "Task Mate",
  description: "Your personal task management companion!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <NavBar />
        <main className="flex min-h-full flex-col items-left justify-between mt-24 ml-4 mr-4">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
