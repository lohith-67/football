var { useState, useEffect, useRef } = React;
var { motion, useSpring, useTransform, AnimatePresence } = window.Motion;

window.LandingPage = () => {
    const { setMode } = window.useAppContext();
    const [reducedMotion, setReducedMotion] = useState(false);
    
    // Mouse Parallax State
    const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
    
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        setReducedMotion(mediaQuery.matches);
        const handleMotionChange = (e) => setReducedMotion(e.matches);
        mediaQuery.addEventListener('change', handleMotionChange);
        return () => mediaQuery.removeEventListener('change', handleMotionChange);
    }, []);

    const handleMouseMove = (e) => {
        if (reducedMotion) return;
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        setMousePosition({ x, y });
    };

    // Springs for smooth parallax
    const springConfig = { damping: 25, stiffness: 100, mass: 0.5 };
    const mouseXSpring = useSpring(0, springConfig);
    const mouseYSpring = useSpring(0, springConfig);

    useEffect(() => {
        mouseXSpring.set(mousePosition.x - 0.5);
        mouseYSpring.set(mousePosition.y - 0.5);
    }, [mousePosition, mouseXSpring, mouseYSpring]);

    // Parallax transforms (moves opposite to mouse slightly)
    const backgroundX = useTransform(mouseXSpring, [-0.5, 0.5], ["2%", "-2%"]);
    const backgroundY = useTransform(mouseYSpring, [-0.5, 0.5], ["2%", "-2%"]);

    // Staggered Animation Variants
    const containerVariants = {
        hidden: {},
        show: {
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 15, scale: 0.98 },
        show: { 
            opacity: 1, 
            y: 0, 
            scale: 1,
            transition: { duration: 1.2, ease: "easeOut" }
        }
    };

    return (
        <div 
            className="relative w-full h-screen bg-charcoal-950 overflow-hidden text-white flex flex-col items-center justify-center"
            onMouseMove={handleMouseMove}
        >
            {/* Background Image Container (Handles Parallax & Ken Burns) */}
            <motion.div
                className="absolute inset-0 z-0 w-[105%] h-[105%] -left-[2.5%] -top-[2.5%]"
                style={{
                    x: reducedMotion ? 0 : backgroundX,
                    y: reducedMotion ? 0 : backgroundY,
                }}
                initial={{ scale: 1.0 }}
                animate={{ scale: reducedMotion ? 1.0 : 1.06 }}
                transition={{ duration: 25, ease: "easeOut" }}
            >
                <img 
                    src="/images/stadium-hero.webp" 
                    alt="Stadium Background" 
                    loading="lazy"
                    fetchpriority="low"
                    className="w-full h-full object-cover"
                    style={{
                        filter: 'contrast(1.05) saturate(1.1) brightness(0.95)'
                    }}
                />
            </motion.div>

            {/* Subtle light flare effect */}
            {!reducedMotion && (
                <motion.div
                    className="absolute inset-0 z-0 pointer-events-none mix-blend-screen"
                    initial={{ x: "-50%", y: "10%", opacity: 0.1 }}
                    animate={{ x: "50%", y: "-10%", opacity: 0.3 }}
                    transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
                    style={{
                        background: 'radial-gradient(circle 800px at center, rgba(255,255,255,0.15) 0%, transparent 100%)'
                    }}
                />
            )}

            {/* Filmic Vignette / Gradient Overlay */}
            <div 
                className="absolute inset-0 z-10 pointer-events-none" 
                style={{
                    background: 'linear-gradient(to bottom, rgba(10,12,14,0.85) 0%, rgba(10,12,14,0) 15%, rgba(10,12,14,0) 70%, rgba(10,12,14,0.95) 100%)'
                }}
            />

            {/* Minimalist UI */}
            <div className="relative z-20 flex flex-col items-center justify-center text-center px-6 w-full h-full justify-end pb-32">
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="flex flex-col items-center"
                >
                    {/* Kicker */}
                    <motion.div 
                        variants={itemVariants}
                        className="text-gold-500 text-sm font-semibold tracking-[0.2em] uppercase mb-4 opacity-90 drop-shadow-md"
                    >
                        FIFA WORLD CUP 26 COPILOT
                    </motion.div>

                    {/* Main Title */}
                    <motion.h1 
                        variants={itemVariants}
                        className="text-6xl md:text-8xl font-black mb-3 text-white uppercase"
                        style={{ 
                            fontFamily: '"Times New Roman", Times, serif',
                            letterSpacing: '0.15em',
                            textShadow: '0 8px 40px rgba(0,0,0,0.9), 0 0 25px rgba(255,255,255,0.4), 0 0 50px rgba(201,162,75,0.2)'
                        }}
                    >
                        FIFA WORLD CUP 26
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.div 
                        variants={itemVariants}
                        className="text-lg md:text-xl text-charcoal-200 font-light mb-12 max-w-lg mx-auto"
                        style={{ textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}
                    >
                        Your GenAI companion for the tournament
                    </motion.div>

                    {/* Button */}
                    <motion.div variants={itemVariants}>
                        <button
                            onClick={() => setMode('fan')}
                            className="group relative px-16 py-5 rounded-full text-charcoal-900 font-extrabold tracking-widest uppercase transition-all duration-300 ease-out
                                       bg-gradient-to-b from-white to-charcoal-100
                                       shadow-[0_10px_30px_rgba(0,0,0,0.6)]
                                       hover:scale-[1.04] hover:shadow-[0_15px_40px_rgba(0,0,0,0.7),0_0_20px_rgba(255,255,255,0.3)]
                                       active:scale-[0.98]"
                            style={{
                                boxShadow: 'inset 0 2px 0 rgba(255,255,255,1), 0 10px 30px rgba(0,0,0,0.6)'
                            }}
                        >
                            Enter
                            {/* Inner subtle glow ring on hover */}
                            <div className="absolute inset-0 rounded-full border border-white/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none mix-blend-overlay"></div>
                        </button>
                    </motion.div>

                </motion.div>
            </div>
        </div>
    );
};
