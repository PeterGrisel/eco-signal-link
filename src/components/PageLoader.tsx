import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import loaderscreenVideo from "@/assets/loaderscreen.mp4.asset.json";
import loaderPoster from "@/assets/loader-poster.jpg.asset.json";

const PageLoader = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Keep loader active for 2.2s to showcase the stunning brand loop
    const timer = setTimeout(() => setLoading(false), 2200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence mode="wait">
      {loading ? (
        <motion.div
          key="loader"
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#05070f]"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative w-full h-full flex items-center justify-center overflow-hidden"
          >
            {/* Ambient background glow */}
            <div className="absolute inset-0 bg-radial-gradient from-primary/10 via-transparent to-transparent pointer-events-none" />
            
            {/* The brand video loader */}
            <video
              src={loaderscreenVideo.url}
              poster={loaderPoster.url}
              autoPlay
              muted
              playsInline
              loop
              className="w-full h-full max-w-[1200px] max-h-[75vh] object-contain px-4 md:px-8 drop-shadow-[0_0_50px_rgba(232,148,90,0.15)]"
            />
          </motion.div>
        </motion.div>
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PageLoader;
