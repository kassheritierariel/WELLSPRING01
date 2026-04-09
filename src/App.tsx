import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Navbar from "./components/Navbar";
import ProductCard from "./components/ProductCard";
import BrandGenerator from "./components/BrandGenerator";
import Footer from "./components/Footer";
import Checkout from "./components/Checkout";
import { PRODUCTS, Product } from "./types";
import { Sparkles, ArrowRight, ShieldCheck, Zap } from "lucide-react";
import { HeroSlider, ProductCarousel, TestimonialSlider, BrandTicker } from "./components/HomeSliders";

export default function App() {
  const [activeSection, setActiveSection] = useState("home");
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [selectedProductForCheckout, setSelectedProductForCheckout] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const handleBuy = (product: Product) => {
    setSelectedProductForCheckout(product);
    setIsCheckoutOpen(true);
  };

  useEffect(() => {
    // Simulate initial load
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-wellspring-cream flex items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-16 h-16 border-4 border-wellspring-green border-t-wellspring-gold rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-wellspring-cream selection:bg-wellspring-gold selection:text-white">
      <Navbar activeSection={activeSection} setActiveSection={setActiveSection} />

      <main>
        <AnimatePresence mode="wait">
          {activeSection === "home" && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <HeroSlider />
              <BrandTicker />

              {/* How it Works Section */}
              <motion.section 
                id="how-it-works" 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="py-24 bg-wellspring-green text-white relative overflow-hidden"
              >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                  <motion.div 
                    initial={{ y: 50, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-center mb-20"
                  >
                    <h2 className="text-5xl font-black mb-6 tracking-tight">Notre Processus de Transformation</h2>
                    <p className="text-white/70 max-w-2xl mx-auto text-lg">
                      De la récolte à la poudre fine, chaque étape est maîtrisée pour garantir une pureté absolue et une saveur intacte.
                    </p>
                  </motion.div>

                  <div className="grid md:grid-cols-4 gap-8">
                    {[
                      { step: "01", title: "Sélection Rigoureuse", desc: "Nous choisissons uniquement les meilleurs fruits et épices de nos producteurs locaux." },
                      { step: "02", title: "Nettoyage Purifiant", desc: "Un lavage minutieux pour éliminer toute impureté tout en préservant la peau riche en nutriments." },
                      { step: "03", title: "Séchage Doux", desc: "Notre technologie de séchage à basse température conserve 100% des vitamines et arômes." },
                      { step: "04", title: "Broyage Fin", desc: "Une mouture cryogénique pour obtenir une poudre soyeuse, sans altération thermique." }
                    ].map((item, i) => (
                      <motion.div 
                        key={i}
                        initial={{ y: 30, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 * i }}
                        className="relative p-8 rounded-[40px] bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all group"
                      >
                        <span className="text-6xl font-black text-wellspring-gold/20 absolute top-4 right-8 group-hover:text-wellspring-gold/40 transition-colors">{item.step}</span>
                        <h3 className="text-2xl font-bold mb-4 mt-8">{item.title}</h3>
                        <p className="text-white/60 leading-relaxed">{item.desc}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
                {/* Decorative elements */}
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                  <div className="absolute top-20 left-10 w-64 h-64 bg-wellspring-gold rounded-full blur-[120px]" />
                  <div className="absolute bottom-20 right-10 w-96 h-96 bg-white rounded-full blur-[150px]" />
                </div>
              </motion.section>

              <ProductCarousel />
              
              {/* Services Section */}
              <motion.section 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="py-24 bg-white"
              >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-20"
                  >
                    <h2 className="text-5xl font-black text-wellspring-green mb-4 tracking-tight">Pourquoi Choisir Wellspring ?</h2>
                    <p className="text-wellspring-earth/60 max-w-2xl mx-auto text-lg">
                      Nous allions tradition et innovation pour vous offrir le meilleur de la nature congolaise.
                    </p>
                  </motion.div>

                  <div className="grid md:grid-cols-3 gap-12">
                    {[
                      {
                        title: "Pureté Inégalée",
                        desc: "Aucun additif, aucun conservateur, aucun colorant. Juste le fruit ou l'épice dans sa forme la plus pure.",
                        icon: ShieldCheck,
                        color: "bg-wellspring-green/10 text-wellspring-green"
                      },
                      {
                        title: "Nutriments Préservés",
                        desc: "Grâce à notre séchage à froid, les vitamines et minéraux restent intacts pour votre santé.",
                        icon: Zap,
                        color: "bg-wellspring-gold/10 text-wellspring-gold"
                      },
                      {
                        title: "Impact Local",
                        desc: "En travaillant directement avec les agriculteurs de la RDC, nous soutenons l'économie locale durable.",
                        icon: Sparkles,
                        color: "bg-wellspring-green/10 text-wellspring-green"
                      }
                    ].map((service, i) => (
                      <motion.div 
                        key={i}
                        initial={{ x: i % 2 === 0 ? -50 : 50, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 * i }}
                        className="flex flex-col items-center text-center p-10 rounded-[50px] border border-wellspring-gold/10 hover:border-wellspring-gold/40 transition-all hover:shadow-xl hover:shadow-wellspring-gold/5 group"
                      >
                        <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform ${service.color}`}>
                          <service.icon size={40} />
                        </div>
                        <h3 className="text-2xl font-bold mb-4 text-wellspring-green">{service.title}</h3>
                        <p className="text-wellspring-earth/70 leading-relaxed text-lg">{service.desc}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.section>

              <TestimonialSlider />

              {/* Wholesale/Retail Banner */}
              <motion.section 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="py-20 bg-wellspring-green text-white overflow-hidden relative"
              >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                    <motion.div 
                      initial={{ x: -50, opacity: 0 }}
                      whileInView={{ x: 0, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      className="max-w-xl"
                    >
                      <h2 className="text-5xl mb-6 leading-tight">Vente en Gros & Détail pour Supermarchés</h2>
                      <p className="text-white/70 text-lg mb-8">
                        Nous fournissons les plus grandes enseignes de la RDC. Profitez de tarifs préférentiels pour vos commandes en volume.
                      </p>
                      <button className="pill-button bg-wellspring-gold text-white px-8 py-4 text-lg flex items-center gap-2 hover:bg-wellspring-gold/90">
                        Devenir Partenaire <ArrowRight size={20} />
                      </button>
                    </motion.div>
                    <motion.div 
                      initial={{ x: 50, opacity: 0 }}
                      whileInView={{ x: 0, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.4 }}
                      className="grid grid-cols-2 gap-4 w-full md:w-auto"
                    >
                      <div className="bg-white/10 backdrop-blur-md p-8 rounded-[32px] text-center border border-white/20">
                        <span className="block text-4xl font-bold mb-2">500+</span>
                        <span className="text-xs uppercase tracking-widest opacity-60">Points de Vente</span>
                      </div>
                      <div className="bg-white/10 backdrop-blur-md p-8 rounded-[32px] text-center border border-white/20">
                        <span className="block text-4xl font-bold mb-2">10t+</span>
                        <span className="text-xs uppercase tracking-widest opacity-60">Produit / Mois</span>
                      </div>
                    </motion.div>
                  </div>
                </div>
                {/* Decorative circles */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-wellspring-gold/10 rounded-full blur-3xl -mr-48 -mt-48" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -ml-48 -mb-48" />
              </motion.section>
            </motion.div>
          )}

          {activeSection === "products" && (
            <motion.section
              key="products"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="pt-32 pb-24"
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                  <h2 className="text-5xl text-wellspring-green mb-4">Notre Catalogue Naturel</h2>
                  <p className="text-wellspring-earth/60 max-w-2xl mx-auto">
                    Découvrez notre gamme de poudres de fruits et épices, 100% pures et prêtes à l'emploi.
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {products.map((product) => (
                    <ProductCard 
                      key={product.id} 
                      product={product} 
                      onBuy={handleBuy}
                    />
                  ))}
                </div>
              </div>
            </motion.section>
          )}

          {activeSection === "brand" && (
            <motion.div
              key="brand"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="pt-32"
            >
              <BrandGenerator 
                products={products} 
                onAddProduct={(newProduct) => setProducts([...products, newProduct])} 
                onUpdateProduct={(updatedProduct) => {
                  setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p));
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />

      <Checkout 
        product={selectedProductForCheckout} 
        isOpen={isCheckoutOpen} 
        onClose={() => setIsCheckoutOpen(false)} 
      />
    </div>
  );
}
