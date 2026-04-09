import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { motion, AnimatePresence } from "motion/react";
import { X, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Product } from "../types";

const stripePromise = loadStripe((import.meta as any).env.VITE_STRIPE_PUBLISHABLE_KEY || "pk_test_placeholder");

interface CheckoutProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

function CheckoutForm({ product, onClose }: { product: Product; onClose: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsLoading(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin,
      },
      redirect: "if_required",
    });

    if (error) {
      if (error.type === "card_error" || error.type === "validation_error") {
        setMessage(error.message || "Une erreur est survenue.");
      } else {
        setMessage("Une erreur inattendue est survenue.");
      }
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      setIsSuccess(true);
      setTimeout(() => {
        onClose();
      }, 3000);
    }

    setIsLoading(false);
  };

  if (isSuccess) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <div className="w-20 h-20 bg-wellspring-green/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={48} className="text-wellspring-green" />
        </div>
        <h3 className="text-2xl font-bold text-wellspring-green mb-2">Paiement Réussi !</h3>
        <p className="text-wellspring-earth/60">Merci pour votre achat de {product.name}. Votre commande est en cours de préparation.</p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      
      {message && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex gap-3 text-red-600 text-sm items-center">
          <AlertCircle size={18} />
          <p>{message}</p>
        </div>
      )}

      <button
        disabled={isLoading || !stripe || !elements}
        className="w-full py-4 bg-wellspring-green text-white rounded-xl font-bold text-lg hover:bg-wellspring-green/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="animate-spin" size={20} />
            <span>Traitement...</span>
          </>
        ) : (
          <span>Payer ${product.price}</span>
        )}
      </button>
    </form>
  );
}

export default function Checkout({ product, isOpen, onClose }: CheckoutProps) {
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    if (isOpen && product) {
      fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          amount: product.price,
          metadata: { productId: product.id, productName: product.name }
        }),
      })
        .then((res) => res.json())
        .then((data) => setClientSecret(data.clientSecret))
        .catch(err => console.error("Error creating payment intent:", err));
    } else {
      setClientSecret("");
    }
  }, [isOpen, product]);

  return (
    <AnimatePresence>
      {isOpen && product && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-white rounded-[40px] shadow-2xl overflow-hidden"
          >
            <div className="p-8 border-b border-wellspring-gold/10 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black text-wellspring-green">Finaliser la Commande</h2>
                <p className="text-sm text-wellspring-earth/60">{product.name} - {product.unit}</p>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-wellspring-cream rounded-full transition-colors"
              >
                <X size={24} className="text-wellspring-earth/40" />
              </button>
            </div>

            <div className="p-8">
              {clientSecret ? (
                <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'stripe' } }}>
                  <CheckoutForm product={product} onClose={onClose} />
                </Elements>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 gap-4">
                  <Loader2 className="animate-spin text-wellspring-gold" size={40} />
                  <p className="text-wellspring-earth/60 font-medium">Initialisation du paiement sécurisé...</p>
                </div>
              )}
            </div>

            <div className="p-6 bg-wellspring-cream/30 border-t border-wellspring-gold/10 flex items-center justify-center gap-2">
              <ShieldCheck size={18} className="text-wellspring-green" />
              <span className="text-xs font-bold uppercase tracking-widest text-wellspring-earth/40">Paiement 100% Sécurisé par Stripe</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function ShieldCheck({ size, className }: { size: number; className?: string }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
