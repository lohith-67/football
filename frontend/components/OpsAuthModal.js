var { useState, useEffect } = React;
var { motion, AnimatePresence } = window.Motion;

window.OpsAuthModal = () => {
    const { isOpsAuthModalOpen, setIsOpsAuthModalOpen, setOpsToken, setMode } = window.useAppContext();
    const [passcode, setPasscode] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpsAuthModalOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/ops/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ passcode })
            });

            if (!res.ok) {
                if (res.status === 429) {
                    throw new Error('Too many attempts. Please try again later.');
                }
                throw new Error('Invalid passcode');
            }

            const data = await res.json();
            setOpsToken(data.token);
            setIsOpsAuthModalOpen(false);
            setMode('ops');
            setPasscode('');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-charcoal-950/80 backdrop-blur-md">
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="w-full max-w-md glass-panel-dark rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] border border-charcoal-700/50 overflow-hidden relative"
            >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-pink-500"></div>
                
                <div className="p-8">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 mx-auto bg-charcoal-800 rounded-full flex items-center justify-center mb-4 border border-charcoal-700 shadow-inner">
                            <span className="text-3xl">🛡️</span>
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Ops Mode Access</h2>
                        <p className="text-charcoal-400 text-sm">Please enter the security passcode to continue.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <input
                                type="password"
                                value={passcode}
                                onChange={(e) => setPasscode(e.target.value)}
                                placeholder="Enter passcode"
                                className="w-full bg-charcoal-900/80 text-white rounded-xl px-4 py-3 border border-charcoal-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-center tracking-widest text-lg shadow-inner"
                                autoFocus
                            />
                            {error && (
                                <motion.p 
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                    className="text-red-400 text-sm mt-3 text-center"
                                >
                                    {error}
                                </motion.p>
                            )}
                        </div>

                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={() => setIsOpsAuthModalOpen(false)}
                                className="flex-1 py-3 px-4 rounded-xl text-charcoal-300 font-semibold hover:bg-charcoal-800 transition border border-charcoal-700 hover:text-white"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading || !passcode}
                                className="flex-1 py-3 px-4 rounded-xl text-white font-semibold transition bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                            >
                                {loading ? 'Verifying...' : 'Enter'}
                            </button>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};
