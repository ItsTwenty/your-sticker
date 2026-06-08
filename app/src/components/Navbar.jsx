import { motion } from "framer-motion";

const lineVariants = {
  closed: (i) => ({
    rotate: 0,
    y: 0,
    opacity: 1,
    transition: { delay: i * 0.05, duration: 0.25, ease: "easeInOut" },
  }),
  open: (i) => {
    if (i === 0) return { rotate: 45, y: 5, transition: { duration: 0.25, ease: "easeInOut" } };
    if (i === 1) return { opacity: 0, transition: { duration: 0.15 } };
    return { rotate: -45, y: -5, transition: { duration: 0.25, ease: "easeInOut" } };
  },
};

export default function Navbar({ menuOpen, onToggleMenu, cartCount = 0 }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-30 bg-white/80 backdrop-blur-lg border-b border-gray-100/80">
      <div className="flex items-center justify-between h-14 px-5 max-w-7xl mx-auto">
        <a href="#" className="flex items-center">
          <img src="/logo.png" alt="Your Sticker" className="h-8 w-auto" />
        </a>

        <div className="flex items-center gap-3">
          <button
            className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Shopping cart"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 flex items-center justify-center rounded-full bg-black text-white text-[0.5rem] font-bold">
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </button>

          <button
            onClick={onToggleMenu}
            className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="overflow-visible">
              <motion.line
                x1="3" y1="5" x2="17" y2="5"
                variants={lineVariants}
                custom={0}
                initial={false}
                animate={menuOpen ? "open" : "closed"}
              />
              <motion.line
                x1="3" y1="10" x2="17" y2="10"
                variants={lineVariants}
                custom={1}
                initial={false}
                animate={menuOpen ? "open" : "closed"}
              />
              <motion.line
                x1="3" y1="15" x2="17" y2="15"
                variants={lineVariants}
                custom={2}
                initial={false}
                animate={menuOpen ? "open" : "closed"}
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
