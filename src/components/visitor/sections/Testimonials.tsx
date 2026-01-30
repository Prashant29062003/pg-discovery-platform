"use client";

import * as React from "react";
import { Star, Quote, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { cn } from "@/utils";
import { ImageWithFallback } from "@/components/common/utils/ImageWithFallback";

interface Review {
    name: string;
    role: string;
    text: string;
    avatar: string;
    socialLink?: string;
    socialPlatform?: string;
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
        <section className="bg-background py-16 lg:py-32 transition-colors duration-500">
            <div className="max-w-7xl mx-auto px-4 md:px-6 relative">
                
                {/* Header Section */}
                <div className="text-center space-y-4 mb-12">
                    <span className="text-orange-600 dark:text-orange-500 font-bold tracking-widest uppercase text-[10px] md:text-xs">
                        Community Voices
                    </span>
                    <h2 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight text-foreground">
                        What our <span className="text-orange-600 dark:text-orange-500">guests say</span>
                    </h2>
                    <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
                        Real experiences from our community of professionals and students who call Elite Venue their home
                    </p>
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
                                : "text-muted-foreground border-border hover:bg-accent hover:text-accent-foreground"
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
                                    : "text-muted-foreground border-border hover:bg-accent hover:text-accent-foreground"
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
                                    <Card className="h-full border-border bg-card rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 group">
                                        <CardContent className="p-6 md:p-8 flex flex-col h-full">
                                            {/* Quote Icon */}
                                            <div className="flex items-start justify-between mb-4">
                                                <Quote className="h-6 w-6 text-orange-500/30 group-hover:text-orange-500/50 transition-colors" />
                                                <div className="flex gap-0.5">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star key={i} className="h-4 w-4 fill-orange-500 text-orange-500" />
                                                    ))}
                                                </div>
                                            </div>
                                            
                                            {/* Testimonial Text */}
                                            <blockquote className="text-card-foreground text-base md:text-lg leading-relaxed mb-6 flex-grow">
                                                "{review.text}"
                                            </blockquote>
                                            
                                            {/* Author Section */}
                                            <div className="flex items-center justify-between border-t border-border pt-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="relative">
                                                        <ImageWithFallback 
                                                            src={review.avatar} 
                                                            alt={review.name}
                                                            fallbackType="generic"
                                                            className="h-12 w-12 rounded-full object-cover ring-2 ring-orange-500/20 group-hover:ring-orange-500/40 transition-all"
                                                        />
                                                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-card"></div>
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="font-semibold text-sm md:text-base text-card-foreground">
                                                            {review.name}
                                                        </p>
                                                        <p className="text-xs md:text-sm text-muted-foreground">
                                                            {review.role}
                                                        </p>
                                                    </div>
                                                </div>
                                                
                                                {review.socialLink && (
                                                    <a 
                                                        href={review.socialLink}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-orange-600 dark:hover:text-orange-500 transition-colors"
                                                    >
                                                        <span>via {review.socialPlatform}</span>
                                                        <ExternalLink className="h-3 w-3" />
                                                    </a>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                    </Carousel>

                    {/* Navigation - Enhanced floating buttons */}
                    <div className="hidden lg:flex absolute top-1/2 -translate-y-1/2 -left-8 -right-8 justify-between pointer-events-none">
                        <Button 
                            variant="outline" 
                            size="icon" 
                            onClick={() => api?.scrollPrev()}
                            className="pointer-events-auto rounded-full h-14 w-14 bg-background/95 backdrop-blur-sm border-border shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </Button>
                        <Button 
                            variant="outline" 
                            size="icon" 
                            onClick={() => api?.scrollNext()}
                            className="pointer-events-auto rounded-full h-14 w-14 bg-background/95 backdrop-blur-sm border-border shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
                        >
                            <ChevronRight className="h-5 w-5" />
                        </Button>
                    </div>
                </div>

                {/* Enhanced Footer Navigation */}
                <div className="mt-12 flex items-center justify-between lg:justify-center gap-6">
                    {/* Mobile Arrows */}
                    <div className="flex lg:hidden gap-2">
                         <Button 
                            variant="outline" 
                            size="icon" 
                            onClick={() => api?.scrollPrev()}
                            className="rounded-full h-11 w-11 border-border hover:bg-accent hover:border-accent transition-colors"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button 
                            variant="outline" 
                            size="icon" 
                            onClick={() => api?.scrollNext()}
                            className="rounded-full h-11 w-11 border-border hover:bg-accent hover:border-accent transition-colors"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* Enhanced Progress Indicator */}
                    <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-muted-foreground">
                            {current + 1}/{count}
                        </span>
                        <div className="flex gap-2">
                            {Array.from({ length: count }).map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => api?.scrollTo(i)}
                                    className={cn(
                                        "h-2 transition-all rounded-full",
                                        current === i 
                                            ? "w-8 bg-orange-600 shadow-sm" 
                                            : "w-2 bg-muted hover:bg-muted-foreground/50"
                                    )}
                                    aria-label={`Go to slide ${i + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                    
                    {/* Placeholder for desktop balance */}
                    <div className="w-20 hidden lg:block" />
                </div>
            </div>
        </section>
    );
}