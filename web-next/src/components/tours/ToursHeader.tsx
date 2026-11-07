"use client";


export default function ToursHeader() {
  return (
    <section className="relative py-20 bg-gradient-to-r from-sea-light to-white dark:from-sea-dark dark:to-background overflow-hidden">
      <div className="container relative z-10">
        <div className="max-w-3xl mx-auto text-center animate-fade-in">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Discover Amazing Tours
          </h1>
          <p className="text-muted-foreground text-lg mb-6">
            Experience unforgettable adventures with our carefully curated tours and activities
          </p>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute bottom-0 right-0 w-1/2 h-1/2 opacity-10">
        <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-primary/50 blur-3xl" />
        <div className="absolute top-10 right-40 w-48 h-48 rounded-full bg-sea-light blur-3xl" />
      </div>
    </section>
  );
}
