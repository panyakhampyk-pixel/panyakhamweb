import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ProjectsSection from "@/components/ProjectsSection";
import InterviewSection from "@/components/InterviewSection";
import PrideSection from "@/components/PrideSection";
import ScholarshipSection from "@/components/ScholarshipSection";
import BenefitsSection from "@/components/BenefitsSection";
import DonateSection from "@/components/DonateSection";
import NewsSection from "@/components/NewsSection";
import PartnersSection from "@/components/PartnersSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <PartnersSection />
      <ProjectsSection />
      <InterviewSection />
      <PrideSection />
      <ScholarshipSection />
      <BenefitsSection />
      <DonateSection />
      <NewsSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
