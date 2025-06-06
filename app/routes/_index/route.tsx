import Footer from "./components/layout/Footer";
import QuickLinksBar from "./components/layout/QuickLinksBar";
import TopNavBar from "./components/layout/TopNavBar";
import MainComponent from "./components/main/MainComponent";
import SearchBarHeader from "./components/search/SearchBarHeader";

export default function Index() {
  return (
    <div>
      <TopNavBar />
      <QuickLinksBar />
      <SearchBarHeader />
      <MainComponent />
      <Footer />
    </div>
  );
}
