import { animate } from 'motion/mini';
import { inView, stagger } from 'motion';

const header = document.querySelector<HTMLElement>('[data-header]');
const menuButton = document.querySelector<HTMLButtonElement>('.menu-button');
const nav = document.querySelector<HTMLElement>('.site-nav');
const heroSection = document.querySelector<HTMLElement>('.hero');
const heroTitle = document.querySelector<HTMLElement>('.hero h1');

// Czech typography: keep one-letter prepositions and conjunctions with the following word.
const czechGlueWords = /(^|\s)([akiosuvz])\s+(?=\S)/gi;
const textWalker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
const textNodes: Text[] = [];
let currentTextNode: Node | null;
while ((currentTextNode = textWalker.nextNode())) textNodes.push(currentTextNode as Text);
textNodes.forEach((node) => {
  const parent = node.parentElement;
  if (parent && !['SCRIPT', 'STYLE', 'TEXTAREA', 'SELECT'].includes(parent.tagName)) {
    node.nodeValue = node.nodeValue?.replace(czechGlueWords, '$1$2\u00A0') ?? null;
  }
});

const updateHeader = () => {
  const titleTop = heroTitle ? heroTitle.getBoundingClientRect().top + window.scrollY : null;
  const trigger = titleTop !== null ? Math.max(32, titleTop - 96) : heroSection ? Math.max(32, heroSection.offsetHeight - 96) : 32;
  header?.classList.toggle('is-scrolled', window.scrollY > trigger);
};
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

menuButton?.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  nav?.classList.toggle('is-open', !isOpen);
  header?.classList.toggle('is-menu-open', !isOpen);
  document.body.classList.toggle('menu-is-open', !isOpen);
});

nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  menuButton?.setAttribute('aria-expanded', 'false');
  nav?.classList.remove('is-open');
  header?.classList.remove('is-menu-open');
  document.body.classList.remove('menu-is-open');
}));

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menuButton?.getAttribute('aria-expanded') === 'true') {
    menuButton.click();
    menuButton.focus();
  }
});

const easeOut = [0.23, 1, 0.32, 1] as const;
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const heroMedia = document.querySelector<HTMLElement>('.hero__media');
  const heroVeil = document.querySelector<HTMLElement>('.hero__veil');
  const heroScroll = document.querySelector<HTMLElement>('.hero__scroll');
  const heroElements = document.querySelectorAll<HTMLElement>('.hero__content > *');
  if (heroMedia) {
    animate(heroMedia, { opacity: [0, 1], transform: ['scale(1.08)', 'scale(1)'] }, { duration: 1.1, ease: easeOut });
  }
  if (heroVeil) {
    animate(heroVeil, { opacity: [0, 1] }, { delay: 0.16, duration: 0.8, ease: easeOut });
  }
  animate(heroElements, { opacity: [0, 1], transform: ['translateY(24px)', 'translateY(0px)'] }, { delay: stagger(0.08, { startDelay: 0.34 }), duration: 0.62, ease: easeOut });
  if (heroScroll) {
    animate(heroScroll, { opacity: [0, 1], transform: ['translateY(8px)', 'translateY(0px)'] }, { delay: 1.36, duration: 0.48, ease: easeOut });
  }
  if (header && window.scrollY <= 32) {
    animate(header, { opacity: [0, 1], transform: ['translateY(-10px)', 'translateY(0px)'] }, { delay: 0.55, duration: 0.58, ease: easeOut });
  }
  inView('.reveal', (element) => {
    const target = element as HTMLElement;
    animate(target, { opacity: [0, 1], transform: ['translateY(24px)', 'translateY(0px)'] }, { duration: 0.58, ease: easeOut, delay: Number.parseInt(getComputedStyle(target).getPropertyValue('--delay') || '0') / 1000 });
  }, { amount: 0.18 });
}

document.querySelectorAll<HTMLDetailsElement>('details').forEach((detail) => {
  const answer = detail.querySelector<HTMLElement>('p');
  const symbol = detail.querySelector<HTMLElement>('summary span');
  if (symbol) {
    symbol.textContent = detail.open ? '−' : '+';
  }

  detail.addEventListener('toggle', () => {
    if (symbol) {
      symbol.textContent = detail.open ? '−' : '+';
    }

    if (detail.open && answer && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      animate(answer, { opacity: [0, 1], transform: ['translateY(-8px)', 'translateY(0px)'] }, { duration: 0.24, ease: easeOut });
    }
  });
});

const form = document.querySelector<HTMLFormElement>('#poptavka');
form?.addEventListener('submit', (event) => {
  event.preventDefault();
  const status = form.querySelector<HTMLElement>('.form-status');
  if (!form.checkValidity()) {
    form.reportValidity();
    if (status) status.textContent = 'Prosím doplňte povinné údaje.';
    return;
  }

  const data = new FormData(form);
  const subject = `Nezávazná poptávka – ${data.get('provoz')}`;
  const body = [
    `Jméno: ${data.get('jmeno')}`,
    `Typ provozu: ${data.get('provoz')}`,
    `Telefon: ${data.get('telefon')}`,
    `E-mail: ${data.get('email')}`,
    '',
    `Poznámka: ${data.get('poznamka') || '—'}`,
  ].join('\n');

  if (status) status.textContent = 'Otevíráme váš e-mail s připravenou poptávkou…';
  window.location.href = `mailto:info@pradelnakrkonose.cz?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});
