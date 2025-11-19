import { useLayoutEffect, useRef, memo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Platform = memo(() => {
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
        
        // Section Titles
        gsap.utils.toArray('.section-title').forEach(title => {
            gsap.fromTo(title, {
                opacity: 0,
                y: 40
            }, {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: title,
                    start: "top 90%"
                }
            });
        });

        // Pipeline Diagram
        gsap.fromTo("#training-diagram .pipeline-item", {
            opacity: 0,
            x: -50
        }, {
            opacity: 1,
            x: 0,
            stagger: 0.2,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
                trigger: "#training-diagram",
                start: "top 80%"
            }
        });

        // Pipeline Text
        gsap.fromTo("#training-text .pipeline-text-item", {
            opacity: 0,
            y: 50
        }, {
            opacity: 1,
            y: 0,
            stagger: 0.2,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
                trigger: "#training-text",
                start: "top 80%"
            }
        });

        // Founder Cards
        gsap.fromTo('.founder-card', {
            opacity: 0,
            y: 50
        }, {
            opacity: 1,
            y: 0,
            stagger: 0.2,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
                trigger: "#about",
                start: "top 70%"
            }
        });

        // Model Tiles
        gsap.fromTo('.model-tile', {
            opacity: 0,
            scale: 0.8
        }, {
            opacity: 1,
            scale: 1,
            stagger: 0.1,
            duration: 0.6,
            ease: "back.out(1.7)",
            scrollTrigger: {
                trigger: "#gallery",
                start: "top 80%"
            }
        });

    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="pt-20">
        {/* ========== TRAINING PIPELINE ========== */}
        <section id="training" className="py-20 md:py-32 px-4 container mx-auto max-w-7xl border-b border-ink/40 dark:border-stone/40 overflow-hidden">
            <h2 className="section-title text-center text-3xl md:text-4xl font-serif font-bold uppercase mb-20">Training Pipeline</h2>
            
            <div className="grid md:grid-cols-2 gap-16 items-center">
                <div id="training-diagram" className="text-ink-light dark:text-stone-light flex flex-col items-center">
                    <div className="pipeline-item w-full max-w-sm p-4 border-dashed border-ink-faint dark:border-stone-faint text-center text-ink dark:text-stone">
                        [DATA INGESTION]
                    </div>
                    <div className="pipeline-item text-2xl my-2 text-orange">↓</div>
                    <div className="pipeline-item w-full max-w-sm p-4 border-dashed border-ink-faint dark:border-stone-faint text-center text-ink dark:text-stone">
                        [FEATURE ENGINEERING]
                    </div>
                    <div className="pipeline-item text-2xl my-2 text-orange">↓</div>
                    <div className="pipeline-item w-full max-w-sm p-4 border-dashed border-ink-faint dark:border-stone-faint text-center text-ink dark:text-stone">
                        [REINFORCEMENT LEARNING]
                    </div>
                    <div className="pipeline-item text-2xl my-2 text-orange">↓</div>
                    <div className="pipeline-item w-full max-w-sm p-4 border-dashed border-ink-faint dark:border-stone-faint text-center text-ink dark:text-stone">
                        [BACKTESTING RIG]
                    </div>
                    <div className="pipeline-item text-2xl my-2 text-orange">↓</div>
                    <div className="pipeline-item w-full max-w-sm p-4 border border-ink dark:border-stone text-center bg-ink text-stone dark:bg-stone dark:text-ink font-bold">
                        [DEPLOYMENT]
                    </div>
                </div>
                
                <div id="training-text" className="space-y-8">
                    <div className="pipeline-text-item">
                        <h3 className="text-xl mb-2 text-orange font-mono">01. INGESTION</h3>
                        <p className="text-ink/80 dark:text-stone/80">The model ingests petabytes of real-time market data, global news feeds, and sentiment analysis. We build a complete, high-resolution picture of the market state.</p>
                    </div>
                    <div className="pipeline-text-item">
                        <h3 className="text-xl mb-2 text-orange font-mono">02. REINFORCEMENT</h3>
                        <p className="text-ink/80 dark:text-stone/80">Using a state-of-the-art Proximal Policy Optimization (PPO) framework, the agent learns to make optimal decisions. The reward function is shaped to seek high alpha while managing risk.</p>
                    </div>
                    <div className="pipeline-text-item">
                        <h3 className="text-xl mb-2 text-orange font-mono">03. DEPLOYMENT</h3>
                        <p className="text-ink/80 dark:text-stone/80">After passing a rigorous backtesting gauntlet, models are deployed to live markets, operating within strict risk-management parameters set by the research team.</p>
                    </div>
                </div>
            </div>
        </section>

        {/* ========== FOUNDERS SECTION ========== */}
        <section id="about" className="py-20 md:py-32 px-4 bg-stone dark:bg-ink text-ink dark:text-stone border-b border-ink/40 dark:border-stone/40">
            <div className="container mx-auto max-w-7xl">
                <h2 className="section-title text-center text-3xl md:text-4xl font-serif font-bold uppercase mb-20">The Founders</h2>
                
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="founder-card p-6 border-dotted border-ink-faint dark:border-stone-faint">
                        <img src="https://placehold.co/600x600/050505/F2F0EA?text=VANCE" alt="Founder 1" className="founder-image w-full aspect-square object-cover mb-4 filter grayscale transition-all duration-300" />
                        <h3 className="font-serif text-2xl">Dr. Elara Vance</h3>
                        <p className="text-sm text-ink/70 dark:text-stone/70">MODEL ENGINEER</p>
                    </div>
                    <div className="founder-card p-6 border-dotted border-ink-faint dark:border-stone-faint">
                        <img src="https://placehold.co/600x600/050505/F2F0EA?text=TANAKA" alt="Founder 2" className="founder-image w-full aspect-square object-cover mb-4 filter grayscale transition-all duration-300" />
                        <h3 className="font-serif text-2xl">Kenji Tanaka</h3>
                        <p className="text-sm text-ink/70 dark:text-stone/70">DATA INFRA ARCHITECT</p>
                    </div>
                    <div className="founder-card p-6 border-dotted border-ink-faint dark:border-stone-faint">
                        <img src="https://placehold.co/600x600/050505/F2F0EA?text=COLE" alt="Founder 3" className="founder-image w-full aspect-square object-cover mb-4 filter grayscale transition-all duration-300" />
                        <h3 className="font-serif text-2xl">Marcus Cole</h3>
                        <p className="text-sm text-ink/70 dark:text-stone/70">RESEARCH DIRECTOR</p>
                    </div>
                </div>
            </div>
        </section>

        {/* ========== MODELS GALLERY ========== */}
        <section id="gallery" className="py-20 md:py-32 px-4 container mx-auto max-w-7xl border-b border-ink/40 dark:border-stone/40">
            <h2 className="section-title text-center text-3xl md:text-4xl font-serif font-bold uppercase mb-20">Agent Models</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="model-tile hover-target group border-dashed border-ink-faint dark:border-stone-faint p-8 flex flex-col items-center justify-center aspect-square transition-all duration-300 hover:scale-105 hover:bg-ink hover:text-stone dark:hover:bg-stone dark:hover:text-ink">
                    <i className="ph-thin ph-cube text-5xl mb-4 group-hover:text-orange transition-colors"></i>
                    <h3 className="text-lg font-mono">HA-Core</h3>
                </div>
                <div className="model-tile hover-target group border-dashed border-ink-faint dark:border-stone-faint p-8 flex flex-col items-center justify-center aspect-square transition-all duration-300 hover:scale-105 hover:bg-ink hover:text-stone dark:hover:bg-stone dark:hover:text-ink">
                    <i className="ph-thin ph-trend-up text-5xl mb-4 group-hover:text-orange transition-colors"></i>
                    <h3 className="text-lg font-mono">HA-Momentum</h3>
                </div>
                <div className="model-tile hover-target group border-dashed border-ink-faint dark:border-stone-faint p-8 flex flex-col items-center justify-center aspect-square transition-all duration-300 hover:scale-105 hover:bg-ink hover:text-stone dark:hover:bg-stone dark:hover:text-ink">
                    <i className="ph-thin ph-arrows-left-right text-5xl mb-4 group-hover:text-orange transition-colors"></i>
                    <h3 className="text-lg font-mono">HA-Arbitrage</h3>
                </div>
                <div className="model-tile hover-target group border-dashed border-ink-faint dark:border-stone-faint p-8 flex flex-col items-center justify-center aspect-square transition-all duration-300 hover:scale-105 hover:bg-ink hover:text-stone dark:hover:bg-stone dark:hover:text-ink">
                    <i className="ph-thin ph-timer text-5xl mb-4 group-hover:text-orange transition-colors"></i>
                    <h3 className="text-lg font-mono">HA-LongTerm</h3>
                </div>
            </div>
        </section>

        {/* ========== CTA SECTION ========== */}
        <section id="dashboard" className="py-24 md:py-40 px-4 bg-stone dark:bg-ink">
            <div className="container mx-auto max-w-3xl text-center">
                <h2 className="section-title text-4xl md:text-6xl font-serif font-black uppercase mb-12">Access the Private Beta</h2>
                <form className="flex flex-col md:flex-row gap-4 max-w-lg mx-auto" onSubmit={(e) => e.preventDefault()}>
                    <input type="email" placeholder="[ENTER EMAIL]" className="hover-target flex-1 bg-transparent border-b border-ink/70 dark:border-stone/70 p-3 text-center md:text-left outline-none focus:border-orange transition-colors font-mono" />
                    <button type="submit" className="hover-target border-dashed border-orange p-3 px-6 transition-all duration-300 hover:bg-orange hover:text-stone font-bold text-orange hover:border-orange font-mono">
                        Submit
                    </button>
                </form>
            </div>
        </section>
    </div>
  );
});

Platform.displayName = 'Platform';

export default Platform;



