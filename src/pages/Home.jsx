import { useLayoutEffect, useRef, memo } from 'react';
import gsap from 'gsap';
import CryptoPrices from '../components/CryptoPrices';
import ModelComparisonChart from '../components/ModelComparisonChart';

const Home = memo(() => {
  const heroRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
        // Hero Text Animation
        const headlines = gsap.utils.toArray('.hero-line');
        
        gsap.fromTo(headlines, {
            yPercent: 100,
            opacity: 0
        }, {
            yPercent: 0,
            opacity: 1,
            stagger: 0.15,
            duration: 1,
            ease: "power3.out",
            delay: 0.5
        });

        gsap.fromTo('#hero-sub', {
            opacity: 0,
            y: 20
        }, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            delay: 1.2
        });
        
        gsap.fromTo('#chart-section', {
            opacity: 0,
            scale: 0.95
        }, {
            opacity: 1,
            scale: 1,
            duration: 1,
            ease: "power3.out",
            delay: 1.5
        });

    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <main ref={heroRef} className="pt-24 min-h-screen flex flex-col">
        {/* Crypto Prices Ticker */}
        <CryptoPrices />

        <section className="container mx-auto max-w-7xl px-4 md:px-8 mb-12 pb-24 flex-1">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mt-8">
                
                {/* Text Content */}
                <div className="lg:col-span-5">
                    <div className="mb-6 inline-flex items-center gap-2 border border-ink/20 dark:border-stone/20 px-3 py-1 rounded-full">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="font-mono text-xs text-ink/60 dark:text-stone/60 uppercase tracking-wider">
                            System Status: Optimal
                        </span>
                    </div>

                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-black leading-[0.9] tracking-tight mb-8">
                        <div className="overflow-hidden"><span className="hero-line block text-ink dark:text-stone">Algorithmic</span></div>
                        <div className="overflow-hidden"><span className="hero-line block text-orange">Alpha</span></div>
                        <div className="overflow-hidden"><span className="hero-line block text-ink dark:text-stone">At Speed.</span></div>
                    </h1>

                    <div id="hero-sub" className="max-w-md">
                        <p className="text-lg text-ink/80 dark:text-stone/80 mb-8 leading-relaxed">
                            Our autonomous agents strip away market noise to expose pure structural logic. We don't just predict price action—we engineer the outcome.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button className="group relative px-6 py-3 bg-ink dark:bg-stone text-stone dark:text-ink font-mono font-bold overflow-hidden transition-all hover:bg-orange dark:hover:bg-orange hover:text-stone hover:border-orange">
                                <span className="relative z-10">Request Access</span>
                            </button>
                            <div className="flex items-center gap-3 px-4 py-3 border border-ink/20 dark:border-stone/20 font-mono text-sm">
                                <span className="text-orange">Agent: HA-1</span>
                                <span className="opacity-50">|</span>
                                <span className="text-ink/60 dark:text-stone/60">ACTIVE</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Chart Content */}
                <div id="chart-section" className="lg:col-span-7 w-full">
                    <ModelComparisonChart />
                </div>

            </div>
        </section>

        {/* Fixed Bottom Section */}
        <div className="fixed bottom-0 left-0 right-0 bg-stone/95 dark:bg-ink/95 backdrop-blur-md border-t border-ink/40 dark:border-stone/40 z-40">
            <div className="container mx-auto max-w-7xl px-4 md:px-8 py-4">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="font-mono text-xs text-ink/70 dark:text-stone/70">LIVE</span>
                        </div>
                        <span className="font-mono text-xs text-ink/60 dark:text-stone/60">
                            Alpha Arena Season 1 is now over, as of Nov 3rd, 2025 5 p.m. EST
                        </span>
                    </div>
                    <div className="font-mono text-xs text-orange font-bold">
                        Season 1.5 coming soon
                    </div>
                </div>
            </div>
        </div>
    </main>
  );
});

Home.displayName = 'Home';

export default Home;



