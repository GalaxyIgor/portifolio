import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Skills } from "@/components/sections/Skills";
import { FeaturedProjects } from "@/components/sections/FeaturedProjects";
import { Experience } from "@/components/sections/Experience";
import { Contact } from "@/components/sections/Contact";
import { NextSection } from "@/components/sections/NextSection";
import { SectionStars } from "@/components/layout/SectionStars";

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="home-sections">
      <SectionStars />
      <Hero />
      <About />
      <NextSection to="skills" />
      <Skills />
      <NextSection to="projects" />
      <FeaturedProjects />
      <NextSection to="experience" />
      <Experience />
      <NextSection to="contact" />
      <Contact />
    </div>
  );
}
