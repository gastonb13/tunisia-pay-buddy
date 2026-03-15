// Tunisian payroll calculation engine utilities

export interface PayrollInput {
  grossSalary: number;
  familySituation: 'single' | 'married' | 'married_with_children';
  numberOfChildren: number;
  hasDisabledChild: boolean;
}

export interface PayrollResult {
  grossSalary: number;
  cnssEmployee: number;
  cnssEmployer: number;
  taxableIncome: number;
  incomeTax: number;
  netSalary: number;
  totalEmployerCost: number;
  deductions: {
    label: string;
    amount: number;
    type: 'employee' | 'employer';
  }[];
}

// CNSS rates (2024 Tunisian legislation)
const CNSS_EMPLOYEE_RATE = 0.0918; // 9.18%
const CNSS_EMPLOYER_RATE = 0.1657; // 16.57%
const CNSS_CEILING = 0; // No ceiling since 2018 reform

// Tunisian income tax brackets (barème de l'impôt sur le revenu)
const TAX_BRACKETS = [
  { min: 0, max: 5000, rate: 0 },
  { min: 5000, max: 20000, rate: 0.26 },
  { min: 20000, max: 30000, rate: 0.28 },
  { min: 30000, max: 50000, rate: 0.32 },
  { min: 50000, max: Infinity, rate: 0.35 },
];

// Family deductions
const FAMILY_DEDUCTIONS = {
  married: 150, // Head of family
  perChild: 90, // Per dependent child (max 4)
  disabledChild: 120, // Additional for disabled child
};

function calculateIncomeTax(annualTaxableIncome: number): number {
  let tax = 0;
  for (const bracket of TAX_BRACKETS) {
    if (annualTaxableIncome <= bracket.min) break;
    const taxableInBracket = Math.min(annualTaxableIncome, bracket.max) - bracket.min;
    tax += taxableInBracket * bracket.rate;
  }
  return tax;
}

function getFamilyDeduction(input: PayrollInput): number {
  let deduction = 0;
  if (input.familySituation === 'married' || input.familySituation === 'married_with_children') {
    deduction += FAMILY_DEDUCTIONS.married;
  }
  const children = Math.min(input.numberOfChildren, 4);
  deduction += children * FAMILY_DEDUCTIONS.perChild;
  if (input.hasDisabledChild) {
    deduction += FAMILY_DEDUCTIONS.disabledChild;
  }
  return deduction;
}

export function calculatePayroll(input: PayrollInput): PayrollResult {
  const { grossSalary } = input;

  // CNSS calculations
  const cnssEmployee = grossSalary * CNSS_EMPLOYEE_RATE;
  const cnssEmployer = grossSalary * CNSS_EMPLOYER_RATE;

  // Taxable income (annual)
  const annualGross = grossSalary * 12;
  const annualCnssEmployee = cnssEmployee * 12;
  const annualTaxableIncome = annualGross - annualCnssEmployee;

  // Income tax (annual then monthly)
  const annualTax = calculateIncomeTax(annualTaxableIncome);
  const familyDeduction = getFamilyDeduction(input);
  const monthlyTax = Math.max(0, (annualTax - familyDeduction) / 12);

  // Net salary
  const netSalary = grossSalary - cnssEmployee - monthlyTax;
  const totalEmployerCost = grossSalary + cnssEmployer;

  return {
    grossSalary,
    cnssEmployee: Math.round(cnssEmployee * 1000) / 1000,
    cnssEmployer: Math.round(cnssEmployer * 1000) / 1000,
    taxableIncome: Math.round((annualTaxableIncome / 12) * 1000) / 1000,
    incomeTax: Math.round(monthlyTax * 1000) / 1000,
    netSalary: Math.round(netSalary * 1000) / 1000,
    totalEmployerCost: Math.round(totalEmployerCost * 1000) / 1000,
    deductions: [
      { label: 'CNSS Salarié (9.18%)', amount: Math.round(cnssEmployee * 1000) / 1000, type: 'employee' },
      { label: 'IRPP', amount: Math.round(monthlyTax * 1000) / 1000, type: 'employee' },
      { label: 'CNSS Patronale (16.57%)', amount: Math.round(cnssEmployer * 1000) / 1000, type: 'employer' },
    ],
  };
}

export function formatTND(amount: number): string {
  return new Intl.NumberFormat('fr-TN', {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  }).format(amount) + ' TND';
}
