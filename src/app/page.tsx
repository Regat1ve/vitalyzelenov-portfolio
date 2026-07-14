import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Projects } from "@/components/Projects";
import { Methodology } from "@/components/Methodology";
import { FAQ } from "@/components/FAQ";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main className="flex-1 mx-auto w-full max-w-3xl px-6">
        <Hero />
        <About />
        <Projects />
        <Methodology />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
