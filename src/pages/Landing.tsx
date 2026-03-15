import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, Calculator, FileText, BarChart3, Users, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PayrollSimulator from '@/components/PayrollSimulator';

const features = [
  { icon: Users, title: 'Gestion Employés', desc: 'Fiches complètes, contrats, historique et situation familiale.' },
  { icon: Calculator, title: 'Calcul de Paie', desc: 'Moteur conforme à la législation tunisienne : CNSS, IRPP, primes.' },
  { icon: FileText, title: 'Bulletins de Paie', desc: 'Génération PDF conforme, archivage et envoi automatique.' },
  { icon: Shield, title: 'Déclarations CNSS', desc: 'Annexe I, fichiers CD et certificats de retenue à la source.' },
  { icon: BarChart3, title: 'Tableaux de Bord', desc: 'Métriques clés, journal de paie et rapports personnalisés.' },
  { icon: Building2, title: 'Multi-Entreprise', desc: 'Architecture multi-tenant sécurisée par entreprise.' },
];

const plans = [
  { name: 'Essai Gratuit', price: '0', period: '1 mois', employees: 'Jusqu\'à 10', features: ['Toutes les fonctionnalités', '1 mois d\'essai', 'Support par email'] },
  { name: 'Basique', price: '49', period: '/mois', employees: '1-10 employés', features: ['Calcul de paie', 'Bulletins PDF', 'Déclaration CNSS', 'Support email'], highlighted: false },
  { name: 'Avancé', price: '149', period: '/mois', employees: '11-40 employés', features: ['Tout du Basique', 'Fichiers CD CNSS', 'Rapports avancés', 'Support prioritaire'], highlighted: true },
  { name: 'Entreprise', price: '349', period: '/mois', employees: '41-500 employés', features: ['Tout de l\'Avancé', 'API & intégrations', 'Multi-utilisateurs', 'Support dédié'] },
];

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-secondary flex items-center justify-center">
              <Calculator className="w-4 h-4 text-secondary-foreground" />
            </div>
            <span className="font-semibold text-lg">PaieTN</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Fonctionnalités</a>
            <a href="#simulator" className="text-muted-foreground hover:text-foreground transition-colors">Simulateur</a>
            <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">Tarifs</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm">Connexion</Button>
            </Link>
            <Link to="/dashboard">
              <Button size="sm" className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
                Commencer
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-24 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-secondary/10 text-secondary text-sm font-medium mb-6">
              <Shield className="w-3.5 h-3.5" />
              Conforme à la législation tunisienne 2024
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              La paie tunisienne,
              <br />
              <span className="text-secondary">simplifiée.</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Calculez les salaires, générez les bulletins de paie et soumettez vos déclarations CNSS — 
              le tout conforme au droit du travail tunisien.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link to="/dashboard">
                <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 h-12 px-8">
                  Essai gratuit — 1 mois
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <a href="#simulator">
                <Button variant="outline" size="lg" className="h-12 px-8">
                  Simulateur de paie
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6 bg-card border-y border-border">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Tout ce qu'il faut pour gérer la paie</h2>
            <p className="text-muted-foreground">Un outil complet conçu pour le marché tunisien</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-lg border border-border bg-background hover:shadow-md transition-shadow duration-150"
              >
                <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
                  <f.icon className="w-5 h-5 text-secondary" />
                </div>
                <h3 className="font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Simulator */}
      <section id="simulator" className="py-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-3">Simulateur de Paie</h2>
            <p className="text-muted-foreground">Estimez le salaire net à partir du brut selon la législation tunisienne</p>
          </div>
          <PayrollSimulator />
          <p className="text-xs text-muted-foreground text-center mt-4">
            * Simulation indicative basée sur les taux en vigueur. Ne remplace pas un conseil professionnel.
          </p>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-6 bg-card border-y border-border">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Tarifs simples et transparents</h2>
            <p className="text-muted-foreground">Choisissez le plan adapté à la taille de votre entreprise</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`p-6 rounded-lg border ${
                  plan.highlighted
                    ? 'border-secondary bg-secondary/5 ring-1 ring-secondary/20'
                    : 'border-border bg-background'
                }`}
              >
                {plan.highlighted && (
                  <div className="text-xs font-medium text-secondary mb-3 uppercase tracking-wider">Populaire</div>
                )}
                <h3 className="font-semibold text-lg mb-1">{plan.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{plan.employees}</p>
                <div className="mb-6">
                  <span className="text-3xl font-bold font-mono">{plan.price}</span>
                  <span className="text-muted-foreground text-sm ml-1">TND{plan.period}</span>
                </div>
                <ul className="space-y-2 mb-6">
                  {plan.features.map(f => (
                    <li key={f} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-success mt-0.5">✓</span> {f}
                    </li>
                  ))}
                </ul>
                <Button
                  className={`w-full ${plan.highlighted ? 'bg-secondary text-secondary-foreground hover:bg-secondary/90' : ''}`}
                  variant={plan.highlighted ? 'default' : 'outline'}
                >
                  Commencer
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border">
        <div className="container mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-secondary flex items-center justify-center">
              <Calculator className="w-3 h-3 text-secondary-foreground" />
            </div>
            <span className="font-semibold text-sm">PaieTN</span>
          </div>
          <p className="text-xs text-muted-foreground">
            © 2024 PaieTN. Ce logiciel ne remplace pas un conseil juridique ou comptable professionnel.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
