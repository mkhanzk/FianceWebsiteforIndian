export type FinanceRecord = {
  id: string;
  date: string;
  type: 'revenue' | 'expense';
  category: 'Loans' | 'Investments' | 'Tax' | 'Savings';
  department: 'Retail' | 'SME' | 'Enterprise';
  amount: number;
};

export type RequestRecord = {
  id: string;
  name: string;
  category: string;
  department: 'Retail' | 'SME' | 'Enterprise';
  status: 'Approved' | 'Pending' | 'Rejected';
  amount: number;
  date: string;
};

export const dashboardMonths = [
  { key: '2025-04', label: 'Apr 2025', revenue: 1250000, expenses: 780000, requests: 320, approved: 186, pending: 88, rejected: 46 },
  { key: '2025-05', label: 'May 2025', revenue: 1320000, expenses: 810000, requests: 348, approved: 202, pending: 92, rejected: 54 },
  { key: '2025-06', label: 'Jun 2025', revenue: 1450000, expenses: 860000, requests: 372, approved: 221, pending: 96, rejected: 55 },
  { key: '2025-07', label: 'Jul 2025', revenue: 1390000, expenses: 830000, requests: 361, approved: 208, pending: 98, rejected: 55 },
  { key: '2025-08', label: 'Aug 2025', revenue: 1520000, expenses: 900000, requests: 389, approved: 236, pending: 98, rejected: 55 },
  { key: '2025-09', label: 'Sep 2025', revenue: 1600000, expenses: 920000, requests: 401, approved: 245, pending: 103, rejected: 53 },
  { key: '2025-10', label: 'Oct 2025', revenue: 1680000, expenses: 965000, requests: 418, approved: 258, pending: 104, rejected: 56 },
  { key: '2025-11', label: 'Nov 2025', revenue: 1740000, expenses: 990000, requests: 432, approved: 269, pending: 107, rejected: 56 },
  { key: '2025-12', label: 'Dec 2025', revenue: 1820000, expenses: 1050000, requests: 447, approved: 279, pending: 112, rejected: 56 },
  { key: '2026-01', label: 'Jan 2026', revenue: 1880000, expenses: 1080000, requests: 462, approved: 286, pending: 120, rejected: 56 },
  { key: '2026-02', label: 'Feb 2026', revenue: 1940000, expenses: 1120000, requests: 476, approved: 298, pending: 122, rejected: 56 },
  { key: '2026-03', label: 'Mar 2026', revenue: 2010000, expenses: 1160000, requests: 492, approved: 312, pending: 124, rejected: 56 }
];

const categories = [
  { name: 'Loans', weight: 0.42 },
  { name: 'Investments', weight: 0.28 },
  { name: 'Tax', weight: 0.18 },
  { name: 'Savings', weight: 0.12 }
] as const;

const departments = ['Retail', 'SME', 'Enterprise'] as const;

export const financeRecords: FinanceRecord[] = dashboardMonths.flatMap((month, monthIndex) =>
  categories.flatMap((category, categoryIndex) => {
    const department = departments[(monthIndex + categoryIndex) % departments.length];
    const revenue = Math.round(month.revenue * category.weight);
    const expenses = Math.round(month.expenses * (category.weight + 0.01));
    return [
      {
        id: `REV-${month.key}-${category.name}`,
        date: `${month.key}-15`,
        type: 'revenue' as const,
        category: category.name,
        department,
        amount: revenue
      },
      {
        id: `EXP-${month.key}-${category.name}`,
        date: `${month.key}-20`,
        type: 'expense' as const,
        category: category.name,
        department,
        amount: expenses
      }
    ];
  })
);

export const requestRecords: RequestRecord[] = [
  { id: 'REQ-1092', name: 'Aarav Sharma', category: 'Home Loan', department: 'Retail', status: 'Approved', amount: 3500000, date: '2026-03-18' },
  { id: 'REQ-1091', name: 'Diya Nair', category: 'SIP Portfolio', department: 'Retail', status: 'Pending', amount: 1500000, date: '2026-03-16' },
  { id: 'REQ-1090', name: 'Kabir Mehta', category: 'Personal Loan', department: 'SME', status: 'Approved', amount: 900000, date: '2026-03-14' },
  { id: 'REQ-1089', name: 'Isha Gupta', category: 'Tax Planning', department: 'Enterprise', status: 'Rejected', amount: 0, date: '2026-03-12' },
  { id: 'REQ-1088', name: 'Vikram Singh', category: 'Retirement Plan', department: 'Retail', status: 'Approved', amount: 4200000, date: '2026-03-10' },
  { id: 'REQ-1087', name: 'Meera Rao', category: 'Car Loan', department: 'SME', status: 'Pending', amount: 800000, date: '2026-03-08' },
  { id: 'REQ-1086', name: 'Rohan Iyer', category: 'Mutual Funds', department: 'Enterprise', status: 'Approved', amount: 2200000, date: '2026-03-06' },
  { id: 'REQ-1085', name: 'Sara Ali', category: 'Insurance', department: 'Retail', status: 'Pending', amount: 0, date: '2026-03-04' },
  { id: 'REQ-1084', name: 'Nikhil Jain', category: 'Home Loan', department: 'SME', status: 'Approved', amount: 2800000, date: '2026-03-02' },
  { id: 'REQ-1083', name: 'Pooja Das', category: 'Tax Planning', department: 'Enterprise', status: 'Rejected', amount: 0, date: '2026-02-28' }
];

export const filterOptions = {
  categories: ['All', 'Loans', 'Investments', 'Tax', 'Savings'] as const,
  departments: ['All', 'Retail', 'SME', 'Enterprise'] as const,
  statuses: ['All', 'Approved', 'Pending', 'Rejected'] as const,
  ranges: [
    { value: '6m', label: 'Last 6 months' },
    { value: '12m', label: 'Last 12 months' },
    { value: 'ytd', label: 'Year to date' }
  ] as const
};

