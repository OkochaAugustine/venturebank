import { images } from "@/lib/images";

const defaultCta = {
  title: "Ready to get started?",
  description:
    "Open your account online in minutes or speak with a member specialist today.",
};

function page(hero, sections, features, cta = defaultCta) {
  return { hero, sections, features, cta };
}

export const servicesContent = page(
  {
    title: "Our Services",
    subtitle: "VentureBank Member Services",
    description:
      "Comprehensive banking solutions tailored to your needs — from everyday accounts to wealth planning.",
    image: images.trustBanner,
  },
  [
    {
      title: "How Can We Help You Today?",
      body: "Whether you're saving for tomorrow, growing a business, or planning retirement, VentureBank delivers transparent products and personal support at every stage.",
    },
  ],
  [
    {
      title: "Deposit Accounts",
      description:
        "Secure your money with high-yield savings and checking accounts designed for growth.",
      href: "/personal",
      image: images.services.deposit,
    },
    {
      title: "Credit Cards",
      description:
        "Competitive rates and rewards programs matched to your lifestyle.",
      href: "/personal",
      image: images.services.credit,
    },
    {
      title: "Loans",
      description:
        "Personal, auto, and home loans with flexible terms and fast decisions.",
      href: "/personal",
      image: images.services.loans,
    },
    {
      title: "Business Banking",
      description:
        "Treasury, credit, and payment tools that scale with your company.",
      href: "/business",
      image: images.services.business,
    },
    {
      title: "Wealth & Retire",
      description:
        "Investment management and retirement strategies from fiduciary advisors.",
      href: "/investments",
      image: images.services.wealth,
    },
    {
      title: "Member Support",
      description:
        "24/7 phone banking, secure messaging, and branch specialists.",
      href: "/contact",
      image: images.services.about,
    },
  ]
);

export const personalContent = page(
  {
    title: "Personal Banking",
    subtitle: "Everyday & Premium Accounts",
    description:
      "Checking, savings, and lending designed around your life — competitive rates and member-first service.",
    image: images.personal,
  },
  [
    {
      title: "Banking that puts you first",
      body: "VentureBank Personal combines fee-transparent accounts, intuitive mobile tools, and local specialists who know your goals.",
    },
  ],
  [
    {
      title: "High-Yield Savings",
      description: "Earn more on emergency funds with tiered APY and no monthly maintenance fees.",
      href: "/register",
    },
    {
      title: "Premium Checking",
      description: "Free mobile deposit, bill pay, Zelle®, and worldwide ATM fee rebates.",
      href: "/register",
    },
    {
      title: "Personal Loans",
      description: "Fixed-rate loans for consolidation, home projects, and major purchases.",
      href: "/contact",
    },
    {
      title: "Credit Cards",
      description: "Cash back and travel rewards cards with fraud protection included.",
      href: "/register",
    },
  ]
);

export const businessContent = page(
  {
    title: "Business Banking",
    subtitle: "Grow With Confidence",
    description:
      "Treasury management, commercial credit, and merchant services for startups to enterprise.",
    image: images.business,
  },
  [
    {
      title: "Partners in your growth",
      body: "From first invoice to international expansion, VentureBank Business provides dedicated relationship managers and digital tools your team will actually use.",
    },
  ],
  [
    {
      title: "Business Checking",
      description: "Multi-user access, QuickBooks® integration, and positive pay fraud controls.",
      href: "/register",
    },
    {
      title: "Commercial Lending",
      description: "Lines of credit, SBA loans, and equipment financing with transparent terms.",
      href: "/contact",
    },
    {
      title: "Merchant Services",
      description: "In-person and online payments with next-day funding options.",
      href: "/contact",
    },
    {
      title: "Payroll & Treasury",
      description: "ACH origination, wire transfers, and cash concentration services.",
      href: "/contact",
    },
  ]
);

export const investmentsContent = page(
  {
    title: "Investments",
    subtitle: "Wealth Management",
    description:
      "Diversified portfolios, research, and advisory services for long-term wealth creation.",
    image: images.investments,
  },
  [
    {
      title: "Invest with clarity",
      body: "Our advisors align strategy to your timeline — balancing growth, income, and risk management with institutional-quality research.",
    },
  ],
  [
    {
      title: "Managed Portfolios",
      description: "Model portfolios rebalanced to your risk profile and tax considerations.",
      href: "/contact",
    },
    {
      title: "Self-Directed Trading",
      description: "Stocks, ETFs, and bonds with real-time quotes and advanced order types.",
      href: "/register",
    },
    {
      title: "Financial Planning",
      description: "Holistic plans covering education, estate, and tax-efficient investing.",
      href: "/contact",
    },
  ]
);

export const retirementContent = page(
  {
    title: "Retirement",
    subtitle: "Plan Your Future",
    description:
      "IRAs, rollovers, and income strategies backed by fiduciary guidance and planning tools.",
    image: images.retirement,
  },
  [
    {
      title: "Confidence in every chapter",
      body: "Whether you're starting a career or entering distribution phase, VentureBank Retirement helps you project income needs and optimize contributions.",
    },
  ],
  [
    {
      title: "Traditional & Roth IRAs",
      description: "Low-cost accounts with automatic investing and beneficiary designations.",
      href: "/register",
    },
    {
      title: "401(k) Rollovers",
      description: "Consolidate former employer plans with guided transfer support.",
      href: "/contact",
    },
    {
      title: "Retirement Income",
      description: "Annuities and bond ladders designed for reliable monthly cash flow.",
      href: "/contact",
    },
  ]
);

export const aboutContent = page(
  {
    title: "About VentureBank",
    subtitle: "Member-Focused Banking",
    description:
      "A full-service financial institution committed to member success, community impact, and transparent banking since 1969.",
    image: images.about,
  },
  [
    {
      title: "Building strength together",
      body: "VentureBank is member-owned, not shareholder-driven. We reinvest in better rates, digital innovation, and community programs that matter to the people we serve.",
    },
  ],
  [
    {
      title: "Competitive Rates",
      description: "Better yields on savings and lower borrowing costs for members.",
    },
    {
      title: "Member-Focused",
      description: "Your success defines ours — every product decision starts with you.",
    },
    {
      title: "Community Committed",
      description: "Local sponsorships, financial literacy, and small-business advocacy.",
    },
  ]
);

export const contactContent = {
  hero: {
    title: "Contact Us",
    subtitle: "Member Support",
    description:
      "Reach our team by phone, email, or visit a branch — we're here whenever you need us.",
    image: images.contact,
  },
};
