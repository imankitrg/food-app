
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
        <body className="flex flex-col min-h-screen">
          <Navbar />
            <main className="flex-grow">{children}</main>
          <Footer />
        </body>
    </html>
  );
}