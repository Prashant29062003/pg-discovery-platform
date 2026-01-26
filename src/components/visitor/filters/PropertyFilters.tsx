// src/components/visitor/PropertyFilters.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";

export default function PropertyFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Helper to update URL params
    const updateFilters = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) params.set(key, value);
        else params.delete(key);
        router.push(`?${params.toString()}`);
    };

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">Filters</h3>
                <Separator />
            </div>

            <Accordion type="multiple" defaultValue={["gender", "price"]}>
                {/* Gender Filter */}
                <AccordionItem value="gender" className="border-none">
                    <AccordionTrigger className="hover:no-underline font-semibold text-zinc-700 dark:text-zinc-300">
                        Gender
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-2">
                        {["Male", "Female", "Unisex"].map((gender) => (
                            <div key={gender} className="flex items-center space-x-3">
                                <Checkbox 
                                    id={gender} 
                                    checked={searchParams.get("gender") === gender}
                                    onCheckedChange={(checked) => {
                                        updateFilters("gender", checked ? gender : "");
                                    }}
                                />
                                <Label htmlFor={gender} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    {gender}
                                </Label>
                            </div>
                        ))}
                    </AccordionContent>
                </AccordionItem>

                {/* Price Filter */}
                <AccordionItem value="price" className="border-none">
                    <AccordionTrigger className="hover:no-underline font-semibold text-zinc-700 dark:text-zinc-300">
                        Monthly Rent
                    </AccordionTrigger>
                    <AccordionContent className="space-y-6 pt-4 px-2">
                        <Slider
                            defaultValue={[searchParams.get("maxPrice") ? parseInt(searchParams.get("maxPrice")!) : 25000]}
                            max={50000}
                            step={1000}
                            onValueCommit={(val) => updateFilters("maxPrice", val[0].toString())}
                            className="text-orange-500"
                        />
                        <div className="flex justify-between text-xs font-bold text-zinc-500">
                            <span>₹5,000</span>
                            <span className="text-orange-600">Up to ₹{searchParams.get("maxPrice") || "25,000"}</span>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
}