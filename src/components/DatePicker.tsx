import React, { useState, useRef, useEffect } from "react";
import { format, parseISO, isValid } from "date-fns";
import { fr } from "date-fns/locale";
import { DayPicker } from "react-day-picker";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/src/lib/utils";

interface DatePickerProps {
  value: string;
  onChange: (date: string) => void;
  label: string;
  icon?: React.ReactNode;
  error?: boolean;
}

export default function DatePicker({ value, onChange, label, icon, error }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const selectedDate = value ? parseISO(value) : undefined;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (date: Date | undefined) => {
    if (date) {
      onChange(format(date, "yyyy-MM-dd"));
      setIsOpen(false);
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      <label className={cn(
        "block text-sm font-bold uppercase tracking-widest mb-2 flex items-center gap-2",
        error ? "text-red-500" : "text-wellspring-earth/60"
      )}>
        {icon} {label}
      </label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full p-4 rounded-2xl border-2 outline-none transition-colors bg-wellspring-cream/30 flex items-center justify-between text-left",
          error ? "border-red-500 focus:border-red-600" : "border-wellspring-gold/10 focus:border-wellspring-green"
        )}
      >
        <span className={cn("text-sm", !value && "text-wellspring-earth/40")}>
          {selectedDate && isValid(selectedDate) 
            ? format(selectedDate, "PPP", { locale: fr }) 
            : "Sélectionner une date"}
        </span>
        <CalendarIcon size={18} className="text-wellspring-gold" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute z-50 mt-2 p-4 bg-white rounded-3xl shadow-2xl border border-wellspring-gold/10 origin-top-left"
          >
            <DayPicker
              mode="single"
              selected={selectedDate}
              onSelect={handleSelect}
              locale={fr}
              className="rdp-wellspring"
              classNames={{
                months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                month: "space-y-4",
                caption: "flex justify-center pt-1 relative items-center mb-4",
                caption_label: "text-sm font-bold text-wellspring-green uppercase tracking-widest",
                nav: "space-x-1 flex items-center",
                nav_button: "h-8 w-8 bg-transparent p-0 opacity-50 hover:opacity-100 transition-opacity",
                nav_button_previous: "absolute left-1",
                nav_button_next: "absolute right-1",
                table: "w-full border-collapse space-y-1",
                head_row: "flex",
                head_cell: "text-wellspring-earth/40 rounded-md w-9 font-bold text-[10px] uppercase tracking-tighter",
                row: "flex w-full mt-2",
                cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-wellspring-gold/5 [&:has([aria-selected])]:bg-wellspring-gold/10 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-wellspring-gold/20 rounded-full transition-colors",
                day_range_end: "day-range-end",
                day_selected: "bg-wellspring-green text-white hover:bg-wellspring-green hover:text-white focus:bg-wellspring-green focus:text-white",
                day_today: "bg-wellspring-gold/10 text-wellspring-gold font-bold",
                day_outside: "day-outside text-wellspring-earth/20 opacity-50 aria-selected:bg-wellspring-gold/5 aria-selected:text-wellspring-earth/20 aria-selected:opacity-30",
                day_disabled: "text-wellspring-earth/20 opacity-50",
                day_range_middle: "aria-selected:bg-wellspring-gold/5 aria-selected:text-wellspring-earth",
                day_hidden: "invisible",
              }}
              components={{
                Chevron: ({ ...props }) => {
                  if (props.orientation === 'left') return <ChevronLeft className="h-4 w-4" />;
                  return <ChevronRight className="h-4 w-4" />;
                }
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
