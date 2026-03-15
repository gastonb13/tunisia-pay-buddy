import DashboardLayout from '@/components/DashboardLayout';
import { Building2 } from 'lucide-react';

const Company = () => {
  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-foreground mb-6">Entreprise</h1>
        <div className="rounded-lg border border-border bg-card p-12 text-center">
          <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Gestion de l'entreprise en cours de développement.</p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Company;
