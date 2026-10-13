// Content-only contract: every industry uses the same complete page structure.
export const industryTypes = ['Hotel / wellness', 'Penzion / apartmány', 'Horská chata / chalupa', 'Restaurace / gastro', 'Jiný provoz'] as const;
export const industryRevealStagger = 80;

interface SegmentItem {
  number: string;
  title: string;
  copy: string;
}

interface ProcessStep extends SegmentItem {
  image: string;
}

export interface SegmentPageConfig {
  meta: {
    title: string;
    description: string;
    ogDescription: string;
    ogImage: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    copy: string;
    image: string;
    imageAlt: string;
  };
  services: {
    title: string;
    copy: string;
    image: string;
    imageAlt: string;
    items: [SegmentItem, SegmentItem, SegmentItem, SegmentItem];
  };
  needs: {
    eyebrow: string;
    title: string;
    items: [SegmentItem, SegmentItem, SegmentItem];
  };
  season: {
    eyebrow: string;
    title: string;
    copy: string[];
    image: string;
    imageAlt: string;
  };
  process: {
    title: string;
    copy: string;
    steps: [ProcessStep, ProcessStep, ProcessStep, ProcessStep];
  };
  cta: { title: string; copy: string };
  faqs: Array<[string, string]>;
  faqIntro: string;
  formType: typeof industryTypes[number];
  formNotePlaceholder: string;
}

