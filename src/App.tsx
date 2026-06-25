import { Nav } from "@/components/site/nav";
import { Hero } from "@/components/site/hero";
import { Problem } from "@/components/site/problem";
import { Solution } from "@/components/site/solution";
import { StageTraction } from "@/components/site/stage-traction";
import { Market } from "@/components/site/market";
import { BusinessModel } from "@/components/site/business-model";
import { Team } from "@/components/site/team";
import { Ask } from "@/components/site/ask";
import { Contact } from "@/components/site/contact";
import { Footer } from "@/components/site/footer";

export default function App() {
  return (
    <div id="top">
      <Nav />
      <main>
        <Hero />
        <Problem />
        <Solution />
        <StageTraction />
        <Market />
        <BusinessModel />
        <Team />
        <Ask />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
