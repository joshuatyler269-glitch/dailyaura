import React, { useState } from 'react';
import { Dashboard } from './components/Dashboard';

export function App() {
  // Provide a default mock user session immediately so testing is instant and seamless
  const [user, setUser] = useState<{ id: string; email: string }>({
    id: 'hero-local-user-001',
    email: 'hero@dailyaura.app',
  });

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-purple-500 selection:text-white">
      <Dashboard user={user} />
    </div>
  );
}

export default App;
