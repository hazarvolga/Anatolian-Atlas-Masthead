"use client";


import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronDown, Sparkles, Play, Star, Award, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

export default function HeroSection() {
  const { t } = useLanguage();
  const [scrollY, setScrollY] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const heroImages = [
    "https://images.unsplash.com/photo-1615571022219-eb45cf7faa9d?q=80&w=1920&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1920&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1920&auto=format&fit=crop"
  ];
  
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  const backgroundY = scrollY * 0.5;
  const contentY = scrollY * 0.2;
  
  return (
    <section className="relative h-screen overflow-hidden">
      {/* Enhanced Background with Crossfade */}
      <div className="absolute inset-0 w-full h-full">
        {heroImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 w-full h-full transition-opacity duration-2000 ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              backgroundImage: `url('${image}')`,
              transform: `translateY(${backgroundY}px)`,
              backgroundSize: 'cover',
              backgroundPosition: 'center center',
              backgroundRepeat: 'no-repeat',
              backgroundAttachment: 'fixed'
            }}
          />
        ))}
      </div>
      
      {/* Enhanced Multi-layer Overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-primary-500/20 to-black/70" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-accent-vibrant/10 via-transparent to-primary-400/10" />
      
      {/* Animated Floating Elements */}
      <div className="absolute top-20 right-20 w-32 h-32 bg-accent-vibrant/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-40 left-20 w-24 h-24 bg-primary-400/20 rounded-full blur-2xl animate-float [animation-delay:2s]" />
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-primary-500/30 rounded-full blur-xl animate-float [animation-delay:4s]" />
      
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-32 left-12 w-2 h-2 bg-accent-vibrant rounded-full animate-pulse" />
        <div className="absolute top-48 right-24 w-1 h-1 bg-primary-400 rounded-full animate-pulse [animation-delay:1s]" />
        <div className="absolute bottom-32 left-1/3 w-1.5 h-1.5 bg-primary-500 rounded-full animate-pulse [animation-delay:2s]" />
      </div>
      
      {/* Content */}
      <div
        className="relative h-full flex flex-col justify-center items-center text-center px-4 z-10"
        style={{ transform: `translateY(${contentY}px)` }}
      >
        <div className="max-w-6xl animate-fade-in">
          {/* Enhanced Premium Badge */}
          <div className="inline-flex items-center px-8 py-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full text-white/90 text-sm font-medium mb-8 animate-scale-in [animation-delay:200ms] hover:bg-white/15 transition-all duration-300 group">
            <Sparkles className="w-5 h-5 mr-3 text-accent-vibrant animate-pulse group-hover:animate-spin" />
            <span className="mr-3">{t.hero.subtitle}</span>
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="ml-1 text-xs">4.9/5</span>
          </div>
          
          {/* Enhanced Main Heading with Text Effects */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-8 animate-fade-in [animation-delay:400ms] leading-tight">
            <span className="bg-gradient-to-r from-white via-accent-vibrant to-primary-400 bg-clip-text text-transparent drop-shadow-2xl">
              {t.hero.title}
            </span>
          </h1>
          
          {/* Enhanced Subtitle with Typewriter Effect */}
          <p className="text-xl md:text-2xl lg:text-3xl text-white/90 mb-12 max-w-4xl mx-auto leading-relaxed animate-fade-in [animation-delay:600ms] font-light drop-shadow-lg">
            {t.hero.description}
          </p>
          
          {/* Enhanced CTA Buttons with Better Spacing */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-fade-in [animation-delay:800ms] mb-16">
            <Button asChild size="lg" className="btn-primary min-w-[280px] h-16 text-xl shadow-2xl hover:shadow-accent-vibrant/30 relative overflow-hidden group">
              <Link href="/tours" className="flex items-center">
                <span className="relative z-10">{t.hero.bookStay}</span>
                <span className="ml-3 transition-transform group-hover:translate-x-1 text-2xl relative z-10">→</span>
                <div className="absolute inset-0 bg-gradient-to-r from-accent-vibrant/20 to-primary-400/20 translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
              </Link>
            </Button>
            
            <Button asChild variant="outline" size="lg" className="min-w-[280px] h-16 text-xl backdrop-blur-xl bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/50 hover:scale-105 transition-all duration-300">
              <Link href="/tours" className="group flex items-center">
                <Play className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" />
                {t.hero.exploreApartments}
              </Link>
            </Button>
          </div>
          
          {/* Enhanced Stats with Better Visual Hierarchy */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto animate-fade-in [animation-delay:1000ms]">
            {[
              { icon: Users, label: "Happy Travelers", value: "10K+", color: "text-accent-vibrant" },
              { icon: Award, label: "Amazing Tours", value: "500+", color: "text-primary-400" },
              { icon: Star, label: "Countries", value: "25+", color: "text-primary-500" }
            ].map((stat, index) => (
              <div key={index} className="text-center group cursor-pointer">
                <div className="flex items-center justify-center mb-3">
                  <div className="p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 group-hover:bg-white/20 transition-all duration-300">
                    <stat.icon className={`w-6 h-6 ${stat.color} group-hover:scale-110 transition-transform`} />
                  </div>
                </div>
                <div className={`text-3xl md:text-4xl font-bold text-white group-hover:${stat.color} transition-colors duration-300`}>
                  {stat.value}
                </div>
                <div className="text-sm text-white/70 font-medium mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Enhanced Scroll Indicator with Animation */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
        <a 
          href="#welcome" 
          className="flex flex-col items-center opacity-80 hover:opacity-100 transition-all duration-300 group"
        >
          <span className="text-sm mb-3 text-white group-hover:text-accent-vibrant transition-colors font-medium">
            {t.hero.scrollDown}
          </span>
          <div className="p-4 rounded-full border-2 border-white/30 group-hover:border-accent-vibrant/70 transition-all duration-300 group-hover:bg-accent-vibrant/10 backdrop-blur-sm">
            <ChevronDown className="h-6 w-6 text-white group-hover:text-accent-vibrant transition-colors" />
          </div>
        </a>
      </div>
      
      {/* Enhanced Wave Animation with Better Layering */}
      <div className="absolute bottom-0 left-0 right-0 h-32 overflow-hidden z-10">
        <svg 
          className="absolute bottom-0 w-full h-32 fill-background opacity-90"
          preserveAspectRatio="none"
          viewBox="0 0 1440 120"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d="M0,60L48,65C96,70,192,80,288,75C384,70,480,50,576,45C672,40,768,50,864,60C960,70,1056,80,1152,80C1248,80,1344,70,1392,65L1440,60L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
            className="animate-wave opacity-40"
          />
          <path 
            d="M0,80L48,75C96,70,192,60,288,65C384,70,480,90,576,95C672,100,768,90,864,80C960,70,1056,60,1152,60C1248,60,1344,70,1392,75L1440,80L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
            className="animate-wave [animation-delay:-3s]"
          />
          <path 
            d="M0,100L48,95C96,90,192,80,288,85C384,90,480,110,576,115C672,120,768,110,864,100C960,90,1056,80,1152,80C1248,80,1344,90,1392,95L1440,100L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
            className="animate-wave [animation-delay:-6s] opacity-30"
          />
        </svg>
      </div>

      {/* Image Navigation Dots */}
      <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 z-10 flex space-x-3">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentImageIndex 
                ? 'bg-accent-vibrant scale-125' 
                : 'bg-white/40 hover:bg-white/60'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
