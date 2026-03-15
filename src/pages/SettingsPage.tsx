import DashboardLayout from '@/components/DashboardLayout';
import { Settings } from 'lucide-react';

const SettingsPage = () => {
  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-foreground mb-6">Paramètres</h1>
        <div className="rounded-lg border border-border bg-card p-12 text-center">
          <Settings className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Paramètres en cours de développement.</p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
