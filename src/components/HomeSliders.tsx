import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';
import { motion } from 'motion/react';
import { ArrowRight, Star, Quote, ShieldCheck, Zap, Sparkles } from 'lucide-react';
import { PRODUCTS } from '../types';
import ProductCard from './ProductCard';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

export function HeroSlider() {
  const slides = [
    {
      title: "L'Art de la Pureté en Poudre",
      subtitle: "Transformation Naturelle & Pure",
      desc: "Wellspring RDC révolutionne la conservation naturelle. Nous transformons les trésors de notre terre en poudres d'exception.",
      image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=1200",
      color: "text-wellspring-green"
    },
    {
      title: "Saveurs Authentiques du Congo",
      subtitle: "100% Naturel & Sans Additifs",
      desc: "Découvrez la richesse de nos épices et fruits transformés avec soin pour préserver chaque nuance aromatique.",
      image: "https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&q=80&w=1200",
      color: "text-wellspring-gold"
    },
    {
      title: "Technologie de Pointe",
      subtitle: "Séchage à Basse Température",
      desc: "Notre processus innovant garantit la conservation de 100% des nutriments et vitamines de nos produits.",
      image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1200",
      color: "text-wellspring-green"
    },
    {
      title: "Impact Local Durable",
      subtitle: "Soutien aux Producteurs",
      desc: "En choisissant Wellspring, vous participez au développement de l'agriculture locale en République Démocratique du Congo.",
      image: "https://images.unsplash.com/photo-1591033594798-33227a05780d?auto=format&fit=crop&q=80&w=1200",
      color: "text-wellspring-gold"
    }
  ];

  return (
    <div className="relative h-[800px] w-full overflow-hidden">
      <Swiper
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        effect="fade"
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation
        loop
        className="h-full w-full"
      >
        {slides.map((slide, i) => (
          <SwiperSlide key={i}>
            <div className="relative h-full w-full">
              <img 
                src={slide.image} 
                alt={slide.title}
                className="absolute inset-0 h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-wellspring-cream via-wellspring-cream/80 to-transparent" />
              
              <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
                <div className="max-w-2xl">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                  >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-wellspring-green/10 text-wellspring-green text-sm font-semibold mb-6">
                      <Sparkles size={16} />
                      <span>{slide.subtitle}</span>
                    </div>
                    <h1 className={`text-6xl md:text-8xl font-black leading-[0.85] mb-8 tracking-tighter ${slide.color}`}>
                      {slide.title}
                    </h1>
                    <p className="text-xl text-wellspring-earth/70 mb-10 leading-relaxed font-medium">
                      {slide.desc}
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <button 
                        onClick={() => document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' })}
                        className="pill-button bg-wellspring-green text-white px-10 py-5 text-lg flex items-center gap-3 hover:shadow-2xl hover:shadow-wellspring-green/30 transition-all hover:-translate-y-1"
                      >
                        Explorer le Catalogue <ArrowRight size={20} />
                      </button>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export function ProductCarousel() {
  return (
    <section className="py-24 bg-wellspring-cream/50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-4xl font-black text-wellspring-green mb-4">Nos Incontournables</h2>
            <p className="text-wellspring-earth/60">Les produits les plus plébiscités par nos partenaires.</p>
          </div>
          <div className="hidden md:flex gap-2">
            <div className="swiper-button-prev-custom cursor-pointer p-3 rounded-full border border-wellspring-green/20 text-wellspring-green hover:bg-wellspring-green hover:text-white transition-all">
              <ArrowRight className="rotate-180" size={24} />
            </div>
            <div className="swiper-button-next-custom cursor-pointer p-3 rounded-full border border-wellspring-green/20 text-wellspring-green hover:bg-wellspring-green hover:text-white transition-all">
              <ArrowRight size={24} />
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8">
        <Swiper
          modules={[Navigation, Autoplay]}
          navigation={{
            prevEl: '.swiper-button-prev-custom',
            nextEl: '.swiper-button-next-custom',
          }}
          autoplay={{ delay: 3000 }}
          breakpoints={{
            640: { slidesPerView: 2, spaceBetween: 20 },
            1024: { slidesPerView: 3, spaceBetween: 30 },
            1280: { slidesPerView: 4, spaceBetween: 30 },
          }}
          className="!overflow-visible"
        >
          {PRODUCTS.map((product) => (
            <SwiperSlide key={product.id}>
              <ProductCard product={product} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}

export function TestimonialSlider() {
  const testimonials = [
    {
      name: "Jean-Pierre Kabila",
      role: "Gérant, Supermarché Kin-Marché",
      text: "La qualité des poudres Wellspring est exceptionnelle. Nos clients adorent la pureté du produit et le packaging est très professionnel.",
      rating: 5
    },
    {
      name: "Marie-Claire Mwamba",
      role: "Chef de Cuisine, Restaurant Le Gourmet",
      text: "L'ail et le gingembre en poudre de Wellspring ont transformé ma cuisine. Un gain de temps précieux sans sacrifier le goût authentique.",
      rating: 5
    },
    {
      name: "David Tshimanga",
      role: "Distributeur Agro-alimentaire",
      text: "Un partenaire fiable avec une vision claire. Wellspring est la preuve que la transformation locale peut atteindre des standards mondiaux.",
      rating: 5
    }
  ];

  return (
    <section className="py-24 bg-wellspring-green text-white overflow-hidden relative">
      <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
        <Quote className="mx-auto mb-8 text-wellspring-gold opacity-50" size={64} />
        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 6000 }}
          pagination={{ clickable: true }}
          className="pb-16"
        >
          {testimonials.map((t, i) => (
            <SwiperSlide key={i}>
              <div className="flex flex-col items-center">
                <div className="flex gap-1 mb-6">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} size={20} className="fill-wellspring-gold text-wellspring-gold" />
                  ))}
                </div>
                <p className="text-3xl md:text-4xl font-medium italic mb-8 leading-relaxed">
                  "{t.text}"
                </p>
                <h4 className="text-xl font-bold text-wellspring-gold">{t.name}</h4>
                <span className="text-white/60 uppercase tracking-widest text-sm">{t.role}</span>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-wellspring-gold rounded-full blur-[120px]" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-white rounded-full blur-[150px]" />
      </div>
    </section>
  );
}

export function BrandTicker() {
  const logos = [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/1024px-Amazon_logo.svg.png",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/1024px-Google_2015_logo.svg.png",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/IBM_logo.svg/1024px-IBM_logo.svg.png",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/1024px-Netflix_2015_logo.svg.png",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Apple_logo_grey.svg/1024px-Apple_logo_grey.svg.png"
  ];

  return (
    <div className="py-12 bg-white border-y border-wellspring-gold/10">
      <div className="max-w-7xl mx-auto px-4">
        <p className="text-center text-xs font-bold uppercase tracking-[0.3em] text-wellspring-earth/40 mb-8">Ils nous font confiance</p>
        <Swiper
          modules={[Autoplay]}
          slidesPerView={2}
          spaceBetween={30}
          loop={true}
          autoplay={{
            delay: 0,
            disableOnInteraction: false,
          }}
          speed={5000}
          breakpoints={{
            640: { slidesPerView: 3 },
            1024: { slidesPerView: 5 },
          }}
          className="ticker-swiper"
        >
          {/* Duplicate logos for seamless loop */}
          {[...logos, ...logos].map((logo, i) => (
            <SwiperSlide key={i}>
              <div className="h-12 flex items-center justify-center grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer">
                <img src={logo} alt="Partner" className="h-full object-contain" referrerPolicy="no-referrer" />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
