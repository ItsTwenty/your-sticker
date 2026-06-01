import { useState } from "react";
import Navbar from "./components/Navbar";
import MobileDrawer from "./components/MobileDrawer";

function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <Navbar
        menuOpen={menuOpen}
        onToggleMenu={() => setMenuOpen((prev) => !prev)}
        cartCount={2}
      />

      <MobileDrawer open={menuOpen} onClose={() => setMenuOpen(false)} />

      <main className="pt-14">
        <section className="h-screen flex flex-col items-center justify-center px-6 text-center">
          <span className="text-5xl mb-6">✦</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-black mb-3">
            Your Sticker
          </h1>
          <p className="text-gray-500 text-base max-w-md mb-8">
                Premium custom stickers, crafted for your brand.
          </p>
        </section>
      </main>
    </div>
  );
}

export default App;
