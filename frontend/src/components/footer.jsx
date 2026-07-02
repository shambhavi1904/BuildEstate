import { Home } from "lucide-react";
import { motion } from "framer-motion";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-20">

      <div className="max-w-7xl mx-auto px-6 py-14">

        {/* Logo & Description */}
        <div className="flex flex-col items-center text-center">

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg mb-5"
          >
            <Home className="w-8 h-8 text-white" />
          </motion.div>

          <h2 className="text-3xl font-bold text-white">
            BuildEstate
          </h2>

          <p className="text-blue-400 font-medium mt-2 text-lg">
            AI Powered Real Estate
          </p>

          <p className="max-w-2xl mt-5 text-gray-300 leading-7">
            Find, explore and manage properties with intelligent
            search and AI-powered recommendations designed to make
            property discovery simple and efficient.
          </p>

        </div>

        {/* Navigation */}

        <div className="flex justify-center gap-10 mt-10 text-gray-300">

          <a
            href="/"
            className="hover:text-blue-400 transition"
          >
            Home
          </a>

          <a
            href="/properties"
            className="hover:text-blue-400 transition"
          >
            Properties
          </a>

          <a
            href="/ai-agent"
            className="hover:text-blue-400 transition"
          >
            AI Property Hub
          </a>

        </div>

        {/* Copyright */}

        <div className="border-t border-gray-700 mt-12 pt-6 text-center">

          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} BuildEstate. All rights reserved.
          </p>

        </div>

      </div>

    </footer>
  );
};

export default Footer;