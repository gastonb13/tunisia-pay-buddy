import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, MoreHorizontal, Filter } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const employees = [
  { id: 1, name: 'Ahmed Ben Ali', cin: '07123456', position: 'Ingénieur', department: 'IT', contract: 'CDI', salary: 3200, status: 'active' },
  { id: 2, name: 'Fatma Trabelsi', cin: '08234567', position: 'Comptable', department: 'Finance', contract: 'CDI', salary: 2800, status: 'active' },
  { id: 3, name: 'Mohamed Hamdi', cin: '09345678', position: 'Commercial', department: 'Ventes', contract: 'CDD', salary: 2200, status: 'active' },
  { id: 4, name: 'Sarra Mejri', cin: '04456789', position: 'RH', department: 'RH', contract: 'CDI', salary: 2600, status: 'active' },
  { id: 5, name: 'Karim Bouazizi', cin: '05567890', position: 'Technicien', department: 'Production', contract: 'CDI', salary: 1800, status: 'active' },
  { id: 6, name: 'Leila Chahed', cin: '06678901', position: 'Designer', department: 'Marketing', contract: 'CDD', salary: 2400, status: 'leave' },
  { id: 7, name: 'Youssef Nouri', cin: '03789012', position: 'Directeur', department: 'Direction', contract: 'CDI', salary: 5500, status: 'active' },
  { id: 8, name: 'Amira Khelifi', cin: '02890123', position: 'Assistante', department: 'Administration', contract: 'CDI', salary: 1600, status: 'active' },
];

const Employees = () => {
  const [search, setSearch] = useState('');

  const filtered = employees.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.position.toLowerCase().includes(search.toLowerCase()) ||
    e.department.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Employés</h1>
            <p className="text-sm text-muted-foreground mt-1">{employees.length} employés enregistrés</p>
          </div>
          <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
            <Plus className="w-4 h-4 mr-2" />
            Ajouter un employé
          </Button>
        </div>

        <div className="bg-card border border-border rounded-lg">
          <div className="p-4 border-b border-border flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un employé..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filtrer
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">Employé</th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">CIN</th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">Poste</th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">Département</th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">Contrat</th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">Salaire Brut</th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">Statut</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((emp, i) => (
                  <motion.tr
                    key={emp.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="hover:bg-accent/50 transition-colors duration-150 cursor-pointer"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-md bg-secondary/10 flex items-center justify-center text-xs font-semibold text-secondary">
                          {emp.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="text-sm font-medium">{emp.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-sm font-mono text-muted-foreground">{emp.cin}</td>
                    <td className="px-5 py-3.5 text-sm">{emp.position}</td>
                    <td className="px-5 py-3.5 text-sm text-muted-foreground">{emp.department}</td>
                    <td className="px-5 py-3.5">
                      <Badge variant={emp.contract === 'CDI' ? 'default' : 'secondary'} className="text-xs">
                        {emp.contract}
                      </Badge>
                    </td>
                    <td className="px-5 py-3.5 text-sm font-mono">{emp.salary.toFixed(3)} TND</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                        emp.status === 'active' ? 'text-success' : 'text-warning'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          emp.status === 'active' ? 'bg-success' : 'bg-warning'
                        }`} />
                        {emp.status === 'active' ? 'Actif' : 'En congé'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <Button variant="ghost" size="icon" className="w-8 h-8">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Employees;
