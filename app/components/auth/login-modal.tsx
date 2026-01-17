import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useState } from 'react';

import { useAuthStore } from '@/store/auth-store';

interface Props {
  open: boolean;
  onClose: () => void;
}

const backdrop = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modal = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0 },
};

export function LoginModal({ open, onClose }: Props) {
  const [email, setEmail] = useState('');
  const { login, loading } = useAuthStore((s) => ({ login: s.login, loading: s.loading }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    login(email);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <motion.div
            className="absolute inset-0 bg-black/60"
            variants={backdrop}
            onClick={onClose}
          />

          <motion.div
            className="relative max-w-md w-full border border-white/10 rounded-2xl bg-white/5 p-8 backdrop-blur-xl"
            variants={modal}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <button
              className="absolute right-4 top-4 text-white/40 transition-colors hover:text-white"
              onClick={onClose}
              aria-label="Close"
            >
              <X size={20} />
            </button>

            <h2 className="mb-2 text-2xl text-white font-bold">Nexus Boardroom</h2>
            <p className="mb-6 text-white/50">Enter your email to continue</p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="border border-white/20 rounded-lg bg-white/5 px-4 py-3 text-white outline-none backdrop-blur-md transition-colors focus:border-white/40 placeholder:text-white/30"
                disabled={loading}
              />

              <button
                type="submit"
                disabled={loading || !email.trim()}
                className="rounded-lg from-cyan-500 to-blue-500 bg-gradient-to-r px-4 py-3 text-white font-medium transition-all disabled:cursor-not-allowed disabled:opacity-50 hover:opacity-90"
              >
                {loading ? 'Sending...' : 'Send Magic Link'}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
