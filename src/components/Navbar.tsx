import { motion } from "motion/react";
import { Leaf, ShoppingBag, QrCode, Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/src/lib/utils";

interface NavbarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export default function Navbar({ activeSection, setActiveSection }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: "home", label: "Accueil", icon: Leaf },
    { id: "products", label: "Produits", icon: ShoppingBag },
    { id: "brand", label: "Générateur de Brand", icon: QrCode },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-wellspring-cream/80 backdrop-blur-md border-b border-wellspring-gold/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
            <div 
            className="flex items-center gap-2 cursor-pointer" 
            onClick={() => setActiveSection("home")}
          >
            <img 
              src="https://storage.googleapis.com/test-media-antigravity/logo_wellspring.png" 
              alt="Wellspring Logo" 
              className="w-10 h-10 object-contain"
              referrerPolicy="no-referrer"
            />
            <span className="text-2xl font-serif font-bold text-wellspring-green tracking-tight">
              Wellspring <span className="text-wellspring-gold">RDC</span>
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-wellspring-green relative py-2",
                  activeSection === item.id ? "text-wellspring-green" : "text-wellspring-earth/60"
                )}
              >
                {item.label}
                {activeSection === item.id && (
                  <motion.div
                    layoutId="nav-underline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-wellspring-green"
                  />
                )}
              </button>
            ))}
            <button className="pill-button bg-wellspring-green text-white hover:bg-wellspring-green/90">
              Contactez-nous
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-wellspring-earth">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-white border-b border-wellspring-gold/10 px-4 py-6 flex flex-col gap-4"
        >
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveSection(item.id);
                setIsOpen(false);
              }}
              className={cn(
                "flex items-center gap-3 text-lg font-medium p-3 rounded-xl",
                activeSection === item.id ? "bg-wellspring-green/10 text-wellspring-green" : "text-wellspring-earth/60"
              )}
            >
              <item.icon size={20} />
              {item.label}
            </button>
          ))}
          <button className="pill-button bg-wellspring-green text-white w-full py-4 mt-2">
            Contactez-nous
          </button>
        </motion.div>
      )}
    </nav>
  );
}
