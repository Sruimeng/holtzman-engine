import { cn } from '@sruim/nexus-design';
import { useEffect, useRef, useState } from 'react';

const GLASS =
  'bg-slate-900/40 backdrop-blur-xl backdrop-saturate-150 border border-white/10 shadow-lg shadow-black/20';

interface User {
  name: string;
  avatar?: string;
}

interface HudNavProps {
  user: User;
  locale: 'zh' | 'en';
  onLocaleChange: (locale: 'zh' | 'en') => void;
  onLogout: () => void;
}

export const HudNav = ({ user, locale, onLocaleChange, onLogout }: HudNavProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;

    const handleClick = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [menuOpen]);

  return (
    <div className="fixed right-6 top-6 z-50 flex items-center gap-4">
      <button
        onClick={() => onLocaleChange(locale === 'zh' ? 'en' : 'zh')}
        className={cn(
          GLASS,
          'px-3 py-1.5 rounded-lg text-xs font-mono',
          'hover:border-cyan-500/50 transition-colors',
          'text-text-primary',
        )}
      >
        {locale.toUpperCase()}
      </button>

      <div ref={menuRef} className="relative">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className={cn(
            GLASS,
            'w-10 h-10 rounded-full overflow-hidden',
            'hover:ring-2 hover:ring-cyan-500/50',
            'transition-all',
          )}
        >
          {user.avatar ? (
            <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-cyan-400 font-bold">
              {user.name[0].toUpperCase()}
            </div>
          )}
        </button>

        {menuOpen && (
          <div
            className={cn(
              GLASS,
              'absolute top-12 right-0 min-w-[180px] rounded-lg overflow-hidden',
            )}
          >
            <div className="border-b border-white/10 px-4 py-3">
              <div className="text-sm text-white/90">{user.name}</div>
            </div>
            <button
              onClick={() => {
                onLogout();
                setMenuOpen(false);
              }}
              className="w-full px-4 py-2 text-left text-sm text-red-400 transition-colors hover:bg-white/5"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
