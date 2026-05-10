
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import "./globals.css";
import Providers from "./providers";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
        <body className="flex flex-col min-h-screen">
          <Providers>
          <Navbar />
            <main className="flex-grow">{children}</main>
          <Footer />
          </Providers>
        </body>
    </html>
  );
}