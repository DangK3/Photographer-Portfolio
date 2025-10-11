import Container from "./Container";

export default function Header() {
  return (
    <header className="border-b py-4">
      <Container>
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold tracking-tight">
            Photographer Portfolio
          </h1>
          <nav className="space-x-6 text-sm">
            <a href="#" className="hover:underline">Commercial</a>
            <a href="#" className="hover:underline">Fashion</a>
            <a href="#" className="hover:underline">Personal</a>
            <a href="#" className="hover:underline">About</a>
            <a href="#" className="hover:underline">Projects</a>
          </nav>
        </div>
      </Container>
    </header>
  );
}
