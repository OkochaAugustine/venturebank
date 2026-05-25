/**
 * Verified Unsplash image IDs — stable CDN URLs
 * https://images.unsplash.com/photo-{id}
 */
const u = (id, w = 1600) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=85`;

export const images = {
  hero: {
    src: u("1486406146926-c627a92ad1ab", 2400),
    alt: "International financial district skyline",
  },
  trustBanner: {
    src: u("1611974789855-1bae2da42b63", 2400),
    alt: "Financial charts and market data",
  },
  rates: {
    src: u("1551288049-bebda4e38f71", 1600),
    alt: "Analytics dashboard on screen",
  },
  promo: {
    src: u("1556761175-b413da4baf72", 1200),
    alt: "Business professionals in modern office",
  },
  promoCard: {
    src: u("1560472354-b33ff0c44a43", 800),
    alt: "Premium credit card and banking",
  },
  about: {
    src: u("1497366216548-37526070297c", 1400),
    alt: "Modern corporate office workspace",
  },
  contact: {
    src: u("1486325212027-8081e485255e", 1600),
    alt: "Contemporary bank building exterior",
  },
  personal: {
    src: u("1579621970563-ebec756aff7c", 1600),
    alt: "Personal savings and wealth planning",
  },
  business: {
    src: u("1454165804606-c3d57bc86b40", 1600),
    alt: "Business strategy and growth",
  },
  investments: {
    src: u("1611974789855-1bae2da42b63", 1600),
    alt: "Investment portfolio analytics",
  },
  retirement: {
    src: u("1573497019236-fadc960fdf0f", 1600),
    alt: "Planning for retirement lifestyle",
  },
  auth: {
    src: u("1563986768609-322da13575f3", 1920),
    alt: "Secure digital banking",
  },
  services: {
    deposit: u("1579621970563-ebec756aff7c", 800),
    credit: u("1563013544-824ae1b704d3", 800),
    loans: u("1450101499163-c8848c66ca85", 800),
    business: u("1454165804606-c3d57bc86b40", 800),
    wealth: u("1460925895917-afdab827c52f", 800),
    about: u("1521791136064-7986c2920216", 800),
  },
  testimonials: [
    { src: u("1494790108377-be9c29b29330", 200), alt: "Sarah Morris" },
    { src: u("1472099645785-5658abf4ff4e", 200), alt: "John Davis" },
    { src: u("1438761681033-6461ffad8d80", 200), alt: "Emily Johnson" },
  ],
};
