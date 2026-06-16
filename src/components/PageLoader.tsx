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
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="absolute inset-0 w-full h-full overflow-hidden"
          >
            {/* The brand video loader - set to object-cover to make it truly full screen without bars */}
            <video
              src={loaderscreenVideo.url}
              poster={loaderPoster.url}
              autoPlay
              muted
              playsInline
              loop
              className="w-full h-full object-cover"
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
