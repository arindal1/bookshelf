import { NavBar } from "@/components/layout/NavBar";
import { Footer } from "@/components/layout/Footer";
import { PageTransition } from "@/components/layout/PageTransition";

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      <PageTransition>{children}</PageTransition>
      <Footer />
    </div>
  );
}