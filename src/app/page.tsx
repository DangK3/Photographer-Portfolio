import HeroSection from "@/components/HeroSection"; 
import ProjectShowcase from '@/components/ProjectShowcase';
import PortfolioSection from '@/components/PortfolioSection';
import BtsSection from '@/components/BtsSection';
import ContactSection from '@/components/ContactSection';
export default function HomePage() {
  return (
    <main>
      {/* Section 01 */}
      <HeroSection /> 
      {/* Section 02 */}
      <PortfolioSection />
      {/* Section 03 */}
      <ProjectShowcase />
      {/* Section 04 */}
      <BtsSection />
      {/* Section 05 */}
      <ContactSection />
    </main>
  );
}
