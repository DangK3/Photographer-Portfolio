import HeroSection from "@/components/HeroSection"; 
import ProjectShowcase from '@/components/ProjectShowcase';
import PortfolioSection from '@/components/PortfolioSection';

export default function HomePage() {
  return (
    <main>
      {/* Section 01 */}
      <HeroSection /> 
      {/* Section 02 */}
      <PortfolioSection />
      {/* Section 03 */}
      <ProjectShowcase />
      <section>
        <h1>Section 4 — About</h1>
      </section>

      <section>
        <h1>Section 5 — Contact</h1>
      </section>
    </main>
  );
}
