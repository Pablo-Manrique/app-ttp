import type { ReactNode } from 'react';
import { Heart, Home, Route, Settings } from 'lucide-react';

export type AppView = 'home' | 'favorites' | 'journeys' | 'settings';
export function BottomNav({ view, onChange }: { view: AppView; onChange: (view: AppView) => void }) {
  const items: Array<{ id: AppView; label: string; icon: ReactNode }> = [
    { id: 'home', label: 'Inicio', icon: <Home size={20}/> },
    { id: 'favorites', label: 'Paradas', icon: <Heart size={20}/> },
    { id: 'journeys', label: 'Trayectos', icon: <Route size={20}/> },
    { id: 'settings', label: 'Ajustes', icon: <Settings size={20}/> },
  ];
  return <nav className="bottom-nav" aria-label="Navegación principal">{items.map(item => <button key={item.id} className={view === item.id ? 'nav-item active':'nav-item'} onClick={() => onChange(item.id)}>{item.icon}<span>{item.label}</span></button>)}</nav>;
}
