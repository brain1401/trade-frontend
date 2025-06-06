// 분리된 컴포넌트들 import
import { TopNavBar, QuickLinksBar, Footer } from "./layout";
import MainComponent from "./main/MainComponent";
import { SearchBarHeader } from "./search";

export default function HomePage() {
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
