import { NavLink, useLocation } from 'react-router-dom';
import { Home, Clock, History } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/', icon: Home, label: 'Dashboard' },
  { to: '/create', icon: Clock, label: 'Vendre' },
  { to: '/history', icon: History, label: 'Historique' },
];

export function Navigation() {
  const location = useLocation();
  
  // Hide navigation on focus page
  if (location.pathname === '/focus') {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-xl border-t border-border/50">
      <div className="flex items-center justify-around py-3 px-4 max-w-md mx-auto">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-300',
                isActive
                  ? 'text-silver-light'
                  : 'text-muted-foreground hover:text-silver'
              )
            }
          >
            {({ isActive }) => (
              <>
                <div
                  className={cn(
                    'p-2 rounded-xl transition-all duration-300',
                    isActive && 'bg-silver/10 glow-silver'
                  )}
                >
                  <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span className="text-xs font-medium">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
