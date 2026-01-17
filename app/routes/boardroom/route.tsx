import { useEffect, useState } from 'react';

import { LoginModal } from '@/components/auth';
import { ConfigPanel } from '@/components/god-mode';
import { Console, Sidebar, TopNav } from '@/components/hud';
import { Scene } from '@/components/stage';
import { AuthProvider, useAuthStore } from '@/store/auth-store';
import { ChatProvider } from '@/store/chat-store';
import { GodModeProvider, useGodModeStore } from '@/store/god-mode-store';

function BoardroomContent() {
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [sessionTitle, setSessionTitle] = useState('Quantum Leap Strategy');
  const [godModeValue, setGodModeValue] = useState('Balanced');

  useGodModeStore();
  const { user, checkAuth, loading } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const showLogin = !loading && !user;

  const handleLoginClose = () => {
    // Modal closes when user authenticates
  };

  return (
    <div className="bg-void fixed inset-0">
      <div className="absolute inset-0 z-0">
        <Scene />
      </div>

      <Sidebar activeSessionId={activeSessionId} onSessionSelect={setActiveSessionId} />

      <TopNav
        sessionTitle={sessionTitle}
        godModeValue={godModeValue}
        onTitleChange={setSessionTitle}
        onGodModeChange={setGodModeValue}
      />

      <ConfigPanel sessionId={activeSessionId ?? undefined} />

      <Console onSend={() => {}} />

      <LoginModal open={showLogin} onClose={handleLoginClose} />
    </div>
  );
}

export default function BoardroomRoute() {
  return (
    <AuthProvider>
      <ChatProvider>
        <GodModeProvider>
          <BoardroomContent />
        </GodModeProvider>
      </ChatProvider>
    </AuthProvider>
  );
}
