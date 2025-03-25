import Hero from "@/components/layout/Hero";
import About from "@/components/features/About";
import Skills from "@/components/features/Skills";
import Projects from "@/components/features/Projects";
import Contact from "@/components/features/Contact";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Contact />
      <Footer />
    </>
  );
}
