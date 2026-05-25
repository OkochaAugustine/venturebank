import {
  HiOutlineHome,
  HiOutlineCreditCard,
  HiOutlineArrowsRightLeft,
  HiOutlineWallet,
  HiOutlineCog6Tooth,
  HiOutlineChatBubbleLeftRight,
  HiOutlineGlobeAlt,
  HiOutlineArrowDownTray,
  HiOutlineArrowsUpDown,
  HiOutlineBanknotes,
  HiOutlineDocumentText,
  HiOutlineGift,
  HiOutlineBuildingLibrary,
} from "react-icons/hi2";

export const dashboardNavSections = [
  {
    title: "Main",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: HiOutlineHome },
      { label: "Transactions", href: "/dashboard/transactions", icon: HiOutlineArrowsRightLeft },
      { label: "Cards", href: "/dashboard/cards", icon: HiOutlineCreditCard },
    ],
  },
  {
    title: "Transfers",
    items: [
      { label: "Local Transfer", href: "/dashboard/transfer", icon: HiOutlineArrowsRightLeft },
      { label: "International", href: "/dashboard/transfer/international", icon: HiOutlineGlobeAlt },
      { label: "Deposit", href: "/dashboard/deposit", icon: HiOutlineArrowDownTray },
      { label: "Currency Swap", href: "/dashboard/swap", icon: HiOutlineArrowsUpDown },
    ],
  },
  {
    title: "Services",
    items: [
      { label: "Loans", href: "/dashboard/loans", icon: HiOutlineBanknotes },
      { label: "Tax Refund", href: "/dashboard/tax-refund", icon: HiOutlineDocumentText },
      { label: "Grants", href: "/dashboard/grants", icon: HiOutlineGift },
    ],
  },
  {
    title: "Account",
    items: [
      { label: "Settings", href: "/dashboard/settings", icon: HiOutlineCog6Tooth },
      { label: "Support", href: "/dashboard/support", icon: HiOutlineChatBubbleLeftRight },
    ],
  },
];

/** Flat list for legacy imports */
export const dashboardNav = dashboardNavSections.flatMap((s) => s.items);

export const dashboardNavSecondary = [
  { label: "Accounts", href: "/dashboard/accounts", icon: HiOutlineWallet },
];

export const ACCOUNT_LIMIT = 500000;
