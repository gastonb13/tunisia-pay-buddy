import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Calculator, CheckCircle2, AlertCircle, Download, FileText,
  ChevronRight, Eye, Lock, Unlock, ArrowRight, Clock
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { calculatePayroll, formatTND, type PayrollInput } from '@/lib/payroll';

// Mock employees with payroll-relevant data
const employeesData = [
  { id: 1, name: 'Ahmed Ben Ali', position: 'Ingénieur', department: 'IT', grossSalary: 3200, familySituation: 'married_with_children' as const, numberOfChildren: 2, hasDisabledChild: false, overtime: 0, bonus: 0, absence: 0 },
  { id: 2, name: 'Fatma Trabelsi', position: 'Comptable', department: 'Finance', grossSalary: 2800, familySituation: 'married' as const, numberOfChildren: 0, hasDisabledChild: false, overtime: 0, bonus: 200, absence: 0 },
  { id: 3, name: 'Mohamed Hamdi', position: 'Commercial', department: 'Ventes', grossSalary: 2200, familySituation: 'single' as const, numberOfChildren: 0, hasDisabledChild: false, overtime: 150, bonus: 400, absence: 0 },
  { id: 4, name: 'Sarra Mejri', position: 'RH', department: 'RH', grossSalary: 2600, familySituation: 'married_with_children' as const, numberOfChildren: 1, hasDisabledChild: false, overtime: 0, bonus: 0, absence: 0 },
  { id: 5, name: 'Karim Bouazizi', position: 'Technicien', department: 'Production', grossSalary: 1800, familySituation: 'single' as const, numberOfChildren: 0, hasDisabledChild: false, overtime: 80, bonus: 0, absence: 1 },
  { id: 6, name: 'Leila Chahed', position: 'Designer', department: 'Marketing', grossSalary: 2400, familySituation: 'married_with_children' as const, numberOfChildren: 3, hasDisabledChild: true, overtime: 0, bonus: 0, absence: 5 },
  { id: 7, name: 'Youssef Nouri', position: 'Directeur', department: 'Direction', grossSalary: 5500, familySituation: 'married_with_children' as const, numberOfChildren: 2, hasDisabledChild: false, overtime: 0, bonus: 500, absence: 0 },
  { id: 8, name: 'Amira Khelifi', position: 'Assistante', department: 'Administration', grossSalary: 1600, familySituation: 'single' as const, numberOfChildren: 0, hasDisabledChild: false, overtime: 0, bonus: 0, absence: 0 },
];

const months = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];

type PayrollStatus = 'draft' | 'validated' | 'locked';

const STEPS = [
  { key: 'review', label: 'Vérification', icon: Eye },
  { key: 'calculate', label: 'Calcul', icon: Calculator },
  { key: 'validate', label: 'Validation', icon: CheckCircle2 },
  { key: 'finalize', label: 'Finalisation', icon: Lock },
];

const Payroll = () => {
  const [selectedMonth, setSelectedMonth] = useState(String(new Date().getMonth()));
  const [selectedYear, setSelectedYear] = useState(String(new Date().getFullYear()));
  const [currentStep, setCurrentStep] = useState(0);
  const [status, setStatus] = useState<PayrollStatus>('draft');
  const [detailEmployee, setDetailEmployee] = useState<number | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // Calculate payroll for all employees
  const payrollResults = useMemo(() => {
    return employeesData.map(emp => {
      const effectiveGross = emp.grossSalary + emp.overtime + emp.bonus - (emp.absence * (emp.grossSalary / 26));
      const input: PayrollInput = {
        grossSalary: effectiveGross,
        familySituation: emp.familySituation,
        numberOfChildren: emp.numberOfChildren,
        hasDisabledChild: emp.hasDisabledChild,
      };
      const result = calculatePayroll(input);
      return { ...emp, effectiveGross, payroll: result };
    });
  }, []);

  const totals = useMemo(() => {
    return payrollResults.reduce(
      (acc, r) => ({
        grossTotal: acc.grossTotal + r.payroll.grossSalary,
        cnssEmployee: acc.cnssEmployee + r.payroll.cnssEmployee,
        cnssEmployer: acc.cnssEmployer + r.payroll.cnssEmployer,
        irpp: acc.irpp + r.payroll.incomeTax,
        netTotal: acc.netTotal + r.payroll.netSalary,
        employerCost: acc.employerCost + r.payroll.totalEmployerCost,
      }),
      { grossTotal: 0, cnssEmployee: 0, cnssEmployer: 0, irpp: 0, netTotal: 0, employerCost: 0 }
    );
  }, [payrollResults]);

  const selectedResult = detailEmployee !== null
    ? payrollResults.find(r => r.id === detailEmployee)
    : null;

  const handleNextStep = () => {
    if (currentStep === STEPS.length - 1) {
      setShowConfirmDialog(true);
    } else {
      setCurrentStep(prev => prev + 1);
      if (currentStep === 1) setStatus('validated');
    }
  };

  const handleLockPayroll = () => {
    setStatus('locked');
    setShowConfirmDialog(false);
  };

  return (
    <DashboardLayout>
      <div className="p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Gestion de la Paie</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Traitement mensuel de la paie — {months[Number(selectedMonth)]} {selectedYear}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {months.map((m, i) => (
                  <SelectItem key={i} value={String(i)}>{m}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[2024, 2025, 2026].map(y => (
                  <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Status & Step Progress */}
        <div className="bg-card border border-border rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Badge
                variant={status === 'locked' ? 'default' : status === 'validated' ? 'secondary' : 'outline'}
                className="text-xs"
              >
                {status === 'draft' && <><Clock className="w-3 h-3 mr-1" /> Brouillon</>}
                {status === 'validated' && <><CheckCircle2 className="w-3 h-3 mr-1" /> Validé</>}
                {status === 'locked' && <><Lock className="w-3 h-3 mr-1" /> Clôturé</>}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {employeesData.length} employés • Étape {currentStep + 1}/{STEPS.length}
              </span>
            </div>
            {status !== 'locked' && (
              <div className="flex gap-2">
                {currentStep > 0 && (
                  <Button variant="outline" size="sm" onClick={() => setCurrentStep(prev => prev - 1)}>
                    Précédent
                  </Button>
                )}
                <Button size="sm" className="bg-secondary text-secondary-foreground hover:bg-secondary/90" onClick={handleNextStep}>
                  {currentStep === STEPS.length - 1 ? 'Clôturer' : 'Étape suivante'}
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Button>
              </div>
            )}
          </div>

          {/* Stepper */}
          <div className="flex items-center gap-1">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              const isComplete = i < currentStep;
              const isCurrent = i === currentStep;
              return (
                <div key={step.key} className="flex-1 flex items-center">
                  <div className="flex items-center gap-2 flex-1">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                      isComplete ? 'bg-secondary text-secondary-foreground' :
                      isCurrent ? 'bg-secondary/20 text-secondary border border-secondary' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {isComplete ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                    </div>
                    <span className={`text-xs font-medium whitespace-nowrap ${isCurrent ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {step.label}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={`h-px flex-1 mx-2 ${i < currentStep ? 'bg-secondary' : 'bg-border'}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Masse Salariale Brute', value: totals.grossTotal, color: 'text-foreground' },
            { label: 'CNSS Total (Salarié)', value: totals.cnssEmployee, color: 'text-destructive' },
            { label: 'IRPP Total', value: totals.irpp, color: 'text-destructive' },
            { label: 'Net Total à Payer', value: totals.netTotal, color: 'text-secondary' },
          ].map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-card border border-border rounded-lg p-4"
            >
              <p className="text-xs text-muted-foreground mb-1">{card.label}</p>
              <p className={`text-lg font-semibold font-mono ${card.color}`}>{formatTND(card.value)}</p>
            </motion.div>
          ))}
        </div>

        {/* Payroll Table */}
        <Tabs defaultValue="details" className="space-y-4">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="details">Détail par employé</TabsTrigger>
              <TabsTrigger value="summary">Résumé</TabsTrigger>
            </TabsList>
            {status === 'locked' && (
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download className="w-3.5 h-3.5 mr-1.5" />
                  Exporter CSV
                </Button>
                <Button variant="outline" size="sm">
                  <FileText className="w-3.5 h-3.5 mr-1.5" />
                  Bulletins PDF
                </Button>
              </div>
            )}
          </div>

          <TabsContent value="details">
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      {['Employé', 'Brut', 'Primes', 'CNSS', 'IRPP', 'Net'].map(h => (
                        <th key={h} className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">{h}</th>
                      ))}
                      <th className="px-5 py-3" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {payrollResults.map((emp, i) => (
                      <motion.tr
                        key={emp.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.02 }}
                        className="hover:bg-accent/50 transition-colors cursor-pointer"
                        onClick={() => setDetailEmployee(emp.id)}
                      >
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-md bg-secondary/10 flex items-center justify-center text-xs font-semibold text-secondary">
                              {emp.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <p className="text-sm font-medium">{emp.name}</p>
                              <p className="text-xs text-muted-foreground">{emp.position}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3 text-sm font-mono">{formatTND(emp.grossSalary)}</td>
                        <td className="px-5 py-3 text-sm font-mono text-muted-foreground">
                          {emp.overtime + emp.bonus > 0 ? `+${formatTND(emp.overtime + emp.bonus)}` : '—'}
                        </td>
                        <td className="px-5 py-3 text-sm font-mono text-destructive">-{formatTND(emp.payroll.cnssEmployee)}</td>
                        <td className="px-5 py-3 text-sm font-mono text-destructive">-{formatTND(emp.payroll.incomeTax)}</td>
                        <td className="px-5 py-3 text-sm font-mono font-semibold text-secondary">{formatTND(emp.payroll.netSalary)}</td>
                        <td className="px-5 py-3">
                          <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-border bg-muted/30">
                      <td className="px-5 py-3 text-sm font-semibold">Total</td>
                      <td className="px-5 py-3 text-sm font-mono font-semibold">{formatTND(totals.grossTotal)}</td>
                      <td className="px-5 py-3" />
                      <td className="px-5 py-3 text-sm font-mono font-semibold text-destructive">-{formatTND(totals.cnssEmployee)}</td>
                      <td className="px-5 py-3 text-sm font-mono font-semibold text-destructive">-{formatTND(totals.irpp)}</td>
                      <td className="px-5 py-3 text-sm font-mono font-semibold text-secondary">{formatTND(totals.netTotal)}</td>
                      <td />
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="summary">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Employer costs breakdown */}
              <div className="bg-card border border-border rounded-lg p-5 space-y-4">
                <h3 className="text-sm font-semibold">Charges Patronales</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">CNSS Patronale (16.57%)</span>
                    <span className="font-mono font-medium">{formatTND(totals.cnssEmployer)}</span>
                  </div>
                  <div className="flex justify-between text-sm border-t border-border pt-3">
                    <span className="font-semibold">Coût Total Employeur</span>
                    <span className="font-mono font-semibold text-secondary">{formatTND(totals.employerCost)}</span>
                  </div>
                </div>
              </div>

              {/* Employee deductions breakdown */}
              <div className="bg-card border border-border rounded-lg p-5 space-y-4">
                <h3 className="text-sm font-semibold">Retenues Salariales</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">CNSS Salariale (9.18%)</span>
                    <span className="font-mono font-medium">{formatTND(totals.cnssEmployee)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">IRPP</span>
                    <span className="font-mono font-medium">{formatTND(totals.irpp)}</span>
                  </div>
                  <div className="flex justify-between text-sm border-t border-border pt-3">
                    <span className="font-semibold">Total Retenues</span>
                    <span className="font-mono font-semibold text-destructive">{formatTND(totals.cnssEmployee + totals.irpp)}</span>
                  </div>
                </div>
              </div>

              {/* Net pay ratio */}
              <div className="bg-card border border-border rounded-lg p-5 space-y-4 md:col-span-2">
                <h3 className="text-sm font-semibold">Répartition de la masse salariale</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Net ({((totals.netTotal / totals.grossTotal) * 100).toFixed(1)}%)</span>
                    <span>Retenues ({(((totals.cnssEmployee + totals.irpp) / totals.grossTotal) * 100).toFixed(1)}%)</span>
                  </div>
                  <Progress value={(totals.netTotal / totals.grossTotal) * 100} className="h-3" />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Employee Detail Dialog */}
      <Dialog open={detailEmployee !== null} onOpenChange={() => setDetailEmployee(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {selectedResult && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-md bg-secondary/10 flex items-center justify-center text-sm font-semibold text-secondary">
                    {selectedResult.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p>{selectedResult.name}</p>
                    <p className="text-xs font-normal text-muted-foreground">{selectedResult.position} — {selectedResult.department}</p>
                  </div>
                </div>
              )}
            </DialogTitle>
            <DialogDescription>
              Bulletin de paie — {months[Number(selectedMonth)]} {selectedYear}
            </DialogDescription>
          </DialogHeader>

          {selectedResult && (
            <div className="space-y-4 mt-2">
              {/* Earnings */}
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Gains</h4>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span>Salaire de base</span>
                    <span className="font-mono">{formatTND(selectedResult.grossSalary)}</span>
                  </div>
                  {selectedResult.overtime > 0 && (
                    <div className="flex justify-between text-sm">
                      <span>Heures supplémentaires</span>
                      <span className="font-mono text-secondary">+{formatTND(selectedResult.overtime)}</span>
                    </div>
                  )}
                  {selectedResult.bonus > 0 && (
                    <div className="flex justify-between text-sm">
                      <span>Primes</span>
                      <span className="font-mono text-secondary">+{formatTND(selectedResult.bonus)}</span>
                    </div>
                  )}
                  {selectedResult.absence > 0 && (
                    <div className="flex justify-between text-sm">
                      <span>Absences ({selectedResult.absence}j)</span>
                      <span className="font-mono text-destructive">-{formatTND(selectedResult.absence * (selectedResult.grossSalary / 26))}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-semibold border-t border-border pt-1.5">
                    <span>Brut effectif</span>
                    <span className="font-mono">{formatTND(selectedResult.payroll.grossSalary)}</span>
                  </div>
                </div>
              </div>

              {/* Deductions */}
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Retenues</h4>
                <div className="space-y-1.5">
                  {selectedResult.payroll.deductions
                    .filter(d => d.type === 'employee')
                    .map(d => (
                      <div key={d.label} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{d.label}</span>
                        <span className="font-mono text-destructive">-{formatTND(d.amount)}</span>
                      </div>
                    ))}
                </div>
              </div>

              {/* Net */}
              <div className="bg-muted rounded-lg p-4 flex justify-between items-center">
                <span className="font-semibold">Net à payer</span>
                <span className="text-xl font-bold font-mono text-secondary">{formatTND(selectedResult.payroll.netSalary)}</span>
              </div>

              {/* Employer charges */}
              <div className="text-xs text-muted-foreground">
                <span>Charges patronales : </span>
                {selectedResult.payroll.deductions
                  .filter(d => d.type === 'employer')
                  .map(d => `${d.label}: ${formatTND(d.amount)}`)
                  .join(' • ')}
                <span className="font-medium"> — Coût total : {formatTND(selectedResult.payroll.totalEmployerCost)}</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-warning" />
              Clôturer la paie
            </DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir clôturer la paie de {months[Number(selectedMonth)]} {selectedYear} ?
              Cette action est irréversible. Les bulletins de paie seront générés et les montants ne pourront plus être modifiés.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>Annuler</Button>
            <Button onClick={handleLockPayroll} className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
              <Lock className="w-3.5 h-3.5 mr-1.5" />
              Confirmer la clôture
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Payroll;
