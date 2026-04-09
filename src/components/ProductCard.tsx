import React from "react";
import { motion } from "motion/react";
import { ShoppingCart, Plus } from "lucide-react";
import { Product } from "@/src/types";

interface ProductCardProps {
  product: Product;
  onBuy?: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onBuy }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="organic-card group"
    >
      <div className="relative h-64 overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-wellspring-green uppercase tracking-wider">
          {product.category === "fruit" ? "Fruit" : "Épice"}
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-2xl text-wellspring-green">{product.name}</h3>
          <span className="text-xl font-bold text-wellspring-gold">${product.price}</span>
        </div>
        <p className="text-sm text-wellspring-earth/70 mb-4 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-6">
          {product.benefits.slice(0, 2).map((benefit, i) => (
            <span key={i} className="text-[10px] font-bold uppercase tracking-widest bg-wellspring-green/5 text-wellspring-green/70 px-2 py-1 rounded">
              {benefit}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => onBuy?.(product)}
            className="flex-1 pill-button bg-wellspring-green text-white flex items-center justify-center gap-2 hover:bg-wellspring-green/90"
          >
            <ShoppingCart size={18} /> Acheter
          </button>
          <button className="w-12 h-12 rounded-full border-2 border-wellspring-gold/20 flex items-center justify-center text-wellspring-gold hover:bg-wellspring-gold hover:text-white transition-colors">
            <Plus size={20} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
