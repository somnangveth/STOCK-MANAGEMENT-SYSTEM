import "./globals.css";
import ReactQueryProvider from "./lib/ReactQueryProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
<<<<<<< HEAD
      <body>
        <ReactQueryProvider>{children}</ReactQueryProvider>
=======
      <body className="">
        <ReactQueryProvider>
          {children}
        </ReactQueryProvider>
>>>>>>> 0236c08d3dc12a55ed21db98a3f9731d5e11f8b8
      </body>
    </html>
  );
}
