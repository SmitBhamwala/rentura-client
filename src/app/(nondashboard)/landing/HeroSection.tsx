"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NAVBAR_HEIGHT } from "@/lib/constants";
import { motion } from "framer-motion";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section
      className="relative"
      style={{ height: `calc(100vh - ${NAVBAR_HEIGHT}px)` }}>
      <Image
        src="/landing-splash.jpg"
        alt="Rentura Rental Platform Hero Section"
        fill
        className="object-cover object-center"
        priority
      />
      <div className="absolute inset-0 bg-black/60"></div>
      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}>
        <div className="max-w-5xl mx-auto px-16 sm:px-12">
          <h1 className="text-5xl font-bold leading-14 text-white mb-4">
            Start your journey to find the perfect place to call home
          </h1>
          <p className="text-xl text-white mb-8">
            Explore our wide range of rental apartments tailored to fit your
            lifestyle and needs!
          </p>
          <div className="flex justify-center">
            <Input
              type="text"
              value=""
              onChange={() => {}}
              placeholder="Search by city, neighborhood, or address"
              className="h-12 w-full max-w-lg rounded-none rounded-l-xl border-none bg-white focus-visible:ring-0"
            />
            <Button
              variant="secondary"
              className="h-12 bg-secondary-600 text-white rounded-none rounded-r-xl hover:bg-secondary-700 cursor-pointer">
              Get Started
            </Button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

{
  /* <div className="flex flex-col items-center justify-center h-[calc(100vh-52px)] bg-gradient-to-b from-primary-700 to-primary-900 text-white">
  <h1 className="text-5xl font-bold mb-4">Welcome to Rentura</h1>
  <p className="text-lg mb-8">
    Discover your perfect rental apartment with our advanced search
  </p>
  <button className="bg-secondary-600 text-white py-2 px-4 rounded-lg hover:bg-secondary-500 transition duration-300">
    Get Started
  </button>
</div>; */
}

// <motion.div
//   className="absolute inset-0 flex flex-col items-center justify-center text-white z-10"
//   initial={{ opacity: 0 }}
//   animate={{ opacity: 1 }}
//   transition={{ duration: 0.5 }}>
//   <h1 className="text-5xl font-bold mb-4">Welcome to Rentura</h1>
//   <p className="text-lg mb-8">
//     Discover your perfect rental apartment with our advanced search
//   </p>
//   <button className="bg-secondary-600 text-white py-2 px-4 rounded-lg hover:bg-secondary-500 transition duration-300">
//     Get Started
//   </button>
// </motion.div>;
