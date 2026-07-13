var { motion, AnimatePresence } = window.Motion;

window.StadiumBackdrop = () => {
    const { selectedVenue } = window.useAppContext();

    return (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none bg-charcoal-900" style={{ perspective: "1000px" }}>
            <AnimatePresence mode="popLayout">
                <motion.div
                    key={selectedVenue.id}
                    initial={{ opacity: 0, scale: 1.1, rotateX: 10, rotateY: -10 }}
                    animate={{ opacity: 0.6, scale: 1, rotateX: 0, rotateY: 0 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="absolute inset-0 w-full h-full object-cover"
                >
                    <img 
                        src={selectedVenue.image} 
                        alt={selectedVenue.name}
                        loading="lazy"
                        className="w-full h-full object-cover"
                    />
                </motion.div>
            </AnimatePresence>
            
            {/* Gradient overlay for readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900 via-charcoal-900/60 to-transparent"></div>
        </div>
    );
};
