import { Outlet } from "react-router";
import TopNavBar from "./TopNavBar";
import QuickLinksBar from "./QuickLinksBar";
import Footer from "./Footer";

export default function RootLayout() {
  return (
    <div className="bg-gray-50 font-nanum_square_neo_variable font-[500]">
      <TopNavBar />
      <QuickLinksBar />
      <main className="container mx-auto max-w-7xl px-6 py-5">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
