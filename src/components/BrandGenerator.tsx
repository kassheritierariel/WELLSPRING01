import React, { useState, useRef, ChangeEvent, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { QRCodeSVG } from "qrcode.react";
import Barcode from "react-barcode";
import { Download, Share2, RefreshCw, Printer, Tag, Plus, Image as ImageIcon, Loader2, Search, Sparkles, Calendar, Star, Video } from "lucide-react";
import { Product } from "@/src/types";
import { cn } from "@/src/lib/utils";
import { GoogleGenAI } from "@google/genai";
import DatePicker from "./DatePicker";

declare global {
  interface Window {
    aistudio?: {
      hasSelectedApiKey?: () => Promise<boolean>;
      openSelectKey?: () => Promise<void>;
    };
  }
}

interface BrandGeneratorProps {
  products: Product[];
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
}

export default function BrandGenerator({ products, onAddProduct, onUpdateProduct }: BrandGeneratorProps) {
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || "");
  const [customBrandName, setCustomBrandName] = useState(products[0]?.name || "");
  const [customWeight, setCustomWeight] = useState(products[0]?.unit || "");
  const [batchNumber, setBatchNumber] = useState("B-" + Math.floor(Math.random() * 10000));
  const [mfgDate, setMfgDate] = useState(new Date().toISOString().split('T')[0]);
  const [expDate, setExpDate] = useState(new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]);
  const [previewMode, setPreviewMode] = useState<"label" | "packaging">("label");
  const [labelSaturation, setLabelSaturation] = useState(44);
  const [customPackagingImage, setCustomPackagingImage] = useState<string | null>(null);
  const [packagingBorderColor, setPackagingBorderColor] = useState("#d4af37");
  const [packagingBorderThickness, setPackagingBorderThickness] = useState(4);
  const [packagingBrightness, setPackagingBrightness] = useState(100);
  const [packagingContrast, setPackagingContrast] = useState(100);
  const [packagingFilter, setPackagingFilter] = useState<"none" | "sepia" | "grayscale" | "vintage" | "invert" | "hue-rotate" | "cold" | "warm">("none");
  const [inkDensity, setInkDensity] = useState(100);
  const [paperTexture, setPaperTexture] = useState(100);
  const [dateError, setDateError] = useState<string | null>(null);
  const [mfgError, setMfgError] = useState(false);
  const [expError, setExpError] = useState(false);
  const labelRef = useRef<HTMLDivElement>(null);
  const [qrType, setQrType] = useState<"product" | "website">("product");
  const [qrBorderColor, setQrBorderColor] = useState("#d4af37");
  const [qrBorderWidth, setQrBorderWidth] = useState(1);
  const [qrBorderRadius, setQrBorderRadius] = useState(2);
  const [packagingRotation, setPackagingRotation] = useState(0);
  const [packagingDepth, setPackagingDepth] = useState(20);
  const [isAutoRotating, setIsAutoRotating] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [initialRotation, setInitialRotation] = useState(0);
  const [imageSize, setImageSize] = useState<"1K" | "2K" | "4K">("1K");
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [videoStatus, setVideoStatus] = useState<string>("");
  const [hasApiKey, setHasApiKey] = useState(false);

  useEffect(() => {
    const checkApiKey = async () => {
      if (window.aistudio?.hasSelectedApiKey) {
        const selected = await window.aistudio.hasSelectedApiKey();
        setHasApiKey(selected);
      }
    };
    checkApiKey();
  }, []);

  const handleOpenKeySelector = async () => {
    if (window.aistudio?.openSelectKey) {
      await window.aistudio.openSelectKey();
      setHasApiKey(true);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAutoRotating) {
      interval = setInterval(() => {
        setPackagingRotation((prev) => (prev >= 180 ? -180 : prev + 2));
      }, 50);
    }
    return () => clearInterval(interval);
  }, [isAutoRotating]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Product Creation State
  const [showCreateProduct, setShowCreateProduct] = useState(false);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: "",
    description: "",
    price: 0,
    unit: "250g",
    category: "fruit",
    image: "",
    imageAlt: "",
    benefits: ["100% Naturel"]
  });

  // Image Generation State
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isGeneratingPackaging, setIsGeneratingPackaging] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [imagePrompt, setImagePrompt] = useState("");
  const [packagingStyle, setPackagingStyle] = useState("Premium & Minimaliste");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedProduct = products.find(p => p.id === selectedProductId) || products[0];
  
  const handleProductChange = (id: string) => {
    const product = products.find(p => p.id === id);
    if (product) {
      setSelectedProductId(id);
      setCustomBrandName(product.name);
      setCustomWeight(product.unit);
    }
  };
  
  // The URL that the QR code will link to
  const productUrl = `https://wellspringrdc.com/product/${selectedProduct.id}?batch=${batchNumber}`;

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    setDragStartX(e.clientX);
    setInitialRotation(packagingRotation);
    setIsAutoRotating(false);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStartX;
    const sensitivity = 0.5;
    let newRotation = initialRotation + deltaX * sensitivity;
    
    while (newRotation > 180) newRotation -= 360;
    while (newRotation < -180) newRotation += 360;
    
    setPackagingRotation(newRotation);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const generateNewBatch = () => {
    setBatchNumber("B-" + Math.floor(Math.random() * 10000));
  };

  const validateDates = (mfg: string, exp: string) => {
    const mfgDateObj = new Date(mfg);
    const expDateObj = new Date(exp);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const twoYearsAgo = new Date();
    twoYearsAgo.setFullYear(today.getFullYear() - 2);

    const fiveYearsFromNow = new Date();
    fiveYearsFromNow.setFullYear(today.getFullYear() + 5);

    setMfgError(false);
    setExpError(false);
    setDateError(null);

    if (isNaN(mfgDateObj.getTime())) {
      setMfgError(true);
      setDateError("Format de date de fabrication invalide.");
      return false;
    }
    if (isNaN(expDateObj.getTime())) {
      setExpError(true);
      setDateError("Format de date d'expiration invalide.");
      return false;
    }

    if (mfgDateObj > today) {
      setMfgError(true);
      setDateError("La date de fabrication ne peut pas être dans le futur.");
      return false;
    }
    if (mfgDateObj < twoYearsAgo) {
      setMfgError(true);
      setDateError("La date de fabrication est trop ancienne (plus de 2 ans).");
      return false;
    }

    if (expDateObj <= today) {
      setExpError(true);
      setDateError("La date d'expiration doit être une date future (postérieure à aujourd'hui).");
      return false;
    }

    if (expDateObj <= mfgDateObj) {
      setExpError(true);
      setDateError("La date d'expiration ne peut pas être antérieure ou égale à la date de fabrication.");
      return false;
    }

    if (expDateObj > fiveYearsFromNow) {
      setDateError("Attention : La durée de conservation indiquée (plus de 5 ans) est inhabituelle.");
    }

    return true;
  };

  const handleMfgDateChange = (date: string) => {
    setMfgDate(date);
    validateDates(date, expDate);
  };

  const handleExpDateChange = (date: string) => {
    setExpDate(date);
    validateDates(mfgDate, date);
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomPackagingImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateProduct = () => {
    if (!newProduct.name) return;
    const id = newProduct.name.toLowerCase().replace(/\s+/g, '-');
    const productToAdd: Product = {
      id,
      name: newProduct.name,
      description: newProduct.description || "",
      price: newProduct.price || 0,
      unit: newProduct.unit || "250g",
      category: newProduct.category as "fruit" | "spice",
      image: newProduct.image || generatedImage || "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&q=80&w=800",
      imageAlt: newProduct.imageAlt || newProduct.name,
      benefits: newProduct.benefits || ["100% Naturel"]
    };
    onAddProduct(productToAdd);
    setSelectedProductId(id);
    setCustomBrandName(productToAdd.name);
    setCustomWeight(productToAdd.unit);
    setShowCreateProduct(false);
    setNewProduct({
      name: "",
      description: "",
      price: 0,
      unit: "250g",
      category: "fruit",
      image: "",
      imageAlt: "",
      benefits: ["100% Naturel"]
    });
    setGeneratedImage(null);
  };

  const handleUpdateProduct = () => {
    if (!selectedProduct) return;
    onUpdateProduct({
      ...selectedProduct,
      name: customBrandName,
      unit: customWeight
    });
  };

  const generateAmbientImage = async () => {
    if (!imagePrompt) return;
    setIsGeneratingImage(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            {
              text: `A professional, high-quality ambient product photo of ${imagePrompt} for a premium natural brand called Wellspring. Natural lighting, organic background, aesthetic composition.`,
            },
          ],
        },
        config: {
          imageConfig: {
            aspectRatio: "1:1",
          },
        },
      });

      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const base64EncodeString = part.inlineData.data;
          setGeneratedImage(`data:image/png;base64,${base64EncodeString}`);
          break;
        }
      }
    } catch (error) {
      console.error("Error generating image:", error);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const generatePackagingMockup = async () => {
    if (!hasApiKey) {
      handleOpenKeySelector();
      return;
    }
    setIsGeneratingPackaging(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: {
          parts: [
            {
              text: `A professional, high-end commercial product packaging background design for a premium brand called Wellspring. 
              Style: ${packagingStyle}. 
              Product: ${selectedProduct.name}. 
              The design should be a vertical (portrait) background pattern or abstract composition that conveys natural quality, health, and luxury. 
              Use a sophisticated color palette inspired by ${selectedProduct.category === 'fruit' ? 'vibrant fruits' : 'earthy spices'}. 
              No text on the image. High resolution, studio lighting, soft textures, professional graphic design.`,
            },
          ],
        },
        config: {
          imageConfig: {
            aspectRatio: "9:16",
            imageSize: imageSize,
          },
        },
      });

      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const base64EncodeString = part.inlineData.data;
          setCustomPackagingImage(`data:image/png;base64,${base64EncodeString}`);
          break;
        }
      }
    } catch (error) {
      console.error("Error generating packaging mockup:", error);
      if (error instanceof Error && error.message.includes("Requested entity was not found")) {
        setHasApiKey(false);
      }
    } finally {
      setIsGeneratingPackaging(false);
    }
  };

  const generatePromoVideo = async () => {
    if (!hasApiKey) {
      handleOpenKeySelector();
      return;
    }
    if (!customPackagingImage) return;

    setIsGeneratingVideo(true);
    setVideoStatus("Initialisation de la génération vidéo...");
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      // Extract base64 from data URL
      const base64Data = customPackagingImage.split(',')[1];
      
      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: `A cinematic, high-end promotional video for ${selectedProduct.name} by Wellspring. The camera slowly pans around the packaging, showing natural light reflecting off the surface. Organic elements like leaves or water droplets in the background. Premium, elegant, and natural feel.`,
        image: {
          imageBytes: base64Data,
          mimeType: 'image/png',
        },
        config: {
          numberOfVideos: 1,
          resolution: '1080p',
          aspectRatio: '9:16'
        }
      });

      setVideoStatus("Génération en cours (cela peut prendre quelques minutes)...");

      // Poll for completion
      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
      }

      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (downloadLink) {
        const response = await fetch(downloadLink, {
          method: 'GET',
          headers: {
            'x-goog-api-key': process.env.GEMINI_API_KEY || '',
          },
        });
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setGeneratedVideoUrl(url);
        setVideoStatus("Vidéo générée avec succès !");
      }
    } catch (error) {
      console.error("Error generating video:", error);
      setVideoStatus("Erreur lors de la génération vidéo.");
      if (error instanceof Error && error.message.includes("Requested entity was not found")) {
        setHasApiKey(false);
      }
    } finally {
      setIsGeneratingVideo(false);
    }
  };

  return (
    <section className="py-20 bg-wellspring-green/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-5xl text-wellspring-green mb-4">Générateur de Brand & Traçabilité</h2>
          <p className="text-wellspring-earth/60 max-w-2xl mx-auto">
            Créez des étiquettes professionnelles avec QR codes et codes-barres pour identifier vos produits et rassurer vos clients sur l'origine et la qualité.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Controls */}
          <div className="bg-white p-8 rounded-[32px] shadow-sm border border-wellspring-gold/10">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-bold uppercase tracking-widest text-wellspring-earth/60">
                  Sélectionner le Produit
                </label>
                <button 
                  onClick={() => setShowCreateProduct(!showCreateProduct)}
                  className="text-wellspring-green hover:text-wellspring-gold transition-colors flex items-center gap-1 text-xs font-bold uppercase"
                >
                  <Plus size={14} /> Nouveau Produit
                </button>
              </div>

              {showCreateProduct ? (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 bg-wellspring-green/5 rounded-2xl border border-wellspring-green/20 space-y-4"
                >
                  <h4 className="font-bold text-wellspring-green text-sm uppercase">Créer un Nouveau Produit</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <input 
                      type="text" 
                      placeholder="Nom du produit"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                      className="w-full p-3 rounded-xl border border-wellspring-gold/20 outline-none focus:border-wellspring-green text-sm"
                    />
                    <input 
                      type="text" 
                      placeholder="Unité (ex: 250g)"
                      value={newProduct.unit}
                      onChange={(e) => setNewProduct({...newProduct, unit: e.target.value})}
                      className="w-full p-3 rounded-xl border border-wellspring-gold/20 outline-none focus:border-wellspring-green text-sm"
                    />
                  </div>
                  <textarea 
                    placeholder="Description"
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                    className="w-full p-3 rounded-xl border border-wellspring-gold/20 outline-none focus:border-wellspring-green text-sm h-20"
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-wellspring-earth/40">URL de l'Image (Optionnel)</label>
                      <input 
                        type="text" 
                        placeholder="https://example.com/image.jpg"
                        value={newProduct.image}
                        onChange={(e) => setNewProduct({...newProduct, image: e.target.value})}
                        className="w-full p-3 rounded-xl border border-wellspring-gold/20 outline-none focus:border-wellspring-green text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-wellspring-earth/40">Texte Alternatif</label>
                      <input 
                        type="text" 
                        placeholder="Description de l'image"
                        value={newProduct.imageAlt}
                        onChange={(e) => setNewProduct({...newProduct, imageAlt: e.target.value})}
                        className="w-full p-3 rounded-xl border border-wellspring-gold/20 outline-none focus:border-wellspring-green text-sm"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <label className="block text-xs font-black text-wellspring-earth/40 uppercase tracking-[0.2em]">Générer une Image d'Ambiance</label>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="Ex: Poudre de Fraise dans un bol en bois, style minimaliste"
                        value={imagePrompt}
                        onChange={(e) => setImagePrompt(e.target.value)}
                        className="flex-1 p-4 rounded-2xl border-2 border-wellspring-gold/10 outline-none focus:border-wellspring-green text-sm bg-white/50 backdrop-blur-sm transition-all"
                      />
                      <button 
                        onClick={generateAmbientImage}
                        disabled={isGeneratingImage || !imagePrompt}
                        className="px-6 py-4 rounded-2xl bg-wellspring-gold text-white disabled:opacity-50 hover:bg-wellspring-gold/90 transition-all flex items-center gap-2 font-bold text-sm shadow-lg shadow-wellspring-gold/20 active:scale-95"
                      >
                        {isGeneratingImage ? <Loader2 className="animate-spin" size={20} /> : <ImageIcon size={20} />}
                        <span>{isGeneratingImage ? "Génération..." : "Générer"}</span>
                      </button>
                    </div>
                    
                    <AnimatePresence>
                      {generatedImage && (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.8, y: 10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="relative group w-32 h-32 rounded-2xl overflow-hidden border-4 border-wellspring-green shadow-xl"
                        >
                          <img 
                            src={generatedImage} 
                            alt="Generated" 
                            className="w-full h-full object-cover transition-transform group-hover:scale-110" 
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <Sparkles className="text-white" size={20} />
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setGeneratedImage(null);
                              }}
                              className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                              title="Supprimer l'image"
                            >
                              <RefreshCw size={16} className="rotate-45" />
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button 
                      onClick={handleCreateProduct}
                      className="flex-1 py-3 bg-wellspring-green text-white rounded-xl font-bold text-sm hover:bg-wellspring-green/90 transition-colors"
                    >
                      Ajouter au Catalogue
                    </button>
                    <button 
                      onClick={() => setShowCreateProduct(false)}
                      className="px-4 py-3 border border-wellspring-earth/20 rounded-xl font-bold text-sm text-wellspring-earth/60 hover:bg-wellspring-earth/5 transition-colors"
                    >
                      Annuler
                    </button>
                  </div>
                </motion.div>
              ) : (
                <div className="space-y-2">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-wellspring-earth/40" size={18} />
                    <input 
                      type="text"
                      placeholder="Rechercher un produit..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-wellspring-gold/20 outline-none focus:border-wellspring-green text-sm bg-wellspring-cream/10"
                    />
                  </div>
                  <select 
                    value={selectedProductId}
                    onChange={(e) => handleProductChange(e.target.value)}
                    className="w-full p-4 rounded-2xl border-2 border-wellspring-gold/10 focus:border-wellspring-green outline-none transition-colors bg-wellspring-cream/30"
                  >
                    {filteredProducts.length > 0 ? (
                      filteredProducts.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))
                    ) : (
                      <option disabled>Aucun produit trouvé</option>
                    )}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-bold uppercase tracking-widest text-wellspring-earth/60">
                      Nom du Brand
                    </label>
                    <button 
                      onClick={() => setCustomBrandName(selectedProduct.name)}
                      className="text-[10px] font-bold text-wellspring-gold hover:underline"
                    >
                      Reset
                    </button>
                  </div>
                  <input 
                    type="text" 
                    value={customBrandName}
                    onChange={(e) => setCustomBrandName(e.target.value)}
                    className="w-full p-4 rounded-2xl border-2 border-wellspring-gold/10 focus:border-wellspring-green outline-none transition-colors bg-wellspring-cream/30"
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-bold uppercase tracking-widest text-wellspring-earth/60">
                      Grammage/Poids
                    </label>
                    <button 
                      onClick={() => setCustomWeight(selectedProduct.unit)}
                      className="text-[10px] font-bold text-wellspring-gold hover:underline"
                    >
                      Reset
                    </button>
                  </div>
                  <input 
                    type="text" 
                    value={customWeight}
                    onChange={(e) => setCustomWeight(e.target.value)}
                    className="w-full p-4 rounded-2xl border-2 border-wellspring-gold/10 focus:border-wellspring-green outline-none transition-colors bg-wellspring-cream/30"
                  />
                </div>
              </div>

              <button 
                onClick={handleUpdateProduct}
                className="w-full py-4 bg-wellspring-gold text-white rounded-2xl font-bold text-sm hover:bg-wellspring-gold/90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-wellspring-gold/20"
              >
                <RefreshCw size={18} />
                Mettre à jour le catalogue
              </button>

              <div>
                <label className="block text-sm font-bold uppercase tracking-widest text-wellspring-earth/60 mb-2">
                  Numéro de Lot (Batch)
                </label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={batchNumber}
                    onChange={(e) => setBatchNumber(e.target.value)}
                    className="flex-1 p-4 rounded-2xl border-2 border-wellspring-gold/10 focus:border-wellspring-green outline-none transition-colors bg-wellspring-cream/30"
                  />
                  <button 
                    onClick={generateNewBatch}
                    className="p-4 rounded-2xl bg-wellspring-gold/10 text-wellspring-gold hover:bg-wellspring-gold hover:text-white transition-colors"
                  >
                    <RefreshCw size={24} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <DatePicker 
                  label="Date de Fab."
                  value={mfgDate}
                  onChange={handleMfgDateChange}
                  icon={<Printer size={14} />}
                  error={mfgError}
                />
                <DatePicker 
                  label="Date d'Exp."
                  value={expDate}
                  onChange={handleExpDateChange}
                  icon={<Tag size={14} />}
                  error={expError}
                />
              </div>

              <div className="flex justify-end">
                <button 
                  onClick={() => {
                    const nextYear = new Date(mfgDate);
                    nextYear.setFullYear(nextYear.getFullYear() + 1);
                    handleExpDateChange(nextYear.toISOString().split('T')[0]);
                  }}
                  className="text-[10px] font-bold text-wellspring-green hover:underline flex items-center gap-1"
                >
                  <RefreshCw size={10} /> Par défaut (+1 an)
                </button>
              </div>

              {dateError ? (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-[10px] font-medium flex items-center gap-2"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  {dateError}
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-green-50 border border-green-200 rounded-xl text-green-600 text-[10px] font-medium flex items-center gap-2"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  Dates de traçabilité valides et conformes.
                </motion.div>
              )}

              {previewMode === "label" && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="pt-4 border-t border-wellspring-gold/10"
                >
                  <label className="block text-sm font-bold uppercase tracking-widest text-wellspring-earth/60 mb-3">
                    Saturation du Papier ({labelSaturation}%)
                  </label>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={labelSaturation}
                    onChange={(e) => setLabelSaturation(parseInt(e.target.value))}
                    className="w-full h-2 bg-wellspring-gold/20 rounded-lg appearance-none cursor-pointer accent-wellspring-green"
                  />

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-wellspring-earth/60 mb-2">
                        Densité d'Encre ({inkDensity}%)
                      </label>
                      <input 
                        type="range" 
                        min="50" 
                        max="100" 
                        value={inkDensity}
                        onChange={(e) => setInkDensity(parseInt(e.target.value))}
                        className="w-full h-2 bg-wellspring-gold/20 rounded-lg appearance-none cursor-pointer accent-wellspring-green"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-wellspring-earth/60 mb-2">
                        Texture Papier ({paperTexture}%)
                      </label>
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={paperTexture}
                        onChange={(e) => setPaperTexture(parseInt(e.target.value))}
                        className="w-full h-2 bg-wellspring-gold/20 rounded-lg appearance-none cursor-pointer accent-wellspring-green"
                      />
                    </div>
                  </div>

                  <div className="pt-6 mt-6 border-t border-wellspring-gold/10 space-y-4">
                    <label className="block text-sm font-bold uppercase tracking-widest text-wellspring-earth/60">
                      Personnalisation QR Code
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-wellspring-earth/40 mb-2">
                          Couleur Bordure
                        </label>
                        <div className="flex gap-2 items-center">
                          <input 
                            type="color" 
                            value={qrBorderColor}
                            onChange={(e) => setQrBorderColor(e.target.value)}
                            className="w-8 h-8 rounded-lg border border-wellspring-gold/10 cursor-pointer bg-wellspring-cream/30"
                          />
                          <span className="text-[10px] font-mono text-wellspring-earth/60">{qrBorderColor}</span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-wellspring-earth/40 mb-2">
                          Épaisseur ({qrBorderWidth}px)
                        </label>
                        <input 
                          type="range" 
                          min="0" 
                          max="10" 
                          value={qrBorderWidth}
                          onChange={(e) => setQrBorderWidth(parseInt(e.target.value))}
                          className="w-full h-1.5 bg-wellspring-gold/20 rounded-lg appearance-none cursor-pointer accent-wellspring-green"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-wellspring-earth/40 mb-2">
                        Arrondi ({qrBorderRadius}px)
                      </label>
                      <input 
                        type="range" 
                        min="0" 
                        max="20" 
                        value={qrBorderRadius}
                        onChange={(e) => setQrBorderRadius(parseInt(e.target.value))}
                        className="w-full h-1.5 bg-wellspring-gold/20 rounded-lg appearance-none cursor-pointer accent-wellspring-green"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {previewMode === "packaging" && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="pt-4 border-t border-wellspring-gold/10"
                >
                  <label className="block text-sm font-bold uppercase tracking-widest text-wellspring-earth/60 mb-3">
                    Design de l'Emballage (Studio AI)
                  </label>
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-wrap gap-2">
                      {["Premium & Minimaliste", "Vibrant & Moderne", "Organique & Artisanal", "Luxe & Or"].map((style) => (
                        <button
                          key={style}
                          onClick={() => setPackagingStyle(style)}
                          className={cn(
                            "px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all",
                            packagingStyle === style 
                              ? "bg-wellspring-gold text-white shadow-md" 
                              : "bg-wellspring-gold/10 text-wellspring-earth/60 hover:bg-wellspring-gold/20"
                          )}
                        >
                          {style}
                        </button>
                      ))}
                    </div>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleImageUpload}
                      ref={fileInputRef}
                      className="hidden"
                    />
                    <div className="flex gap-2">
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="flex-1 p-4 rounded-2xl border-2 border-dashed border-wellspring-gold/30 hover:border-wellspring-green transition-colors text-sm font-medium text-wellspring-earth/60 flex items-center justify-center gap-2"
                      >
                        <Share2 size={18} className="rotate-90" />
                        {customPackagingImage ? "Changer" : "Uploader"}
                      </button>
                      <button 
                        onClick={generatePackagingMockup}
                        disabled={isGeneratingPackaging}
                        className="flex-1 p-4 rounded-2xl bg-wellspring-green text-white hover:bg-wellspring-green/90 transition-all flex items-center justify-center gap-2 text-sm font-bold disabled:opacity-50 shadow-lg shadow-wellspring-green/20"
                      >
                        {isGeneratingPackaging ? (
                          <>
                            <Loader2 className="animate-spin" size={18} />
                            <span>Génération...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles size={18} />
                            <span>Design par AI</span>
                          </>
                        )}
                      </button>
                      {customPackagingImage && (
                        <button 
                          onClick={generatePromoVideo}
                          disabled={isGeneratingVideo}
                          className="flex-1 p-4 rounded-2xl bg-wellspring-gold text-white hover:bg-wellspring-gold/90 transition-all flex items-center justify-center gap-2 text-sm font-bold disabled:opacity-50 shadow-lg shadow-wellspring-gold/20"
                        >
                          {isGeneratingVideo ? (
                            <>
                              <Loader2 className="animate-spin" size={18} />
                              <span>Vidéo...</span>
                            </>
                          ) : (
                            <>
                              <Video size={18} />
                              <span>Promo Vidéo</span>
                            </>
                          )}
                        </button>
                      )}
                      {customPackagingImage && !isGeneratingVideo && (
                        <button 
                          onClick={() => setCustomPackagingImage(null)}
                          className="p-4 rounded-2xl bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                          title="Réinitialiser le design"
                        >
                          <RefreshCw size={20} className="rotate-45" />
                        </button>
                      )}
                    </div>
                    <p className="text-[10px] text-wellspring-earth/40 italic">
                      Format recommandé : Portrait (ex: 320x500px)
                    </p>

                    {!hasApiKey && (
                      <button 
                        onClick={handleOpenKeySelector}
                        className="w-full p-3 rounded-xl bg-wellspring-gold/10 text-wellspring-gold border border-wellspring-gold/20 text-xs font-bold uppercase tracking-widest hover:bg-wellspring-gold/20 transition-all"
                      >
                        Configurer Clé API (Requis pour AI)
                      </button>
                    )}

                    {isGeneratingVideo && (
                      <div className="p-3 rounded-xl bg-wellspring-gold/5 border border-wellspring-gold/10">
                        <div className="flex items-center gap-2 mb-2">
                          <Loader2 className="animate-spin text-wellspring-gold" size={14} />
                          <span className="text-[10px] font-bold text-wellspring-gold uppercase tracking-widest">
                            Statut Vidéo
                          </span>
                        </div>
                        <p className="text-[10px] text-wellspring-earth/60 italic">
                          {videoStatus}
                        </p>
                      </div>
                    )}

                    {generatedVideoUrl && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-wellspring-green uppercase tracking-widest">
                            Vidéo Promotionnelle
                          </span>
                          <button 
                            onClick={() => setGeneratedVideoUrl(null)}
                            className="text-[10px] font-bold text-red-500 hover:underline"
                          >
                            Fermer
                          </button>
                        </div>
                        <video 
                          src={generatedVideoUrl} 
                          controls 
                          className="w-full rounded-xl border-2 border-wellspring-green shadow-lg"
                        />
                      </div>
                    )}

                    <div className="space-y-2">
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-wellspring-earth/40">
                        Résolution Image AI
                      </label>
                      <div className="flex gap-2">
                        {(["1K", "2K", "4K"] as const).map((size) => (
                          <button
                            key={size}
                            onClick={() => setImageSize(size)}
                            className={cn(
                              "flex-1 py-2 rounded-lg text-[10px] font-bold transition-all border",
                              imageSize === size 
                                ? "bg-wellspring-green text-white border-wellspring-green" 
                                : "bg-white text-wellspring-earth/60 border-wellspring-gold/20 hover:border-wellspring-green"
                            )}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {previewMode === "packaging" && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="pt-4 border-t border-wellspring-gold/10 space-y-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold uppercase tracking-widest text-wellspring-earth/60 mb-2">
                        Couleur Bordure
                      </label>
                      <div className="flex gap-2 items-center">
                        <input 
                          type="color" 
                          value={packagingBorderColor}
                          onChange={(e) => setPackagingBorderColor(e.target.value)}
                          className="w-12 h-12 rounded-xl border-2 border-wellspring-gold/10 cursor-pointer bg-wellspring-cream/30"
                        />
                        <span className="text-xs font-mono text-wellspring-earth/60">{packagingBorderColor}</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold uppercase tracking-widest text-wellspring-earth/60 mb-2">
                        Épaisseur ({packagingBorderThickness}px)
                      </label>
                      <input 
                        type="range" 
                        min="0" 
                        max="20" 
                        value={packagingBorderThickness}
                        onChange={(e) => setPackagingBorderThickness(parseInt(e.target.value))}
                        className="w-full h-2 bg-wellspring-gold/20 rounded-lg appearance-none cursor-pointer accent-wellspring-green mt-4"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold uppercase tracking-widest text-wellspring-earth/60 mb-2">
                        Luminosité ({packagingBrightness}%)
                      </label>
                      <input 
                        type="range" 
                        min="50" 
                        max="150" 
                        value={packagingBrightness}
                        onChange={(e) => setPackagingBrightness(parseInt(e.target.value))}
                        className="w-full h-2 bg-wellspring-gold/20 rounded-lg appearance-none cursor-pointer accent-wellspring-green mt-4"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold uppercase tracking-widest text-wellspring-earth/60 mb-2">
                        Contraste ({packagingContrast}%)
                      </label>
                      <input 
                        type="range" 
                        min="50" 
                        max="150" 
                        value={packagingContrast}
                        onChange={(e) => setPackagingContrast(parseInt(e.target.value))}
                        className="w-full h-2 bg-wellspring-gold/20 rounded-lg appearance-none cursor-pointer accent-wellspring-green mt-4"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <label className="block text-xs font-bold uppercase tracking-widest text-wellspring-earth/60 mb-3">
                      Filtres Créatifs
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { id: "none", label: "Aucun" },
                        { id: "sepia", label: "Sépia" },
                        { id: "grayscale", label: "N&B" },
                        { id: "vintage", label: "Vintage" },
                        { id: "invert", label: "Inverser" },
                        { id: "hue-rotate", label: "Teinte" },
                        { id: "cold", label: "Froid" },
                        { id: "warm", label: "Chaud" },
                      ].map((f) => (
                        <button
                          key={f.id}
                          onClick={() => setPackagingFilter(f.id as any)}
                          className={cn(
                            "px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all",
                            packagingFilter === f.id 
                              ? "bg-wellspring-green text-white shadow-md" 
                              : "bg-wellspring-gold/10 text-wellspring-earth/60 hover:bg-wellspring-gold/20"
                          )}
                        >
                          {f.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-wellspring-gold/10 space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="block text-sm font-bold uppercase tracking-widest text-wellspring-earth/60">
                        Rotation 360° ({packagingRotation}°)
                      </label>
                      <button 
                        onClick={() => setIsAutoRotating(!isAutoRotating)}
                        className={cn(
                          "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all",
                          isAutoRotating ? "bg-wellspring-green text-white" : "bg-wellspring-green/10 text-wellspring-green"
                        )}
                      >
                        {isAutoRotating ? "Stop" : "Auto-Rotate"}
                      </button>
                    </div>
                    <input 
                      type="range" 
                      min="-180" 
                      max="180" 
                      value={packagingRotation}
                      onChange={(e) => setPackagingRotation(parseInt(e.target.value))}
                      className="w-full h-2 bg-wellspring-gold/20 rounded-lg appearance-none cursor-pointer accent-wellspring-green"
                    />
                    <div className="flex justify-between text-[10px] font-bold text-wellspring-earth/40 uppercase tracking-widest">
                      <span>Face</span>
                      <span>Dos</span>
                      <span>Face</span>
                    </div>

                    <div className="pt-4 border-t border-wellspring-gold/10 space-y-4">
                    <label className="block text-sm font-bold uppercase tracking-widest text-wellspring-earth/60 mb-2">
                      Design de l'Emballage
                    </label>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="flex-1 p-4 rounded-2xl border-2 border-dashed border-wellspring-gold/30 hover:border-wellspring-green transition-all flex flex-col items-center justify-center gap-2 bg-wellspring-cream/20 group"
                      >
                        <ImageIcon size={24} className="text-wellspring-gold group-hover:text-wellspring-green transition-colors" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-wellspring-earth/40">
                          {customPackagingImage ? "Changer l'image" : "Uploader un design"}
                        </span>
                      </button>
                      {customPackagingImage && (
                        <button 
                          onClick={() => setCustomPackagingImage(null)}
                          className="p-4 rounded-2xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center"
                          title="Supprimer l'image personnalisée"
                        >
                          <RefreshCw size={20} className="rotate-45" />
                        </button>
                      )}
                    </div>
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>

                  <div className="pt-4 border-t border-wellspring-gold/10">
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-wellspring-earth/40 mb-2">
                        Profondeur de l'Emballage ({packagingDepth}px)
                      </label>
                      <input 
                        type="range" 
                        min="10" 
                        max="100" 
                        value={packagingDepth}
                        onChange={(e) => setPackagingDepth(parseInt(e.target.value))}
                        className="w-full h-1.5 bg-wellspring-gold/20 rounded-lg appearance-none cursor-pointer accent-wellspring-green"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              <div className="pt-6 border-t border-wellspring-gold/10 grid grid-cols-2 gap-4">
                <button 
                  disabled={!!dateError}
                  className="pill-button bg-wellspring-green text-white flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Download size={18} /> Télécharger
                </button>
                <button 
                  disabled={!!dateError}
                  className="pill-button border-2 border-wellspring-green text-wellspring-green flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Printer size={18} /> Imprimer
                </button>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="flex flex-col items-center">
            <div className="flex bg-wellspring-gold/10 p-1 rounded-full mb-8">
              <button 
                onClick={() => setPreviewMode("label")}
                className={cn(
                  "px-6 py-2 rounded-full text-sm font-bold transition-all",
                  previewMode === "label" ? "bg-wellspring-green text-white shadow-md" : "text-wellspring-green/60"
                )}
              >
                Étiquette
              </button>
              <button 
                onClick={() => setPreviewMode("packaging")}
                className={cn(
                  "px-6 py-2 rounded-full text-sm font-bold transition-all",
                  previewMode === "packaging" ? "bg-wellspring-green text-white shadow-md" : "text-wellspring-green/60"
                )}
              >
                Emballage
              </button>
            </div>

            <AnimatePresence mode="wait">
              {previewMode === "label" ? (
                <motion.div 
                  key="label-preview"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  ref={labelRef}
                  className="w-full max-w-md p-10 rounded-[2px] shadow-[0_30px_60px_-12px_rgba(0,0,0,0.25),0_18px_36px_-18px_rgba(0,0,0,0.3),inset_0_0_0_1px_rgba(0,0,0,0.05)] flex flex-col items-center text-center relative overflow-hidden"
                  style={{
                    backgroundColor: `hsl(48, ${labelSaturation}%, 97%)`,
                  }}
                >
                  {/* Paper Texture Overlay (Base Fibers) */}
                  <div 
                    className="absolute inset-0 pointer-events-none mix-blend-multiply"
                    style={{
                      backgroundImage: `url("https://www.transparenttextures.com/patterns/paper-fibers.png")`,
                      opacity: (paperTexture / 100) * 0.4
                    }}
                  />

                  {/* Grain/Noise Overlay */}
                  <div 
                    className="absolute inset-0 pointer-events-none mix-blend-overlay"
                    style={{
                      backgroundImage: `url("https://www.transparenttextures.com/patterns/natural-paper.png")`,
                      opacity: (paperTexture / 100) * 0.6
                    }}
                  />

                  {/* Realistic Lighting Gradient (Simulates slight curve/uneven light) */}
                  <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-white/40 via-transparent to-black/10" />
                  
                  {/* Vignette Effect for Depth */}
                  <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.05)]" />

                  {/* Subtle Inner Border (Simulates paper edge/cut) */}
                  <div className="absolute inset-4 border border-wellspring-gold/10 pointer-events-none rounded-[1px]" />
                  
                  {/* Content Layer with Ink Density */}
                  <div className="w-full relative z-10" style={{ opacity: inkDensity / 100 }}>
                    {/* Label Header Decoration */}
                    <div className="flex items-center justify-center gap-4 mb-8">
                      <div className="h-[1px] flex-1 bg-wellspring-gold/20" />
                      <div className="w-2 h-2 rounded-full bg-wellspring-gold/40" />
                      <div className="h-[1px] flex-1 bg-wellspring-gold/20" />
                    </div>
                    
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="mb-6 flex flex-col items-center gap-2 justify-center"
                    >
                      <img 
                        src="https://storage.googleapis.com/test-media-antigravity/logo_wellspring.png" 
                        alt="Logo" 
                        className="w-10 h-10 object-contain brightness-90 contrast-125"
                        referrerPolicy="no-referrer"
                      />
                      <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-wellspring-gold/80">Wellspring RDC</span>
                    </motion.div>

                    <motion.h3 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
                      className="text-4xl text-wellspring-green mb-2 font-serif tracking-tight"
                    >
                      {customBrandName}
                    </motion.h3>

                    <motion.div
                      initial={{ opacity: 0, scale: 0.8, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ delay: 0.5, type: "spring", damping: 12 }}
                      className="mb-8"
                    >
                      <motion.span 
                        whileHover={{ scale: 1.02, color: "#1a3a32" }}
                        className="text-5xl font-black uppercase tracking-tighter text-wellspring-earth block leading-none drop-shadow-sm cursor-default transition-colors"
                      >
                        {selectedProduct.name}
                      </motion.span>
                      <motion.div 
                        whileHover={{ scale: 1.1 }}
                        className="mt-2 text-2xl font-bold text-wellspring-gold"
                      >
                        ${selectedProduct.price}
                      </motion.div>
                      <div className="h-[2px] w-16 bg-wellspring-gold/60 mx-auto mt-4" />
                    </motion.div>
                    
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                      className="text-xs font-bold uppercase tracking-[0.2em] text-wellspring-earth/40 mb-10"
                    >
                      Produit 100% Naturel & Artisanal
                    </motion.p>

                    <div className="grid grid-cols-2 gap-10 w-full items-center mb-10 px-4">
                      <motion.div 
                        key={qrType}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-col items-center gap-3"
                      >
                        <div 
                          className="p-3 bg-white/80 backdrop-blur-sm shadow-sm"
                          style={{
                            border: `${qrBorderWidth}px solid ${qrBorderColor}`,
                            borderRadius: `${qrBorderRadius}px`
                          }}
                        >
                          <QRCodeSVG 
                            value={qrType === "product" ? productUrl : window.location.origin} 
                            size={100}
                            fgColor="#1a3a32"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-[8px] font-black text-wellspring-earth/30 uppercase tracking-[0.3em]">
                            {qrType === "product" ? "Traçabilité" : "Site Web"}
                          </span>
                          <div className="flex gap-1 justify-center">
                            <button onClick={() => setQrType("product")} className={cn("w-1.5 h-1.5 rounded-full transition-colors", qrType === "product" ? "bg-wellspring-gold" : "bg-wellspring-gold/20")} />
                            <button onClick={() => setQrType("website")} className={cn("w-1.5 h-1.5 rounded-full transition-colors", qrType === "website" ? "bg-wellspring-gold" : "bg-wellspring-gold/20")} />
                          </div>
                        </div>
                      </motion.div>
                      
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 0.8 }}
                        transition={{ delay: 0.8, type: "spring", stiffness: 100 }}
                        className="flex flex-col items-center gap-3"
                      >
                        <div className="bg-white/80 backdrop-blur-sm p-3 border border-wellspring-gold/10 rounded-sm shadow-sm">
                          <Barcode 
                            value={selectedProduct.id.toUpperCase().slice(0, 8)} 
                            text={`${customBrandName}`}
                            width={1.2} 
                            height={50} 
                            fontSize={10}
                            background="transparent"
                            lineColor="#1a3a32"
                          />
                        </div>
                        <span className="text-[8px] font-black text-wellspring-earth/30 uppercase tracking-[0.3em]">Code Batch</span>
                      </motion.div>
                    </div>

                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1 }}
                      className="w-full pt-8 border-t border-wellspring-gold/20"
                    >
                      <div className="grid grid-cols-2 gap-y-4 text-[9px] font-black uppercase tracking-[0.25em] text-wellspring-earth/50">
                        <div className="flex flex-col items-start">
                          <span className="text-[7px] text-wellspring-gold/60 mb-1">Batch No.</span>
                          <span>{batchNumber}</span>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-[7px] text-wellspring-gold/60 mb-1">Poids Net</span>
                          <span>{customWeight}</span>
                        </div>
                        <div className="flex flex-col items-start">
                          <span className="text-[7px] text-wellspring-gold/60 mb-1">Fabriqué le</span>
                          <span>{mfgDate}</span>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-[7px] text-wellspring-gold/60 mb-1">Expire le</span>
                          <span>{expDate}</span>
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Subtle Paper Grain Overlay */}
                  <div className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
                </motion.div>
              ) : (
                <div 
                  className="w-full flex justify-center py-10 select-none relative"
                  style={{ perspective: "1200px" }}
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  onPointerLeave={handlePointerUp}
                >
                  <motion.div
                    key="packaging-preview"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ 
                      opacity: 1, 
                      scale: 1,
                      rotateY: packagingRotation
                    }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ 
                      rotateY: isDragging ? { type: "tween", duration: 0 } : { type: "spring", stiffness: 50, damping: 20 },
                      default: { duration: 0.5 }
                    }}
                    style={{
                      transformStyle: "preserve-3d",
                      cursor: isDragging ? "grabbing" : "grab"
                    }}
                    className="w-full max-w-[320px] h-[500px] relative flex flex-col items-center text-white"
                  >
                    {/* Front Face Content */}
                    <div 
                      className="absolute inset-0 backface-hidden flex flex-col items-center p-6 overflow-hidden rounded-t-[40px] rounded-b-[60px] shadow-2xl"
                      style={{
                        border: `${packagingBorderThickness}px solid ${packagingBorderColor}`,
                        transform: `translateZ(${packagingDepth / 2}px)`
                      }}
                    >
                      {/* Background Layer with Filters */}
                      <div 
                        className="absolute inset-0 -z-10"
                        style={{
                          background: customPackagingImage 
                            ? `url(${customPackagingImage}) center/cover no-repeat`
                            : selectedProduct.category === 'fruit' 
                              ? "linear-gradient(180deg, #ff1b6b 0%, #45caff 100%)" 
                              : "linear-gradient(180deg, #f59e0b 0%, #78350f 100%)",
                          filter: `
                            brightness(${packagingBrightness}%) 
                            contrast(${packagingContrast}%)
                            ${packagingFilter === 'sepia' ? 'sepia(1)' : ''}
                            ${packagingFilter === 'grayscale' ? 'grayscale(1)' : ''}
                            ${packagingFilter === 'vintage' ? 'sepia(0.5) contrast(1.2) brightness(0.9)' : ''}
                            ${packagingFilter === 'invert' ? 'invert(1)' : ''}
                            ${packagingFilter === 'hue-rotate' ? 'hue-rotate(90deg)' : ''}
                            ${packagingFilter === 'cold' ? 'saturate(1.2) hue-rotate(180deg) brightness(1.1)' : ''}
                            ${packagingFilter === 'warm' ? 'sepia(0.3) saturate(1.5) brightness(1.05)' : ''}
                          `,
                          boxShadow: "inset 0 0 80px rgba(0,0,0,0.3)"
                        }}
                      />
                      
                      {customPackagingImage && (
                        <div className="absolute inset-0 bg-black/10 pointer-events-none" />
                      )}

                      {customPackagingImage && (
                        <div className="absolute top-4 right-4 z-20 bg-wellspring-green/80 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1.5 border border-white/20 shadow-lg">
                          <Sparkles size={10} className="text-wellspring-gold" />
                          <span className="text-[8px] font-black uppercase tracking-widest">Studio AI</span>
                        </div>
                      )}
                      
                      <div className="absolute top-10 left-8 right-8 h-1.5 bg-black/20 rounded-full" />
                      <div className="absolute top-[46px] left-8 right-8 h-0.5 bg-white/10" />

                      <motion.div
                        key={customPackagingImage || 'default'}
                        initial={{ opacity: 0, y: 15, filter: "blur(8px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        transition={{ 
                          duration: 0.8, 
                          ease: [0.16, 1, 0.3, 1] 
                        }}
                        className="flex flex-col items-center w-full h-full"
                      >
                        <div className="mt-12 mb-4 flex flex-col items-center">
                          <div className="flex items-center gap-2 mb-1">
                            <img 
                              src="https://storage.googleapis.com/test-media-antigravity/logo_wellspring.png" 
                              alt="Logo" 
                              className="w-10 h-10 object-contain brightness-0 invert"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <span className="text-[10px] font-bold uppercase tracking-[0.4em] opacity-80">wellspring</span>
                        </div>

                        <h3 className="text-3xl font-bold text-center leading-tight mb-1 px-4 drop-shadow-lg">
                          {customBrandName}
                        </h3>
                        <motion.div
                          initial={{ opacity: 0, y: 20, scale: 0.9 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ delay: 0.3, type: "spring" }}
                          className="text-4xl font-black uppercase tracking-tighter text-center mb-6 drop-shadow-lg leading-none"
                        >
                          {selectedProduct.name}
                        </motion.div>

                        <div className="w-44 h-44 relative mb-6">
                          <img 
                            src={selectedProduct.image} 
                            alt={selectedProduct.name} 
                            className="w-full h-full object-cover rounded-full border-4 border-white/30 shadow-2xl"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 rounded-full bg-gradient-to-t from-black/30 to-transparent" />
                        </div>

                        <div className="flex gap-4 mb-6">
                          {["Bio", "Vegan", "Naturel"].map((badge) => (
                            <div key={badge} className="w-14 h-14 rounded-full border-2 border-white/40 flex flex-col items-center justify-center text-[9px] font-black uppercase text-center leading-tight p-1 bg-white/5 backdrop-blur-sm">
                              {badge}
                            </div>
                          ))}
                        </div>

                        <div className="mt-auto text-xl font-black tracking-widest opacity-90">
                          {customWeight}
                        </div>
                      </motion.div>

                      {/* 3D Volume Simulation */}
                      <div className="absolute top-0 left-0 w-12 h-full bg-gradient-to-r from-black/20 to-transparent pointer-events-none" />
                      <div className="absolute top-0 right-0 w-12 h-full bg-gradient-to-l from-black/20 to-transparent pointer-events-none" />
                      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
                    </div>

                    {/* Right Side Face */}
                    <div 
                      className="absolute top-0 bottom-0 backface-hidden"
                      style={{ 
                        width: `${packagingDepth}px`,
                        right: 0,
                        transform: `rotateY(90deg) translateZ(${packagingDepth / 2}px)`,
                        transformOrigin: "right",
                        background: selectedProduct.category === 'fruit' ? '#142d27' : '#321805',
                        border: `${packagingBorderThickness}px solid ${packagingBorderColor}`,
                        borderLeft: 'none'
                      }}
                    >
                      <div className="h-full w-full flex items-center justify-center">
                        <div className="rotate-90 text-[8px] font-black uppercase tracking-[0.3em] opacity-20 whitespace-nowrap">
                          Premium Quality
                        </div>
                      </div>
                    </div>

                    {/* Left Side Face */}
                    <div 
                      className="absolute top-0 bottom-0 backface-hidden"
                      style={{ 
                        width: `${packagingDepth}px`,
                        left: 0,
                        transform: `rotateY(-90deg) translateZ(${packagingDepth / 2}px)`,
                        transformOrigin: "left",
                        background: selectedProduct.category === 'fruit' ? '#142d27' : '#321805',
                        border: `${packagingBorderThickness}px solid ${packagingBorderColor}`,
                        borderRight: 'none'
                      }}
                    >
                      <div className="h-full w-full flex items-center justify-center">
                        <div className="-rotate-90 text-[8px] font-black uppercase tracking-[0.3em] opacity-20 whitespace-nowrap">
                          100% Naturel
                        </div>
                      </div>
                    </div>

                    {/* Top Face */}
                    <div 
                      className="absolute left-0 right-0 backface-hidden"
                      style={{ 
                        height: `${packagingDepth}px`,
                        top: 0,
                        transform: `rotateX(90deg) translateZ(${packagingDepth / 2}px)`,
                        transformOrigin: "top",
                        background: selectedProduct.category === 'fruit' ? '#142d27' : '#321805',
                        border: `${packagingBorderThickness}px solid ${packagingBorderColor}`,
                        borderBottom: 'none'
                      }}
                    />

                    {/* Bottom Face */}
                    <div 
                      className="absolute left-0 right-0 backface-hidden"
                      style={{ 
                        height: `${packagingDepth}px`,
                        bottom: 0,
                        transform: `rotateX(-90deg) translateZ(${packagingDepth / 2}px)`,
                        transformOrigin: "bottom",
                        background: selectedProduct.category === 'fruit' ? '#142d27' : '#321805',
                        border: `${packagingBorderThickness}px solid ${packagingBorderColor}`,
                        borderTop: 'none'
                      }}
                    />

                    {/* Back Face Content */}
                    <div 
                      className="absolute inset-0 backface-hidden flex flex-col items-center p-8 overflow-hidden rounded-t-[40px] rounded-b-[60px] shadow-2xl"
                      style={{ 
                        transform: `rotateY(180deg) translateZ(${packagingDepth / 2}px)`,
                        background: selectedProduct.category === 'fruit' ? '#1a3a32' : '#422006',
                        border: `${packagingBorderThickness}px solid ${packagingBorderColor}`
                      }}
                    >
                      <div className="w-full h-full border-2 border-white/10 rounded-[30px] p-6 flex flex-col items-center justify-between">
                        <div className="w-full space-y-4">
                          <div className="flex justify-between items-center border-b border-white/10 pb-2">
                            <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Valeurs Nutritionnelles</span>
                            <span className="text-[10px] font-bold">/ 100g</span>
                          </div>
                          <div className="space-y-2">
                            {[
                              { label: "Énergie", val: "340 kcal" },
                              { label: "Protéines", val: "2.4g" },
                              { label: "Glucides", val: "82g" },
                              { label: "Fibres", val: "12g" },
                            ].map((item) => (
                              <div key={item.label} className="flex justify-between text-[9px] uppercase tracking-wider">
                                <span className="opacity-60">{item.label}</span>
                                <span className="font-bold">{item.val}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="w-full space-y-4">
                          <div className="p-3 bg-white rounded-lg flex justify-center">
                            <Barcode 
                              value={selectedProduct.id.toUpperCase().slice(0, 8)} 
                              width={1.2} 
                              height={40} 
                              fontSize={8}
                              lineColor="#000"
                            />
                          </div>
                          <div className="text-center space-y-1">
                            <p className="text-[8px] font-bold uppercase tracking-widest opacity-60">Distribué par Wellspring RDC</p>
                            <p className="text-[8px] opacity-40 italic">Goma, Nord-Kivu, République Démocratique du Congo</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 flex items-center gap-2 text-wellspring-earth/40 text-[10px] font-bold uppercase tracking-widest pointer-events-none bg-wellspring-cream/50 backdrop-blur-sm px-4 py-2 rounded-full border border-wellspring-gold/10 shadow-sm"
                  >
                    <RefreshCw size={12} className={cn("transition-transform", isAutoRotating && "animate-spin")} />
                    <span>Glissez pour pivoter à 360°</span>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
            
            <p className="mt-6 text-xs text-wellspring-earth/40 flex items-center gap-2">
              <Share2 size={12} /> Ce QR code lie directement à la page de traçabilité du produit sur wellspringrdc.com
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
