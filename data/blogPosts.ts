export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  readTime: string;
  tags: string[];
  content: string[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: 'sip-strategy-for-salary-earners',
    title: 'SIP Strategy for Salary Earners in 2026',
    excerpt: 'Build a consistent SIP plan with step-ups, goal buckets, and risk checks.',
    date: '2026-03-12',
    category: 'Investing',
    readTime: '6 min read',
    tags: ['SIP', 'Mutual Funds', 'Discipline'],
    content: [
      'A salary-based SIP plan works best when you automate investments early in the month.',
      'Use step-up SIPs to match salary growth and revisit asset allocation annually.',
      'Split goals into buckets: emergency, short-term, medium-term, and retirement.',
      'Avoid stopping SIPs during volatility. Volatility is when SIPs help the most.'
    ]
  },
  {
    slug: 'income-tax-planning-checklist',
    title: 'Income Tax Planning Checklist: New vs Old Regime',
    excerpt: 'A simple checklist to compare deductions, exemptions, and slab impact.',
    date: '2026-03-10',
    category: 'Tax',
    readTime: '7 min read',
    tags: ['Tax', 'Deductions', 'Regime'],
    content: [
      'Compare taxable income after deductions with the new regime before switching.',
      'Track HRA, 80C, and NPS separately to avoid missing deductions.',
      'Use a tax calculator to test multiple scenarios before filing.'
    ]
  },
  {
    slug: 'how-to-improve-credit-score',
    title: 'How to Improve Your Credit Score in 90 Days',
    excerpt: 'Practical steps to boost your credit score quickly and safely.',
    date: '2026-03-08',
    category: 'Credit',
    readTime: '5 min read',
    tags: ['Credit Score', 'Loans'],
    content: [
      'Pay EMIs and credit card bills on time to protect your repayment history.',
      'Keep credit utilization below 30% and avoid multiple loan inquiries.',
      'Review your credit report for errors and raise disputes quickly.'
    ]
  },
  {
    slug: 'retirement-corpus-math',
    title: 'Retirement Corpus: The Math That Most People Miss',
    excerpt: 'Inflation and longevity can silently grow retirement needs.',
    date: '2026-03-06',
    category: 'Retirement',
    readTime: '6 min read',
    tags: ['Retirement', 'FIRE'],
    content: [
      'Project expenses forward with inflation, not current cost.',
      'Use a conservative real return assumption for corpus calculations.',
      'Build flexibility by combining equity, debt, and pension income.'
    ]
  },
  {
    slug: 'mutual-fund-portfolio-mistakes',
    title: 'Mutual Fund Portfolio Mistakes to Avoid',
    excerpt: 'Common errors that reduce returns and increase risk for investors.',
    date: '2026-03-04',
    category: 'Investing',
    readTime: '5 min read',
    tags: ['Mutual Funds', 'Portfolio'],
    content: [
      'Avoid overlapping funds with the same holdings and theme.',
      'Stick to your asset allocation instead of chasing last year\'s winners.',
      'Review funds annually and avoid excessive churn.'
    ]
  },
  {
    slug: 'home-loan-prepayment-guide',
    title: 'Home Loan Prepayment Guide',
    excerpt: 'Understand when and how prepayments can save the most interest.',
    date: '2026-03-02',
    category: 'Loans',
    readTime: '6 min read',
    tags: ['Home Loan', 'EMI'],
    content: [
      'Prepaying early in the loan term reduces interest the most.',
      'Check if your lender charges prepayment penalties.',
      'Use bonus income or tax refunds to make targeted prepayments.'
    ]
  }
];
