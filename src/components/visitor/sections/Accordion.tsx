"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";
import { HelpCircle } from "lucide-react";
import { FAQS } from "@/config"; // Strictly using your constant data

export default function FAQSection() {
  return (
    <section className="py-24 lg:py-32 bg-gradient-to-b from-white via-zinc-50 to-white dark:from-zinc-950 dark:via-zinc-900/40 dark:to-zinc-950 transition-colors">
      <div className="mx-auto max-w-3xl px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-orange-600 dark:text-orange-500 font-bold tracking-widest uppercase text-xs flex items-center justify-center gap-2 mb-4">
            <HelpCircle className="h-4 w-4" /> Support Center
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-white">
            Common Inquiries
          </h2>
        </motion.div>

        <Accordion type="single" collapsible className="w-full space-y-4">
          {FAQS.map((faq) => (
            <AccordionItem 
              key={faq.id} 
              value={faq.id} 
              className="border border-zinc-200 dark:border-zinc-800 rounded-2xl px-8 overflow-hidden transition-all data-[state=open]:border-orange-500/50 data-[state=open]:bg-orange-50/30 dark:data-[state=open]:bg-orange-500/5"
            >
              <AccordionTrigger className="text-left font-bold text-lg py-6 hover:no-underline hover:text-orange-600 dark:text-zinc-200 transition-colors">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-zinc-500 dark:text-zinc-400 text-base leading-relaxed pb-6">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}