import { Leaf, Mail, Phone, MapPin, Instagram, Facebook, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-wellspring-green text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <img 
                src="https://storage.googleapis.com/test-media-antigravity/logo_wellspring.png" 
                alt="Wellspring Logo" 
                className="w-10 h-10 object-contain brightness-0 invert"
                referrerPolicy="no-referrer"
              />
              <span className="text-3xl font-serif font-bold tracking-tight">
                Wellspring <span className="text-wellspring-gold">RDC</span>
              </span>
            </div>
            <p className="text-white/70 max-w-md leading-relaxed mb-8">
              Nous sommes dédiés à la transformation durable et naturelle des richesses agricoles de la RDC. Notre mission est de fournir des produits purs, sains et accessibles à tous.
            </p>
            <div className="flex gap-4">
              {[
                { Icon: Instagram, href: "https://instagram.com/wellspringrdc", label: "Instagram" },
                { Icon: Facebook, href: "https://facebook.com/wellspringrdc", label: "Facebook" },
                { Icon: Twitter, href: "https://twitter.com/wellspringrdc", label: "Twitter" }
              ].map(({ Icon, href, label }, i) => (
                <a 
                  key={i} 
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-wellspring-green transition-colors"
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xl font-serif mb-6 text-wellspring-gold">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-white/70">
                <Mail size={18} className="text-wellspring-gold" />
                <span>contact@wellspringrdc.com</span>
              </li>
              <li className="flex items-center gap-3 text-white/70">
                <Phone size={18} className="text-wellspring-gold" />
                <span>+243 818 261 297</span>
              </li>
              <li className="flex items-center gap-3 text-white/70">
                <MapPin size={18} className="text-wellspring-gold" />
                <span>Kinshasa, Gombe, RDC</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-serif mb-6 text-wellspring-gold">Liens Rapides</h4>
            <ul className="space-y-4 text-white/70">
              <li><button className="hover:text-wellspring-gold transition-colors">Nos Services</button></li>
              <li><button className="hover:text-wellspring-gold transition-colors">Catalogue Produits</button></li>
              <li><button className="hover:text-wellspring-gold transition-colors">Devenir Revendeur</button></li>
              <li><button className="hover:text-wellspring-gold transition-colors">Mentions Légales</button></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/40">
          <p>© 2026 Wellspring RDC. Tous droits réservés.</p>
          <p>Made with ❤️ for RDC Agriculture</p>
        </div>
      </div>
    </footer>
  );
}
