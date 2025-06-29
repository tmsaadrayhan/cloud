import { Suspense } from "react";
import "./globals.css";
import Header from "./Header/Header";
import { NavigationEvents } from "./components/navigation-events";

function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Header />
        {children}
        <Suspense fallback={null}>
          <NavigationEvents />
        </Suspense>
      </body>
    </html>
  );
}

export default RootLayout;
