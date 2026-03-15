import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Calculator, FileText, Building2, 
  Settings, LogOut, ChevronRight 
} from 'lucide-react';

const navItems = [
  { icon: LayoutDashboard, label: 'Tableau de Bord', path: '/dashboard' },
  { icon: Users, label: 'Employés', path: '/dashboard/employees' },
  { icon: Calculator, label: 'Paie', path: '/dashboard/payroll' },
  { icon: FileText, label: 'Déclarations', path: '/dashboard/declarations' },
  { icon: Building2, label: 'Entreprise', path: '/dashboard/company' },
  { icon: Settings, label: 'Paramètres', path: '/dashboard/settings' },
];

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const location = useLocation();

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-sidebar-border">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-sidebar-primary flex items-center justify-center">
              <Calculator className="w-3.5 h-3.5 text-sidebar-primary-foreground" />
            </div>
            <span className="font-semibold text-sidebar-accent-foreground">PaieTN</span>
          </Link>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors duration-150 group ${
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
                }`}
              >
                <item.icon className="w-4 h-4 shrink-0" />
                <span className="flex-1">{item.label}</span>
                {isActive && <ChevronRight className="w-3.5 h-3.5 opacity-50" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-sidebar-border">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-md bg-sidebar-accent/30">
            <div className="w-8 h-8 rounded-md bg-sidebar-primary/20 flex items-center justify-center text-xs font-semibold text-sidebar-primary">
              SA
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-accent-foreground truncate">Société ABC</p>
              <p className="text-xs text-sidebar-foreground truncate">admin@abc.tn</p>
            </div>
          </div>
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2 mt-1 rounded-md text-sm text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors duration-150"
          >
            <LogOut className="w-4 h-4" />
            Déconnexion
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
