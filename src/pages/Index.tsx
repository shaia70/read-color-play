
import { motion } from "framer-motion";
import Hero from "@/components/home/Hero";
import Concept from "@/components/home/Concept";
import FeaturedBook from "@/components/home/FeaturedBook";
import ARTechnology from "@/components/home/ARTechnology";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

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
