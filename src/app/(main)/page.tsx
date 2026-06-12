import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/ui/HeroSection';
import WelcomeSection from '@/components/ui/WelcomeSection';
import AboutSection from '@/components/ui/AboutSection';
import ScheduleSection from '@/components/ui/ScheduleSection';
import SpeakersSection from '@/components/ui/SpeakersSection';
import SponsorsSection from '@/components/ui/SponsorsSection';
import FaqSection from '@/components/ui/FaqSection';
import TicketsSection from '@/components/ui/TicketsSection';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <WelcomeSection />
        <AboutSection />
        <ScheduleSection />
        <SpeakersSection />
        <TicketsSection />
        <SponsorsSection />
        <FaqSection />
      </main>
      <Footer />
    </>
  );
}
