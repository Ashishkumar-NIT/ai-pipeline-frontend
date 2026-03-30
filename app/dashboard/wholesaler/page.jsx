import HeroUploadSection from "../../../components/wholesaler/HeroUploadSection";
import OverviewSection from "../../../components/wholesaler/OverviewSection";
import NavigationTabs from "../../../components/wholesaler/NavigationTabs";
import CatalogueSection from "../../../components/wholesaler/CatalogueSection";
export default function WholesalerDashboardPage() {
  return (
    <main className="min-h-screen bg-white">
      <HeroUploadSection />
      <OverviewSection />
      <NavigationTabs />
      <CatalogueSection />
    </main>
  );
}
