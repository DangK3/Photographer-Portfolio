import HeroSection from "@/components/HeroSection"; 
import ProjectShowcase from '@/components/ProjectShowcase';
import PortfolioSection from '@/components/PortfolioSection';
import BtsSection from '@/components/BtsSection';
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
      
      
      <section>
        <h1>Section 5 — Contact</h1>
      </section>
    </main>
  );
}
