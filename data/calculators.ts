import { formatINR, formatNumber, formatPercent } from '../lib/format';

export type CalculatorInput = {
  id: string;
  label: string;
  type?: 'number' | 'select';
  unit?: string;
  tooltip?: string;
  min?: number;
  max?: number;
  step?: number;
  defaultValue: number;
  options?: { label: string; value: number }[];
};

export type CalculatorResult = {
  summary: { label: string; value: string; subLabel?: string }[];
  breakdown: { label: string; value: string }[];
  chart: {
    type: 'doughnut' | 'line' | 'bar';
    data: unknown;
  };
  schedule?: { label: string; emi: string; principal: string; interest: string; balance: string }[];
  insights?: string[];
  disclaimer?: string;
};

export type CalculatorConfig = {
  slug: string;
  title: string;
  description: string;
  category: string;
  inputs: CalculatorInput[];
  faqs: { question: string; answer: string }[];
  seo: { title: string; description: string };
  compute: (values: Record<string, number>) => CalculatorResult;
};

export const calculatorCategories = [
  {
    id: 'loan',
    label: 'Loan Calculators',
    description: 'EMI, eligibility, and repayment planning tools.'
  },
  {
    id: 'investment',
    label: 'Investment Calculators',
    description: 'SIP, CAGR, and compounding growth tools.'
  },
  {
    id: 'tax',
    label: 'Tax Calculators',
    description: 'Income tax, HRA, and capital gains estimators.'
  },
  {
    id: 'savings',
    label: 'Savings Calculators',
    description: 'FD, RD, PPF, and NPS growth tools.'
  },
  {
    id: 'retirement',
    label: 'Retirement Planning',
    description: 'Corpus, FIRE, and pension projections.'
  },
  {
    id: 'other',
    label: 'Other Tools',
    description: 'Inflation, net worth, and budget planning.'
  }
];

const buildLoanResult = (principal: number, rate: number, years: number): CalculatorResult => {
  const monthlyRate = rate / 12 / 100;
  const months = Math.max(1, Math.round(years * 12));
  const emi = monthlyRate === 0
    ? principal / months
    : principal * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
  const totalPayment = emi * months;
  const totalInterest = totalPayment - principal;

  let balance = principal;
  const schedule: { label: string; emi: string; principal: string; interest: string; balance: string }[] = [];
  const principalSeries: number[] = [];
  const interestSeries: number[] = [];
  const labels: string[] = [];
  let cumulativePrincipal = 0;
  let cumulativeInterest = 0;

  for (let monthIndex = 0; monthIndex < months; monthIndex += 1) {
    const interest = balance * monthlyRate;
    const principalComponent = emi - interest;
    balance = Math.max(0, balance - principalComponent);
    cumulativePrincipal += principalComponent;
    cumulativeInterest += interest;

    schedule.push({
      label: `Month ${monthIndex + 1}`,
      emi: formatINR(emi),
      principal: formatINR(principalComponent),
      interest: formatINR(interest),
      balance: formatINR(balance)
    });

    labels.push(`M${monthIndex + 1}`);
    principalSeries.push(Number(cumulativePrincipal.toFixed(0)));
    interestSeries.push(Number(cumulativeInterest.toFixed(0)));
  }

  const maxPoints = 36;
  const step = Math.max(1, Math.ceil(months / maxPoints));
  const sampledLabels = labels.filter((_, idx) => idx % step === 0);
  const sampledPrincipal = principalSeries.filter((_, idx) => idx % step === 0);
  const sampledInterest = interestSeries.filter((_, idx) => idx % step === 0);

  return {
    summary: [
      { label: 'Monthly EMI', value: formatINR(emi) },
      { label: 'Total Interest', value: formatINR(totalInterest) },
      { label: 'Total Payment', value: formatINR(totalPayment) }
    ],
    breakdown: [
      { label: 'Loan Amount', value: formatINR(principal) },
      { label: 'Interest Rate', value: formatPercent(rate) },
      { label: 'Tenure', value: `${years} years` },
      { label: 'Total Months', value: `${months}` }
    ],
    chart: {
      type: 'line',
      data: {
        labels: sampledLabels,
        datasets: [
          {
            label: 'Principal Paid',
            data: sampledPrincipal,
            borderColor: '#0F9D58',
            backgroundColor: 'rgba(15, 157, 88, 0.2)',
            tension: 0.35
          },
          {
            label: 'Interest Paid',
            data: sampledInterest,
            borderColor: '#0B3C5D',
            backgroundColor: 'rgba(11, 60, 93, 0.2)',
            tension: 0.35
          }
        ]
      }
    },
    schedule,
    insights: ['Higher tenure lowers EMI but increases total interest.']
  };
};

const buildSipResult = (monthly: number, rate: number, years: number): CalculatorResult => {
  const r = rate / 12 / 100;
  const months = years * 12;
  const futureValue = r === 0
    ? monthly * months
    : monthly * ((Math.pow(1 + r, months) - 1) / r) * (1 + r);
  const invested = monthly * months;
  const returns = futureValue - invested;

  const yearLabels = Array.from({ length: years }, (_, i) => `Year ${i + 1}`);
  let value = 0;
  const yearlyValues = yearLabels.map(() => {
    value = r === 0 ? value + monthly * 12 : value * Math.pow(1 + r, 12) + monthly * ((Math.pow(1 + r, 12) - 1) / r) * (1 + r);
    return Number(value.toFixed(0));
  });

  return {
    summary: [
      { label: 'Invested Amount', value: formatINR(invested) },
      { label: 'Estimated Returns', value: formatINR(returns) },
      { label: 'Future Value', value: formatINR(futureValue) }
    ],
    breakdown: [
      { label: 'Monthly SIP', value: formatINR(monthly) },
      { label: 'Expected Return', value: formatPercent(rate) },
      { label: 'Duration', value: `${years} years` }
    ],
    chart: {
      type: 'line',
      data: {
        labels: yearLabels,
        datasets: [
          {
            label: 'Portfolio Value',
            data: yearlyValues,
            borderColor: '#0F9D58',
            backgroundColor: 'rgba(15, 157, 88, 0.2)',
            tension: 0.35
          }
        ]
      }
    },
    insights: ['Step-up SIPs can accelerate your corpus without major lifestyle changes.']
  };
};

const buildLumpsumResult = (principal: number, rate: number, years: number): CalculatorResult => {
  const futureValue = principal * Math.pow(1 + rate / 100, years);
  const returns = futureValue - principal;
  const yearLabels = Array.from({ length: years }, (_, i) => `Year ${i + 1}`);
  const yearlyValues = yearLabels.map((_, index) =>
    Number((principal * Math.pow(1 + rate / 100, index + 1)).toFixed(0))
  );

  return {
    summary: [
      { label: 'Invested Amount', value: formatINR(principal) },
      { label: 'Estimated Returns', value: formatINR(returns) },
      { label: 'Future Value', value: formatINR(futureValue) }
    ],
    breakdown: [
      { label: 'Lumpsum', value: formatINR(principal) },
      { label: 'Expected Return', value: formatPercent(rate) },
      { label: 'Duration', value: `${years} years` }
    ],
    chart: {
      type: 'line',
      data: {
        labels: yearLabels,
        datasets: [
          {
            label: 'Portfolio Value',
            data: yearlyValues,
            borderColor: '#0B3C5D',
            backgroundColor: 'rgba(11, 60, 93, 0.2)',
            tension: 0.35
          }
        ]
      }
    }
  };
};

const buildCagrResult = (initial: number, final: number, years: number): CalculatorResult => {
  const cagr = years === 0 ? 0 : (Math.pow(final / initial, 1 / years) - 1) * 100;
  return {
    summary: [
      { label: 'Initial Value', value: formatINR(initial) },
      { label: 'Final Value', value: formatINR(final) },
      { label: 'CAGR', value: formatPercent(cagr) }
    ],
    breakdown: [
      { label: 'Duration', value: `${years} years` },
      { label: 'Total Growth', value: formatPercent(((final - initial) / initial) * 100) }
    ],
    chart: {
      type: 'bar',
      data: {
        labels: ['Initial', 'Final'],
        datasets: [
          {
            data: [initial, final],
            backgroundColor: ['#0F9D58', '#0B3C5D']
          }
        ]
      }
    }
  };
};
const buildCompoundResult = (principal: number, rate: number, years: number, comp: number): CalculatorResult => {
  const r = rate / 100;
  const fv = principal * Math.pow(1 + r / comp, comp * years);
  const interest = fv - principal;
  return {
    summary: [
      { label: 'Principal', value: formatINR(principal) },
      { label: 'Interest Earned', value: formatINR(interest) },
      { label: 'Maturity Value', value: formatINR(fv) }
    ],
    breakdown: [
      { label: 'Interest Rate', value: formatPercent(rate) },
      { label: 'Compounding', value: `${comp} times/year` },
      { label: 'Duration', value: `${years} years` }
    ],
    chart: {
      type: 'doughnut',
      data: {
        labels: ['Principal', 'Interest'],
        datasets: [
          {
            data: [principal, interest],
            backgroundColor: ['#0F9D58', '#0B3C5D']
          }
        ]
      }
    }
  };
};

const buildIncomeTaxResult = (income: number, deductions: number, regime: number): CalculatorResult => {
  const taxable = Math.max(0, income - deductions);
  const slabs = regime === 0
    ? [
        { limit: 250000, rate: 0 },
        { limit: 500000, rate: 0.05 },
        { limit: 1000000, rate: 0.2 },
        { limit: Infinity, rate: 0.3 }
      ]
    : [
        { limit: 300000, rate: 0 },
        { limit: 600000, rate: 0.05 },
        { limit: 900000, rate: 0.1 },
        { limit: 1200000, rate: 0.15 },
        { limit: 1500000, rate: 0.2 },
        { limit: Infinity, rate: 0.3 }
      ];

  let tax = 0;
  let previous = 0;
  slabs.forEach((slab) => {
    const slabAmount = Math.max(0, Math.min(taxable, slab.limit) - previous);
    tax += slabAmount * slab.rate;
    previous = slab.limit;
  });
  const cess = tax * 0.04;
  const totalTax = tax + cess;

  return {
    summary: [
      { label: 'Taxable Income', value: formatINR(taxable) },
      { label: 'Base Tax', value: formatINR(tax) },
      { label: 'Total Tax (incl. cess)', value: formatINR(totalTax) }
    ],
    breakdown: [
      { label: 'Annual Income', value: formatINR(income) },
      { label: 'Deductions', value: formatINR(deductions) },
      { label: 'Regime', value: regime === 0 ? 'Old Regime (sample slabs)' : 'New Regime (sample slabs)' }
    ],
    chart: {
      type: 'bar',
      data: {
        labels: ['Income', 'Tax'],
        datasets: [
          {
            data: [income, totalTax],
            backgroundColor: ['#0F9D58', '#0B3C5D']
          }
        ]
      }
    },
    disclaimer: 'Update slabs and cess in the code to match the latest tax rules.'
  };
};

const buildHraResult = (basic: number, hra: number, rent: number, metro: number): CalculatorResult => {
  const limitPercent = metro === 1 ? 0.5 : 0.4;
  const exemption = Math.min(hra, limitPercent * basic, Math.max(0, rent - 0.1 * basic));
  return {
    summary: [
      { label: 'HRA Exemption', value: formatINR(exemption) },
      { label: 'Taxable HRA', value: formatINR(Math.max(0, hra - exemption)) },
      { label: 'Monthly Rent', value: formatINR(rent) }
    ],
    breakdown: [
      { label: 'Basic Salary', value: formatINR(basic) },
      { label: 'HRA Received', value: formatINR(hra) },
      { label: 'City Type', value: metro === 1 ? 'Metro' : 'Non-metro' }
    ],
    chart: {
      type: 'doughnut',
      data: {
        labels: ['Exempt', 'Taxable'],
        datasets: [
          {
            data: [exemption, Math.max(0, hra - exemption)],
            backgroundColor: ['#0F9D58', '#0B3C5D']
          }
        ]
      }
    }
  };
};

const buildSalaryBreakup = (ctc: number, basicPercent: number): CalculatorResult => {
  const basic = ctc * (basicPercent / 100);
  const hra = basic * 0.4;
  const allowances = ctc - (basic + hra);
  return {
    summary: [
      { label: 'Basic Pay', value: formatINR(basic) },
      { label: 'HRA', value: formatINR(hra) },
      { label: 'Other Allowances', value: formatINR(allowances) }
    ],
    breakdown: [
      { label: 'CTC', value: formatINR(ctc) },
      { label: 'Basic %', value: formatPercent(basicPercent) },
      { label: 'HRA (40% of basic)', value: formatINR(hra) }
    ],
    chart: {
      type: 'doughnut',
      data: {
        labels: ['Basic', 'HRA', 'Allowances'],
        datasets: [
          {
            data: [basic, hra, allowances],
            backgroundColor: ['#0F9D58', '#0B3C5D', '#22c55e']
          }
        ]
      }
    }
  };
};

const buildCapitalGains = (buy: number, sell: number, holdingYears: number, shortRate: number, longRate: number, threshold: number): CalculatorResult => {
  const gain = sell - buy;
  const isLongTerm = holdingYears >= threshold;
  const taxRate = isLongTerm ? longRate : shortRate;
  const tax = Math.max(0, gain * (taxRate / 100));

  return {
    summary: [
      { label: 'Capital Gain', value: formatINR(gain) },
      { label: 'Tax Rate', value: formatPercent(taxRate) },
      { label: 'Estimated Tax', value: formatINR(tax) }
    ],
    breakdown: [
      { label: 'Purchase Price', value: formatINR(buy) },
      { label: 'Sale Price', value: formatINR(sell) },
      { label: 'Holding Period', value: `${holdingYears} years` }
    ],
    chart: {
      type: 'bar',
      data: {
        labels: ['Gain', 'Tax'],
        datasets: [
          {
            data: [gain, tax],
            backgroundColor: ['#0F9D58', '#0B3C5D']
          }
        ]
      }
    }
  };
};

const buildRecurringDeposit = (monthly: number, rate: number, years: number): CalculatorResult => {
  const months = years * 12;
  const r = rate / 12 / 100;
  const maturity = monthly * months + monthly * r * (months * (months + 1)) / 2;
  const invested = monthly * months;
  const interest = maturity - invested;

  return {
    summary: [
      { label: 'Invested Amount', value: formatINR(invested) },
      { label: 'Interest Earned', value: formatINR(interest) },
      { label: 'Maturity Value', value: formatINR(maturity) }
    ],
    breakdown: [
      { label: 'Monthly Deposit', value: formatINR(monthly) },
      { label: 'Rate', value: formatPercent(rate) },
      { label: 'Duration', value: `${years} years` }
    ],
    chart: {
      type: 'doughnut',
      data: {
        labels: ['Invested', 'Interest'],
        datasets: [
          {
            data: [invested, interest],
            backgroundColor: ['#0F9D58', '#0B3C5D']
          }
        ]
      }
    }
  };
};

const buildPpf = (annual: number, rate: number, years: number): CalculatorResult => {
  const r = rate / 100;
  const fv = annual * ((Math.pow(1 + r, years) - 1) / r) * (1 + r);
  const invested = annual * years;
  const interest = fv - invested;
  return {
    summary: [
      { label: 'Invested Amount', value: formatINR(invested) },
      { label: 'Interest Earned', value: formatINR(interest) },
      { label: 'Maturity Value', value: formatINR(fv) }
    ],
    breakdown: [
      { label: 'Annual Contribution', value: formatINR(annual) },
      { label: 'Rate', value: formatPercent(rate) },
      { label: 'Duration', value: `${years} years` }
    ],
    chart: {
      type: 'doughnut',
      data: {
        labels: ['Invested', 'Interest'],
        datasets: [
          {
            data: [invested, interest],
            backgroundColor: ['#0F9D58', '#0B3C5D']
          }
        ]
      }
    }
  };
};

const buildRetirementCorpus = (
  currentAge: number,
  retireAge: number,
  monthlyExpense: number,
  inflation: number,
  returnRate: number
): CalculatorResult => {
  const yearsToRetire = Math.max(0, retireAge - currentAge);
  const futureMonthly = monthlyExpense * Math.pow(1 + inflation / 100, yearsToRetire);
  const annualExpense = futureMonthly * 12;
  const corpus = annualExpense * 25;
  const monthlyRate = returnRate / 12 / 100;
  const months = yearsToRetire * 12;
  const sip = months === 0
    ? 0
    : corpus * monthlyRate / (Math.pow(1 + monthlyRate, months) - 1);

  return {
    summary: [
      { label: 'Monthly Expense at Retirement', value: formatINR(futureMonthly) },
      { label: 'Target Corpus', value: formatINR(corpus) },
      { label: 'Required Monthly SIP', value: formatINR(sip) }
    ],
    breakdown: [
      { label: 'Years to Retire', value: `${yearsToRetire}` },
      { label: 'Inflation Rate', value: formatPercent(inflation) },
      { label: 'Expected Return', value: formatPercent(returnRate) }
    ],
    chart: {
      type: 'bar',
      data: {
        labels: ['Today', 'Retirement'],
        datasets: [
          {
            data: [monthlyExpense, futureMonthly],
            backgroundColor: ['#0F9D58', '#0B3C5D']
          }
        ]
      }
    },
    disclaimer: 'Uses 25x annual expense rule for corpus estimate.'
  };
};
const buildFire = (annualExpense: number, currentCorpus: number, monthlyInvest: number, returnRate: number): CalculatorResult => {
  const target = annualExpense * 25;
  const monthlyRate = returnRate / 12 / 100;
  let corpus = currentCorpus;
  let months = 0;
  while (corpus < target && months < 1200) {
    corpus = corpus * (1 + monthlyRate) + monthlyInvest;
    months += 1;
  }
  const years = months / 12;

  return {
    summary: [
      { label: 'FIRE Target', value: formatINR(target) },
      { label: 'Years to FIRE', value: formatNumber(years) },
      { label: 'Monthly Investment', value: formatINR(monthlyInvest) }
    ],
    breakdown: [
      { label: 'Current Corpus', value: formatINR(currentCorpus) },
      { label: 'Expected Return', value: formatPercent(returnRate) },
      { label: 'Annual Expense', value: formatINR(annualExpense) }
    ],
    chart: {
      type: 'bar',
      data: {
        labels: ['Current', 'Target'],
        datasets: [
          {
            data: [currentCorpus, target],
            backgroundColor: ['#0F9D58', '#0B3C5D']
          }
        ]
      }
    },
    disclaimer: 'Uses 25x annual expense rule and constant return assumption.'
  };
};

const buildPension = (corpus: number, annuityRate: number): CalculatorResult => {
  const annualPension = corpus * (annuityRate / 100);
  const monthlyPension = annualPension / 12;
  return {
    summary: [
      { label: 'Monthly Pension', value: formatINR(monthlyPension) },
      { label: 'Annual Pension', value: formatINR(annualPension) },
      { label: 'Annuity Rate', value: formatPercent(annuityRate) }
    ],
    breakdown: [
      { label: 'Corpus', value: formatINR(corpus) },
      { label: 'Annuity Rate', value: formatPercent(annuityRate) }
    ],
    chart: {
      type: 'bar',
      data: {
        labels: ['Monthly Pension'],
        datasets: [
          {
            data: [monthlyPension],
            backgroundColor: ['#0F9D58']
          }
        ]
      }
    }
  };
};

const buildInflation = (current: number, rate: number, years: number): CalculatorResult => {
  const future = current * Math.pow(1 + rate / 100, years);
  return {
    summary: [
      { label: 'Current Cost', value: formatINR(current) },
      { label: 'Future Cost', value: formatINR(future) },
      { label: 'Inflation Rate', value: formatPercent(rate) }
    ],
    breakdown: [
      { label: 'Duration', value: `${years} years` }
    ],
    chart: {
      type: 'line',
      data: {
        labels: Array.from({ length: years }, (_, i) => `Year ${i + 1}`),
        datasets: [
          {
            label: 'Cost Projection',
            data: Array.from({ length: years }, (_, i) => Number((current * Math.pow(1 + rate / 100, i + 1)).toFixed(0))),
            borderColor: '#0B3C5D',
            backgroundColor: 'rgba(11, 60, 93, 0.2)'
          }
        ]
      }
    }
  };
};

const buildNetWorth = (assets: number, liabilities: number): CalculatorResult => {
  const netWorth = assets - liabilities;
  return {
    summary: [
      { label: 'Total Assets', value: formatINR(assets) },
      { label: 'Total Liabilities', value: formatINR(liabilities) },
      { label: 'Net Worth', value: formatINR(netWorth) }
    ],
    breakdown: [
      { label: 'Assets', value: formatINR(assets) },
      { label: 'Liabilities', value: formatINR(liabilities) }
    ],
    chart: {
      type: 'doughnut',
      data: {
        labels: ['Assets', 'Liabilities'],
        datasets: [
          {
            data: [assets, liabilities],
            backgroundColor: ['#0F9D58', '#0B3C5D']
          }
        ]
      }
    }
  };
};

const buildBudget = (income: number, fixed: number, variable: number, savings: number): CalculatorResult => {
  const totalExpense = fixed + variable + savings;
  const balance = income - totalExpense;
  return {
    summary: [
      { label: 'Monthly Income', value: formatINR(income) },
      { label: 'Total Allocation', value: formatINR(totalExpense) },
      { label: 'Remaining Balance', value: formatINR(balance) }
    ],
    breakdown: [
      { label: 'Fixed Expenses', value: formatINR(fixed) },
      { label: 'Variable Expenses', value: formatINR(variable) },
      { label: 'Savings Goal', value: formatINR(savings) }
    ],
    chart: {
      type: 'doughnut',
      data: {
        labels: ['Fixed', 'Variable', 'Savings'],
        datasets: [
          {
            data: [fixed, variable, savings],
            backgroundColor: ['#0F9D58', '#0B3C5D', '#22c55e']
          }
        ]
      }
    }
  };
};

const baseFaqs = [
  {
    question: 'How does this calculator work?',
    answer: 'It uses standard financial formulas to estimate results based on your inputs.'
  },
  {
    question: 'Can I download the Excel schedule?',
    answer: 'Yes. Loan calculators include a Download Excel button for the month-wise schedule.'
  }
];

export const calculators: CalculatorConfig[] = [
  {
    slug: 'emi-calculator',
    title: 'EMI Calculator',
    description: 'Calculate loan EMI, interest, and total payment instantly.',
    category: 'loan',
    inputs: [
      { id: 'principal', label: 'Loan Amount', unit: 'INR', defaultValue: 1000000, min: 50000, step: 10000 },
      { id: 'rate', label: 'Interest Rate', unit: '%', defaultValue: 8.5, min: 1, step: 0.1 },
      { id: 'years', label: 'Tenure (years)', defaultValue: 15, min: 1, step: 1 }
    ],
    faqs: [
      { question: 'What is EMI?', answer: 'EMI is the fixed monthly payment for a loan, including principal and interest.' },
      ...baseFaqs
    ],
    seo: {
      title: 'EMI Calculator - RupeePlanner',
      description: 'Compute EMI, total interest, and repayment schedule instantly.'
    },
    compute: (values) => buildLoanResult(values.principal, values.rate, values.years)
  },
  {
    slug: 'home-loan-calculator',
    title: 'Home Loan Calculator',
    description: 'Plan home loan EMIs with interest and tenure projections.',
    category: 'loan',
    inputs: [
      { id: 'principal', label: 'Home Loan Amount', unit: 'INR', defaultValue: 6000000, min: 500000, step: 50000 },
      { id: 'rate', label: 'Interest Rate', unit: '%', defaultValue: 8.2, min: 1, step: 0.1 },
      { id: 'years', label: 'Tenure (years)', defaultValue: 20, min: 5, step: 1 }
    ],
    faqs: baseFaqs,
    seo: {
      title: 'Home Loan Calculator - RupeePlanner',
      description: 'Estimate monthly EMI and total interest for home loans.'
    },
    compute: (values) => buildLoanResult(values.principal, values.rate, values.years)
  },
  {
    slug: 'personal-loan-calculator',
    title: 'Personal Loan Calculator',
    description: 'Estimate personal loan EMI and repayment totals.',
    category: 'loan',
    inputs: [
      { id: 'principal', label: 'Personal Loan Amount', unit: 'INR', defaultValue: 300000, min: 50000, step: 10000 },
      { id: 'rate', label: 'Interest Rate', unit: '%', defaultValue: 12.5, min: 5, step: 0.1 },
      { id: 'years', label: 'Tenure (years)', defaultValue: 3, min: 1, step: 1 }
    ],
    faqs: baseFaqs,
    seo: {
      title: 'Personal Loan Calculator - RupeePlanner',
      description: 'Calculate EMIs for personal loans with interest breakdown.'
    },
    compute: (values) => buildLoanResult(values.principal, values.rate, values.years)
  },
  {
    slug: 'car-loan-calculator',
    title: 'Car Loan Calculator',
    description: 'Calculate car loan EMIs with quick repayment view.',
    category: 'loan',
    inputs: [
      { id: 'principal', label: 'Car Loan Amount', unit: 'INR', defaultValue: 800000, min: 100000, step: 10000 },
      { id: 'rate', label: 'Interest Rate', unit: '%', defaultValue: 9.5, min: 5, step: 0.1 },
      { id: 'years', label: 'Tenure (years)', defaultValue: 5, min: 1, step: 1 }
    ],
    faqs: baseFaqs,
    seo: {
      title: 'Car Loan Calculator - RupeePlanner',
      description: 'Estimate monthly EMI and interest for car loans.'
    },
    compute: (values) => buildLoanResult(values.principal, values.rate, values.years)
  },
  {
    slug: 'loan-eligibility-calculator',
    title: 'Loan Eligibility Calculator',
    description: 'Check how much loan you can qualify for based on income.',
    category: 'loan',
    inputs: [
      { id: 'income', label: 'Monthly Income', unit: 'INR', defaultValue: 80000, min: 20000, step: 1000 },
      { id: 'obligations', label: 'Monthly Obligations', unit: 'INR', defaultValue: 10000, min: 0, step: 500 },
      { id: 'rate', label: 'Interest Rate', unit: '%', defaultValue: 9, min: 5, step: 0.1 },
      { id: 'years', label: 'Tenure (years)', defaultValue: 10, min: 1, step: 1 }
    ],
    faqs: baseFaqs,
    seo: {
      title: 'Loan Eligibility Calculator - RupeePlanner',
      description: 'Estimate eligible loan amount using income and obligations.'
    },
    compute: (values) => {
      const monthlyRate = values.rate / 12 / 100;
      const months = values.years * 12;
      const maxEmi = Math.max(0, values.income * 0.5 - values.obligations);
      const eligible = monthlyRate === 0
        ? maxEmi * months
        : maxEmi * (Math.pow(1 + monthlyRate, months) - 1) / (monthlyRate * Math.pow(1 + monthlyRate, months));
      return {
        summary: [
          { label: 'Eligible Loan', value: formatINR(eligible) },
          { label: 'Max EMI', value: formatINR(maxEmi) },
          { label: 'Tenure', value: `${values.years} years` }
        ],
        breakdown: [
          { label: 'Monthly Income', value: formatINR(values.income) },
          { label: 'Obligations', value: formatINR(values.obligations) },
          { label: 'Interest Rate', value: formatPercent(values.rate) }
        ],
        chart: {
          type: 'bar',
          data: {
            labels: ['Max EMI', 'Eligible Loan'],
            datasets: [
              {
                data: [maxEmi, eligible],
                backgroundColor: ['#0F9D58', '#0B3C5D']
              }
            ]
          }
        }
      };
    }
  },
  {
    slug: 'sip-calculator',
    title: 'SIP Calculator',
    description: 'Estimate SIP growth with monthly contributions and returns.',
    category: 'investment',
    inputs: [
      { id: 'monthly', label: 'Monthly SIP', unit: 'INR', defaultValue: 5000, min: 500, step: 500 },
      { id: 'rate', label: 'Expected Return', unit: '%', defaultValue: 12, min: 4, step: 0.1 },
      { id: 'years', label: 'Duration (years)', defaultValue: 15, min: 1, step: 1 }
    ],
    faqs: [
      { question: 'How is SIP calculated?', answer: 'It assumes monthly compounding at the chosen return rate.' },
      ...baseFaqs
    ],
    seo: {
      title: 'SIP Calculator - RupeePlanner',
      description: 'Calculate SIP returns with growth chart and detailed schedule.'
    },
    compute: (values) => buildSipResult(values.monthly, values.rate, values.years)
  },
  {
    slug: 'lumpsum-investment-calculator',
    title: 'Lumpsum Investment Calculator',
    description: 'Plan the growth of a one-time investment over time.',
    category: 'investment',
    inputs: [
      { id: 'principal', label: 'Lumpsum Amount', unit: 'INR', defaultValue: 200000, min: 10000, step: 5000 },
      { id: 'rate', label: 'Expected Return', unit: '%', defaultValue: 10, min: 4, step: 0.1 },
      { id: 'years', label: 'Duration (years)', defaultValue: 10, min: 1, step: 1 }
    ],
    faqs: baseFaqs,
    seo: {
      title: 'Lumpsum Calculator - RupeePlanner',
      description: 'Estimate lump sum investment growth with compounding.'
    },
    compute: (values) => buildLumpsumResult(values.principal, values.rate, values.years)
  },
  {
    slug: 'mutual-fund-calculator',
    title: 'Mutual Fund Calculator',
    description: 'Project mutual fund returns with monthly investments.',
    category: 'investment',
    inputs: [
      { id: 'monthly', label: 'Monthly Investment', unit: 'INR', defaultValue: 8000, min: 1000, step: 500 },
      { id: 'rate', label: 'Expected Return', unit: '%', defaultValue: 11, min: 4, step: 0.1 },
      { id: 'years', label: 'Duration (years)', defaultValue: 12, min: 1, step: 1 }
    ],
    faqs: baseFaqs,
    seo: {
      title: 'Mutual Fund Calculator - RupeePlanner',
      description: 'Estimate mutual fund SIP value and growth chart.'
    },
    compute: (values) => buildSipResult(values.monthly, values.rate, values.years)
  },
  {
    slug: 'cagr-calculator',
    title: 'CAGR Calculator',
    description: 'Compute CAGR for any investment or asset.',
    category: 'investment',
    inputs: [
      { id: 'initial', label: 'Initial Value', unit: 'INR', defaultValue: 100000, min: 1000, step: 1000 },
      { id: 'final', label: 'Final Value', unit: 'INR', defaultValue: 180000, min: 1000, step: 1000 },
      { id: 'years', label: 'Duration (years)', defaultValue: 5, min: 1, step: 1 }
    ],
    faqs: baseFaqs,
    seo: {
      title: 'CAGR Calculator - RupeePlanner',
      description: 'Calculate CAGR and compare investment growth.'
    },
    compute: (values) => buildCagrResult(values.initial, values.final, values.years)
  },
  {
    slug: 'compound-interest-calculator',
    title: 'Compound Interest Calculator',
    description: 'Estimate growth with compounding frequency options.',
    category: 'investment',
    inputs: [
      { id: 'principal', label: 'Principal', unit: 'INR', defaultValue: 250000, min: 1000, step: 1000 },
      { id: 'rate', label: 'Annual Rate', unit: '%', defaultValue: 7.5, min: 1, step: 0.1 },
      { id: 'years', label: 'Duration (years)', defaultValue: 8, min: 1, step: 1 },
      {
        id: 'comp',
        label: 'Compounding',
        type: 'select',
        defaultValue: 12,
        options: [
          { label: 'Monthly', value: 12 },
          { label: 'Quarterly', value: 4 },
          { label: 'Yearly', value: 1 }
        ]
      }
    ],
    faqs: baseFaqs,
    seo: {
      title: 'Compound Interest Calculator - RupeePlanner',
      description: 'Calculate compounding returns with flexible frequency.'
    },
    compute: (values) => buildCompoundResult(values.principal, values.rate, values.years, values.comp)
  },
  {
    slug: 'income-tax-calculator',
    title: 'Income Tax Calculator',
    description: 'Estimate tax under old and new regime slabs.',
    category: 'tax',
    inputs: [
      { id: 'income', label: 'Annual Income', unit: 'INR', defaultValue: 1200000, min: 100000, step: 10000 },
      { id: 'deductions', label: 'Deductions', unit: 'INR', defaultValue: 150000, min: 0, step: 5000 },
      {
        id: 'regime',
        label: 'Regime',
        type: 'select',
        defaultValue: 1,
        options: [
          { label: 'New Regime', value: 1 },
          { label: 'Old Regime', value: 0 }
        ]
      }
    ],
    faqs: [
      { question: 'Which regime is better?', answer: 'It depends on your deductions and exemptions. Compare both.' },
      ...baseFaqs
    ],
    seo: {
      title: 'Income Tax Calculator - RupeePlanner',
      description: 'Compare old vs new regime tax with deductions.'
    },
    compute: (values) => buildIncomeTaxResult(values.income, values.deductions, values.regime)
  },
  {
    slug: 'hra-calculator',
    title: 'HRA Calculator',
    description: 'Compute HRA exemption based on salary and rent.',
    category: 'tax',
    inputs: [
      { id: 'basic', label: 'Basic Salary (monthly)', unit: 'INR', defaultValue: 50000, min: 10000, step: 1000 },
      { id: 'hra', label: 'HRA Received (monthly)', unit: 'INR', defaultValue: 20000, min: 0, step: 1000 },
      { id: 'rent', label: 'Rent Paid (monthly)', unit: 'INR', defaultValue: 18000, min: 0, step: 1000 },
      {
        id: 'metro',
        label: 'City Type',
        type: 'select',
        defaultValue: 1,
        options: [
          { label: 'Metro', value: 1 },
          { label: 'Non-metro', value: 0 }
        ]
      }
    ],
    faqs: baseFaqs,
    seo: {
      title: 'HRA Calculator - RupeePlanner',
      description: 'Calculate HRA exemption and taxable HRA amount.'
    },
    compute: (values) => buildHraResult(values.basic, values.hra, values.rent, values.metro)
  },
  {
    slug: 'salary-breakup-calculator',
    title: 'Salary Breakup Calculator',
    description: 'Break down CTC into basic, HRA, and allowances.',
    category: 'tax',
    inputs: [
      { id: 'ctc', label: 'Annual CTC', unit: 'INR', defaultValue: 1200000, min: 100000, step: 10000 },
      { id: 'basicPercent', label: 'Basic % of CTC', unit: '%', defaultValue: 40, min: 20, step: 1 }
    ],
    faqs: baseFaqs,
    seo: {
      title: 'Salary Breakup Calculator - RupeePlanner',
      description: 'Estimate salary structure from your CTC.'
    },
    compute: (values) => buildSalaryBreakup(values.ctc, values.basicPercent)
  },
  {
    slug: 'capital-gains-calculator',
    title: 'Capital Gains Calculator',
    description: 'Estimate capital gains tax for equity or property.',
    category: 'tax',
    inputs: [
      { id: 'buy', label: 'Purchase Price', unit: 'INR', defaultValue: 500000, min: 10000, step: 10000 },
      { id: 'sell', label: 'Sale Price', unit: 'INR', defaultValue: 750000, min: 10000, step: 10000 },
      { id: 'holding', label: 'Holding Period (years)', defaultValue: 2, min: 0.5, step: 0.5 },
      { id: 'shortRate', label: 'Short-term Rate', unit: '%', defaultValue: 15, min: 0, step: 1 },
      { id: 'longRate', label: 'Long-term Rate', unit: '%', defaultValue: 10, min: 0, step: 1 },
      { id: 'threshold', label: 'Long-term Threshold (years)', defaultValue: 1, min: 1, step: 0.5 }
    ],
    faqs: baseFaqs,
    seo: {
      title: 'Capital Gains Calculator - RupeePlanner',
      description: 'Estimate capital gains tax and payable amount.'
    },
    compute: (values) => buildCapitalGains(values.buy, values.sell, values.holding, values.shortRate, values.longRate, values.threshold)
  },
  {
    slug: 'fd-calculator',
    title: 'FD Calculator',
    description: 'Fixed deposit maturity and interest calculator.',
    category: 'savings',
    inputs: [
      { id: 'principal', label: 'Principal', unit: 'INR', defaultValue: 300000, min: 1000, step: 1000 },
      { id: 'rate', label: 'Interest Rate', unit: '%', defaultValue: 6.8, min: 1, step: 0.1 },
      { id: 'years', label: 'Duration (years)', defaultValue: 3, min: 1, step: 1 },
      {
        id: 'comp',
        label: 'Compounding',
        type: 'select',
        defaultValue: 4,
        options: [
          { label: 'Quarterly', value: 4 },
          { label: 'Monthly', value: 12 },
          { label: 'Yearly', value: 1 }
        ]
      }
    ],
    faqs: baseFaqs,
    seo: {
      title: 'FD Calculator - RupeePlanner',
      description: 'Calculate FD maturity and interest earnings.'
    },
    compute: (values) => buildCompoundResult(values.principal, values.rate, values.years, values.comp)
  },
  {
    slug: 'rd-calculator',
    title: 'RD Calculator',
    description: 'Recurring deposit maturity estimator.',
    category: 'savings',
    inputs: [
      { id: 'monthly', label: 'Monthly Deposit', unit: 'INR', defaultValue: 5000, min: 500, step: 500 },
      { id: 'rate', label: 'Interest Rate', unit: '%', defaultValue: 6.5, min: 1, step: 0.1 },
      { id: 'years', label: 'Duration (years)', defaultValue: 3, min: 1, step: 1 }
    ],
    faqs: baseFaqs,
    seo: {
      title: 'RD Calculator - RupeePlanner',
      description: 'Estimate RD maturity amount and interest earned.'
    },
    compute: (values) => buildRecurringDeposit(values.monthly, values.rate, values.years)
  },
  {
    slug: 'ppf-calculator',
    title: 'PPF Calculator',
    description: 'Estimate PPF maturity with yearly contributions.',
    category: 'savings',
    inputs: [
      { id: 'annual', label: 'Annual Contribution', unit: 'INR', defaultValue: 150000, min: 10000, step: 1000 },
      { id: 'rate', label: 'Interest Rate', unit: '%', defaultValue: 7.1, min: 1, step: 0.1 },
      { id: 'years', label: 'Duration (years)', defaultValue: 15, min: 5, step: 1 }
    ],
    faqs: baseFaqs,
    seo: {
      title: 'PPF Calculator - RupeePlanner',
      description: 'Calculate PPF maturity and total interest.'
    },
    compute: (values) => buildPpf(values.annual, values.rate, values.years)
  },
  {
    slug: 'nps-calculator',
    title: 'NPS Calculator',
    description: 'Estimate NPS corpus with monthly contributions.',
    category: 'savings',
    inputs: [
      { id: 'monthly', label: 'Monthly Contribution', unit: 'INR', defaultValue: 4000, min: 500, step: 500 },
      { id: 'rate', label: 'Expected Return', unit: '%', defaultValue: 9, min: 4, step: 0.1 },
      { id: 'years', label: 'Duration (years)', defaultValue: 20, min: 5, step: 1 }
    ],
    faqs: baseFaqs,
    seo: {
      title: 'NPS Calculator - RupeePlanner',
      description: 'Project NPS corpus and growth chart.'
    },
    compute: (values) => buildSipResult(values.monthly, values.rate, values.years)
  },
  {
    slug: 'retirement-corpus-calculator',
    title: 'Retirement Corpus Calculator',
    description: 'Estimate corpus needed and SIP required for retirement.',
    category: 'retirement',
    inputs: [
      { id: 'currentAge', label: 'Current Age', defaultValue: 30, min: 18, step: 1 },
      { id: 'retireAge', label: 'Retirement Age', defaultValue: 60, min: 40, step: 1 },
      { id: 'monthlyExpense', label: 'Monthly Expense', unit: 'INR', defaultValue: 40000, min: 10000, step: 1000 },
      { id: 'inflation', label: 'Inflation Rate', unit: '%', defaultValue: 6, min: 1, step: 0.1 },
      { id: 'returnRate', label: 'Expected Return', unit: '%', defaultValue: 10, min: 4, step: 0.1 }
    ],
    faqs: baseFaqs,
    seo: {
      title: 'Retirement Corpus Calculator - RupeePlanner',
      description: 'Plan retirement corpus and required monthly SIP.'
    },
    compute: (values) => buildRetirementCorpus(values.currentAge, values.retireAge, values.monthlyExpense, values.inflation, values.returnRate)
  },
  {
    slug: 'fire-calculator',
    title: 'FIRE Calculator',
    description: 'Find your FIRE target and years to financial independence.',
    category: 'retirement',
    inputs: [
      { id: 'annualExpense', label: 'Annual Expense', unit: 'INR', defaultValue: 600000, min: 100000, step: 10000 },
      { id: 'currentCorpus', label: 'Current Corpus', unit: 'INR', defaultValue: 500000, min: 0, step: 10000 },
      { id: 'monthlyInvest', label: 'Monthly Investment', unit: 'INR', defaultValue: 15000, min: 0, step: 1000 },
      { id: 'returnRate', label: 'Expected Return', unit: '%', defaultValue: 10, min: 4, step: 0.1 }
    ],
    faqs: baseFaqs,
    seo: {
      title: 'FIRE Calculator - RupeePlanner',
      description: 'Estimate FIRE number and time to reach it.'
    },
    compute: (values) => buildFire(values.annualExpense, values.currentCorpus, values.monthlyInvest, values.returnRate)
  },
  {
    slug: 'pension-calculator',
    title: 'Pension Calculator',
    description: 'Project monthly pension from your corpus.',
    category: 'retirement',
    inputs: [
      { id: 'corpus', label: 'Retirement Corpus', unit: 'INR', defaultValue: 10000000, min: 500000, step: 50000 },
      { id: 'annuityRate', label: 'Annuity Rate', unit: '%', defaultValue: 6, min: 1, step: 0.1 }
    ],
    faqs: baseFaqs,
    seo: {
      title: 'Pension Calculator - RupeePlanner',
      description: 'Calculate expected pension payout from corpus.'
    },
    compute: (values) => buildPension(values.corpus, values.annuityRate)
  },
  {
    slug: 'inflation-calculator',
    title: 'Inflation Calculator',
    description: 'See how inflation impacts future costs.',
    category: 'other',
    inputs: [
      { id: 'current', label: 'Current Cost', unit: 'INR', defaultValue: 50000, min: 1000, step: 1000 },
      { id: 'rate', label: 'Inflation Rate', unit: '%', defaultValue: 6, min: 1, step: 0.1 },
      { id: 'years', label: 'Duration (years)', defaultValue: 10, min: 1, step: 1 }
    ],
    faqs: baseFaqs,
    seo: {
      title: 'Inflation Calculator - RupeePlanner',
      description: 'Calculate future cost of expenses with inflation.'
    },
    compute: (values) => buildInflation(values.current, values.rate, values.years)
  },
  {
    slug: 'net-worth-calculator',
    title: 'Net Worth Calculator',
    description: 'Measure assets vs liabilities to track net worth.',
    category: 'other',
    inputs: [
      { id: 'assets', label: 'Total Assets', unit: 'INR', defaultValue: 1500000, min: 0, step: 10000 },
      { id: 'liabilities', label: 'Total Liabilities', unit: 'INR', defaultValue: 500000, min: 0, step: 10000 }
    ],
    faqs: baseFaqs,
    seo: {
      title: 'Net Worth Calculator - RupeePlanner',
      description: 'Track net worth and asset allocation.'
    },
    compute: (values) => buildNetWorth(values.assets, values.liabilities)
  },
  {
    slug: 'budget-planner',
    title: 'Budget Planner',
    description: 'Allocate income across expenses and savings.',
    category: 'other',
    inputs: [
      { id: 'income', label: 'Monthly Income', unit: 'INR', defaultValue: 90000, min: 10000, step: 1000 },
      { id: 'fixed', label: 'Fixed Expenses', unit: 'INR', defaultValue: 35000, min: 0, step: 500 },
      { id: 'variable', label: 'Variable Expenses', unit: 'INR', defaultValue: 20000, min: 0, step: 500 },
      { id: 'savings', label: 'Savings Goal', unit: 'INR', defaultValue: 20000, min: 0, step: 500 }
    ],
    faqs: baseFaqs,
    seo: {
      title: 'Budget Planner - RupeePlanner',
      description: 'Plan monthly budget and savings targets.'
    },
    compute: (values) => buildBudget(values.income, values.fixed, values.variable, values.savings)
  }
];

export const getCalculatorBySlug = (slug: string): CalculatorConfig | undefined => {
  return calculators.find((calc) => calc.slug === slug);
};

export const getCalculatorsByCategory = (category: string): CalculatorConfig[] => {
  return calculators.filter((calc) => calc.category === category);
};

export const calculatorSlugs = calculators.map((calc) => calc.slug);
