import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calculator, Users, Minus, Plus } from 'lucide-react';
import { calculatePayroll, formatTND, type PayrollInput } from '@/lib/payroll';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';

const PayrollSimulator = () => {
  const [input, setInput] = useState<PayrollInput>({
    grossSalary: 2000,
    familySituation: 'single',
    numberOfChildren: 0,
    hasDisabledChild: false,
  });

  const result = useMemo(() => calculatePayroll(input), [input]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 bg-card rounded-lg border border-border overflow-hidden shadow-lg">
      {/* Input Side */}
      <div className="p-8 border-b lg:border-b-0 lg:border-r border-border">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
            <Calculator className="w-5 h-5 text-secondary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Paramètres</h3>
            <p className="text-sm text-muted-foreground">Configurez votre simulation</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="gross" className="text-sm font-medium">Salaire Brut Mensuel (TND)</Label>
            <Input
              id="gross"
              type="number"
              value={input.grossSalary}
              onChange={(e) => setInput({ ...input, grossSalary: Number(e.target.value) || 0 })}
              className="font-mono text-lg h-12"
              min={0}
              step={50}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Situation Familiale</Label>
            <Select
              value={input.familySituation}
              onValueChange={(v) => setInput({ ...input, familySituation: v as PayrollInput['familySituation'] })}
            >
              <SelectTrigger className="h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single">Célibataire</SelectItem>
                <SelectItem value="married">Marié(e) sans enfants</SelectItem>
                <SelectItem value="married_with_children">Marié(e) avec enfants</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {input.familySituation === 'married_with_children' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label className="text-sm font-medium">Nombre d'enfants à charge</Label>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10"
                    onClick={() => setInput({ ...input, numberOfChildren: Math.max(0, input.numberOfChildren - 1) })}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="font-mono text-xl w-8 text-center">{input.numberOfChildren}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10"
                    onClick={() => setInput({ ...input, numberOfChildren: Math.min(4, input.numberOfChildren + 1) })}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                  <span className="text-sm text-muted-foreground">(max 4)</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Enfant handicapé à charge</Label>
                <Switch
                  checked={input.hasDisabledChild}
                  onCheckedChange={(v) => setInput({ ...input, hasDisabledChild: v })}
                />
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Results Side */}
      <div className="p-8 bg-accent/30">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
            <Users className="w-5 h-5 text-success" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Résultats</h3>
            <p className="text-sm text-muted-foreground">Détail de la paie mensuelle</p>
          </div>
        </div>

        <div className="space-y-4">
          <ResultRow label="Salaire Brut" value={formatTND(result.grossSalary)} highlight />
          
          <div className="border-t border-border pt-4">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Retenues Salarié</p>
            {result.deductions
              .filter(d => d.type === 'employee')
              .map(d => (
                <ResultRow key={d.label} label={d.label} value={`- ${formatTND(d.amount)}`} negative />
              ))}
          </div>

          <div className="border-t-2 border-secondary/30 pt-4">
            <ResultRow label="Salaire Net" value={formatTND(result.netSalary)} highlight primary />
          </div>

          <div className="border-t border-border pt-4">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Charges Patronales</p>
            {result.deductions
              .filter(d => d.type === 'employer')
              .map(d => (
                <ResultRow key={d.label} label={d.label} value={formatTND(d.amount)} />
              ))}
            <div className="mt-3">
              <ResultRow label="Coût Total Employeur" value={formatTND(result.totalEmployerCost)} highlight />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ResultRow = ({ 
  label, value, highlight, negative, primary 
}: { 
  label: string; value: string; highlight?: boolean; negative?: boolean; primary?: boolean;
}) => (
  <div className={`flex items-center justify-between py-1.5 ${highlight ? 'font-semibold' : ''}`}>
    <span className={`text-sm ${highlight ? 'text-foreground' : 'text-muted-foreground'}`}>{label}</span>
    <span className={`font-mono text-sm ${
      primary ? 'text-secondary text-base font-bold' : 
      negative ? 'text-destructive' : 
      highlight ? 'text-foreground' : 'text-muted-foreground'
    }`}>
      {value}
    </span>
  </div>
);

export default PayrollSimulator;
