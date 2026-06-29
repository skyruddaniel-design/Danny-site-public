import { Contact } from "@/components/contact";
import { Hero } from "@/components/hero";
import { Process } from "@/components/process";
import { Services } from "@/components/services";

export default function Home() {
  return (
    <main>
      <Hero />
      <Services />
      <Process />
      <Contact />
    </main>
  );
}
