import HeroSection from "@/components/HeroSection"; 

export default function HomePage() {
  return (
    <main>
      <HeroSection /> {/* Sử dụng HeroSection thay cho section 1 cũ */}
      <section>
        <h1>Section 2 — Portfolio</h1>
      </section>

      <section>
        <h1>Section 3 — Projects</h1>
      </section>

      <section>
        <h1>Section 4 — About</h1>
      </section>

      <section>
        <h1>Section 5 — Contact</h1>
      </section>
    </main>
  );
}
