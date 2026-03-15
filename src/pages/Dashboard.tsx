import { motion } from 'framer-motion';
import { Users, Calculator, TrendingUp, AlertTriangle, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { formatTND } from '@/lib/payroll';

const kpis = [
  { label: 'Masse Salariale', value: 45680, change: +3.2, icon: Calculator, prefix: '' },
  { label: 'Employés Actifs', value: 24, change: +2, icon: Users, isCurrency: false },
  { label: 'CNSS Total', value: 11756.576, change: +3.2, icon: TrendingUp, prefix: '' },
  { label: 'Alertes', value: 3, change: 0, icon: AlertTriangle, isCurrency: false, isWarning: true },
];

const recentPayrolls = [
  { month: 'Février 2024', status: 'Finalisé', employees: 24, total: 45680, statusColor: 'success' as const },
  { month: 'Janvier 2024', status: 'Finalisé', employees: 23, total: 44200, statusColor: 'success' as const },
  { month: 'Décembre 2023', status: 'Finalisé', employees: 23, total: 44200, statusColor: 'success' as const },
];

const alerts = [
  { type: 'warning', message: 'Déclaration CNSS Février 2024 non soumise', action: 'Soumettre' },
  { type: 'warning', message: '2 employés sans coordonnées bancaires', action: 'Voir' },
  { type: 'warning', message: 'Certificats de retenue à la source 2023 à générer', action: 'Générer' },
];

const Dashboard = () => {
  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Tableau de Bord</h1>
          <p className="text-sm text-muted-foreground mt-1">Vue d'ensemble de votre paie — Mars 2024</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {kpis.map((kpi, i) => (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-card border border-border rounded-lg p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-muted-foreground">{kpi.label}</span>
                <div className={`w-8 h-8 rounded-md flex items-center justify-center ${
                  kpi.isWarning ? 'bg-warning/10' : 'bg-secondary/10'
                }`}>
                  <kpi.icon className={`w-4 h-4 ${kpi.isWarning ? 'text-warning' : 'text-secondary'}`} />
                </div>
              </div>
              <div className="font-mono text-2xl font-bold">
                {kpi.isCurrency === false ? kpi.value : formatTND(kpi.value)}
              </div>
              {kpi.change !== 0 && (
                <div className={`flex items-center gap-1 mt-1 text-xs ${
                  kpi.change > 0 ? 'text-success' : 'text-destructive'
                }`}>
                  {kpi.change > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {Math.abs(kpi.change)}% vs mois précédent
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Payrolls */}
          <div className="lg:col-span-2 bg-card border border-border rounded-lg">
            <div className="p-5 border-b border-border">
              <h2 className="font-semibold">Paies Récentes</h2>
            </div>
            <div className="divide-y divide-border">
              {recentPayrolls.map((p) => (
                <div key={p.month} className="flex items-center justify-between px-5 py-4 hover:bg-accent/50 transition-colors duration-150">
                  <div>
                    <p className="text-sm font-medium">{p.month}</p>
                    <p className="text-xs text-muted-foreground">{p.employees} employés</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-sm">{formatTND(p.total)}</span>
                    <span className="text-xs px-2 py-1 rounded-md bg-success/10 text-success font-medium">
                      {p.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Alerts */}
          <div className="bg-card border border-border rounded-lg">
            <div className="p-5 border-b border-border">
              <h2 className="font-semibold">Alertes</h2>
            </div>
            <div className="divide-y divide-border">
              {alerts.map((alert, i) => (
                <div key={i} className="px-5 py-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-warning mt-1.5 shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm">{alert.message}</p>
                      <button className="text-xs text-secondary font-medium mt-1 hover:underline">
                        {alert.action} →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
