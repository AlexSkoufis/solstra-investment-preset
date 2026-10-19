import SmoothScroll from "@/components/SmoothScroll";
import Magnetic from "@/components/Magnetic";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/sections/Hero";
import Intro from "@/components/sections/Intro";
import Metrics from "@/components/sections/Metrics";
import ActiveMinds from "@/components/sections/ActiveMinds";
import Investment from "@/components/sections/Investment";
import Pathways from "@/components/sections/Pathways";
import InvestorRelations from "@/components/sections/InvestorRelations";
import Careers from "@/components/sections/Careers";
import Closing from "@/components/sections/Closing";

export default function Home() {
  return (
    <>
      <SmoothScroll />
      <Magnetic />
      <Header />
      <main id="main">
        <Hero />
        <Intro />
        <Metrics />
        <ActiveMinds />
        <Investment />
        <Pathways />
        <InvestorRelations />
        <Careers />
        <Closing />
      </main>
      <Footer />
    </>
  );
}
