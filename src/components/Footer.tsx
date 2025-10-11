import Container from "./Container";

export default function Footer() {
  return (
    <footer className="border-t py-6 text-center text-sm text-gray-500">
      <Container>
        © {new Date().getFullYear()} — Your Name. All rights reserved.
      </Container>
    </footer>
  );
}
