
import { motion } from "framer-motion";
import Hero from "@/components/home/Hero";
import Concept from "@/components/home/Concept";
import FeaturedBook from "@/components/home/FeaturedBook";
import ARTechnology from "@/components/home/ARTechnology";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Logo from "@/components/layout/Logo";

const Index = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Header />
      <main>
        <div className="container mx-auto px-4 py-8 flex justify-center">
          <Logo isSquare={true} className="w-24 h-24 shadow-lg" />
        </div>
        <Hero />
        <Concept />
        <FeaturedBook />
        <ARTechnology />
      </main>
      <Footer />
    </motion.div>
  );
};

export default Index;
