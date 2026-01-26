"use client";

import * as React from "react";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";
import { Card, CardContent } from "@/components/ui/card";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    type CarouselApi,
} from "@/components/ui/carousel";
import { REVIEWS as CONSTANT_REVIEWS } from "@/config";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils";
import { ImageWithFallback } from "@/components/common/utils/ImageWithFallback";

interface Review {
    name: string;
    role: string;
    text: string;
    avatar: string;
    categories?: string[];
}

export default function TestimonialCarousel({ databaseReviews }: { databaseReviews?: Review[] }) {
    const [api, setApi] = React.useState<CarouselApi>();
    const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);
    const [current, setCurrent] = React.useState(0);
    const [count, setCount] = React.useState(0);

    const reviewsToDisplay = (databaseReviews && databaseReviews.length > 0) 
        ? databaseReviews 
        : CONSTANT_REVIEWS;

    React.useEffect(() => {
        if (!api) return;
        setCount(api.scrollSnapList().length);
        setCurrent(api.selectedScrollSnap());

        api.on("select", () => {
            setCurrent(api.selectedScrollSnap());
        });
    }, [api]);

    const categoryStats = React.useMemo(() => {
        const stats: { [key: string]: number } = {};
        reviewsToDisplay.forEach(review => {
            review.categories?.forEach(cat => {
                stats[cat] = (stats[cat] || 0) + 1;
            });
        });
        return Object.entries(stats).sort((a, b) => b[1] - a[1]).slice(0, 5);
    }, [reviewsToDisplay]);

    const filteredReviews = React.useMemo(() => {
        if (!selectedCategory) return reviewsToDisplay;
        return reviewsToDisplay.filter(review => 
            review.categories?.includes(selectedCategory)
        );
    }, [selectedCategory, reviewsToDisplay]);

    return (
        <section className="bg-white dark:bg-zinc-950 py-16 lg:py-32 transition-colors duration-500">
            <div className="max-w-7xl mx-auto px-4 md:px-6 relative">
                
                {/* Header Section */}
                <div className="text-center space-y-4 mb-12">
                    <span className="text-orange-600 dark:text-orange-500 font-bold tracking-widest uppercase text-[10px] md:text-xs">
                        Community Voices
                    </span>
                    <h2 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
                        What our <span className="text-orange-600">guests say</span>
                    </h2>
                </div>

                {/* Filter Pills - Better mobile scrolling */}
                <div className="mb-12 flex items-center justify-start md:justify-center gap-2 overflow-x-auto pb-4 no-scrollbar">
                    <Button
                        onClick={() => setSelectedCategory(null)}
                        size="sm"
                        variant={selectedCategory === null ? "default" : "outline"}
                        className={cn(
                            "rounded-full px-5 py-1 transition-all shrink-0",
                            selectedCategory === null 
                                ? "bg-orange-600 hover:bg-orange-700 text-white border-transparent" 
                                : "text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800"
                        )}
                    >
                        All
                    </Button>
                    {categoryStats.map(([category, count]) => (
                        <Button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            size="sm"
                            variant={selectedCategory === category ? "default" : "outline"}
                            className={cn(
                                "rounded-full px-5 py-1 capitalize transition-all shrink-0",
                                selectedCategory === category 
                                    ? "bg-orange-600 hover:bg-orange-700 text-white border-transparent" 
                                    : "text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800"
                            )}
                        >
                            {category} <span className="ml-1 opacity-50 text-[10px]">{count}</span>
                        </Button>
                    ))}
                </div>

                {/* Carousel Container */}
                <div className="relative">
                    <Carousel 
                        setApi={setApi} 
                        plugins={[Autoplay({ delay: 5000, stopOnInteraction: true })]}
                        opts={{ align: "start", loop: true }} 
                        className="w-full"
                    >
                        <CarouselContent className="-ml-2 md:-ml-4">
                            {filteredReviews.map((review, index) => (
                                <CarouselItem key={index} className="pl-2 md:pl-4 basis-[90%] md:basis-1/2 lg:basis-1/3">
                                    <Card className="h-full border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 rounded-[2rem] transition-colors">
                                        <CardContent className="p-6 md:p-10 flex flex-col h-full">
                                            <Quote className="h-8 w-8 text-orange-500/20 mb-4" />
                                            <div className="flex gap-0.5 mb-4">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className="h-3.5 w-3.5 fill-orange-500 text-orange-500" />
                                                ))}
                                            </div>
                                            <p className="text-zinc-700 dark:text-zinc-300 text-base md:text-lg leading-relaxed italic mb-8 flex-grow">
                                                "{review.text}"
                                            </p>
                                            <div className="flex items-center gap-4 border-t border-zinc-200 dark:border-zinc-800 pt-6">
                                                <ImageWithFallback 
                                                    src={review.avatar} 
                                                    alt={review.name}
                                                    fallbackType="generic"
                                                    className="h-10 w-10 md:h-12 md:w-12 rounded-xl object-cover ring-2 ring-orange-500/10"
                                                />
                                                <div className="min-w-0">
                                                    <p className="font-bold text-sm md:text-base text-zinc-900 dark:text-zinc-100 truncate">
                                                        {review.name}
                                                    </p>
                                                    <p className="text-[10px] md:text-xs text-zinc-500 dark:text-zinc-400 font-medium truncate uppercase tracking-wider">
                                                        {review.role}
                                                    </p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                    </Carousel>

                    {/* Navigation - Hidden on mobile, floating on desktop */}
                    <div className="hidden lg:flex absolute top-1/2 -translate-y-1/2 -left-6 -right-6 justify-between pointer-events-none">
                        <Button 
                            variant="outline" 
                            size="icon" 
                            onClick={() => api?.scrollPrev()}
                            className="pointer-events-auto rounded-full h-12 w-12 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-xl"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </Button>
                        <Button 
                            variant="outline" 
                            size="icon" 
                            onClick={() => api?.scrollNext()}
                            className="pointer-events-auto rounded-full h-12 w-12 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-xl"
                        >
                            <ChevronRight className="h-5 w-5" />
                        </Button>
                    </div>
                </div>

                {/* Footer Navigation (Mobile Friendly) */}
                <div className="mt-8 flex items-center justify-between lg:justify-center gap-4">
                    {/* Mobile Arrows */}
                    <div className="flex lg:hidden gap-2">
                         <Button 
                            variant="outline" 
                            size="icon" 
                            onClick={() => api?.scrollPrev()}
                            className="rounded-full h-10 w-10 dark:text-zinc-50 border-zinc-200 dark:border-zinc-800"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button 
                            variant="outline" 
                            size="icon" 
                            onClick={() => api?.scrollNext()}
                            className="rounded-full h-10 w-10 dark:text-zinc-50 border-zinc-200 dark:border-zinc-800"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* Progress Dots */}
                    <div className="flex gap-1.5">
                        {Array.from({ length: count }).map((_, i) => (
                            <button
                                key={i}
                                onClick={() => api?.scrollTo(i)}
                                className={cn(
                                    "h-1.5 transition-all rounded-full",
                                    current === i 
                                        ? "w-6 md:w-8 bg-orange-600" 
                                        : "w-1.5 md:w-2 bg-zinc-300 dark:bg-zinc-800"
                                )}
                                aria-label={`Go to slide ${i + 1}`}
                            />
                        ))}
                    </div>
                    
                    {/* Placeholder for desktop balance */}
                    <div className="w-20 hidden lg:block" />
                </div>
            </div>
        </section>
    );
}