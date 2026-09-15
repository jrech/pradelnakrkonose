import { animate } from 'motion/mini';
import { inView, scroll, stagger } from 'motion';

const header = document.querySelector<HTMLElement>('[data-header]');
const menuButton = document.querySelector<HTMLButtonElement>('.menu-button');
const nav = document.querySelector<HTMLElement>('.site-nav');
const heroSection = document.querySelector<HTMLElement>('.hero');
const heroTitle = document.querySelector<HTMLElement>('.hero h1');
const pageTitle = document.querySelector<HTMLElement>('main h1');

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

if (header && heroTitle) {
  const headerObserver = new IntersectionObserver(([entry]) => {
    header.classList.toggle('is-scrolled', !entry.isIntersecting && entry.boundingClientRect.top < 80);
  }, { rootMargin: '-80px 0px 0px', threshold: 0 });
  headerObserver.observe(heroTitle);
} else if (header && !heroSection) {
  header.classList.add('is-scrolled');
}

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

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const easeOut = [0.23, 1, 0.32, 1] as const;
const easeInOut = [0.77, 0, 0.175, 1] as const;
if (!prefersReducedMotion) {
  const heroMedia = document.querySelector<HTMLElement>('.hero__media, .about-hero__image');
  const backgroundHeroMedia = document.querySelector<HTMLImageElement>('.hero__media');
  const heroVeil = document.querySelector<HTMLElement>('.hero__veil');
  const heroElements = document.querySelectorAll<HTMLElement>('.hero__content > *');
  const heroEyebrow = document.querySelector<HTMLElement>('.hero__content .eyebrow');
  const heroFollowingElements = Array.from(heroElements).filter((element) => element !== heroTitle && element !== heroEyebrow);
  const isHomepage = document.body.classList.contains('homepage');
  if (heroMedia) {
    const isBackgroundHero = heroMedia.matches('.hero__media');
    // Keep the above-the-fold background discoverable for LCP. The veil and
    // content still reveal in sequence, while editorial image heroes retain
    // their softer scale/opacity entrance.
    if (!isBackgroundHero) {
      animate(heroMedia, { opacity: [0, 1], transform: ['scale(1.08)', 'scale(1)'] }, { duration: 1.1, ease: easeOut });
    }
  }
  if (backgroundHeroMedia && heroSection) {
    const parallaxRange = window.matchMedia('(max-width: 820px)').matches ? 4 : 8;
    const updateParallax = (progress: number) => {
      const offset = (progress - 0.5) * parallaxRange;
      backgroundHeroMedia.style.transform = `translate3d(0, ${offset}%, 0) scale(1.08)`;
    };
    const updateFromViewport = () => {
      const rect = heroSection.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, (window.innerHeight - rect.top) / (window.innerHeight + rect.height)));
      updateParallax(progress);
    };
    updateFromViewport();
    scroll(updateFromViewport);
  }
  if (heroVeil && !document.body.classList.contains('homepage')) {
    animate(heroVeil, { opacity: [0, 1] }, { delay: 0.16, duration: 0.8, ease: easeOut });
  }
  if (isHomepage && heroSection && heroTitle && backgroundHeroMedia) {
    const mediaReveal = heroSection.querySelector<HTMLElement>('[data-hero-media-reveal]');
    const mediaScale = heroSection.querySelector<HTMLElement>('[data-hero-media-scale]');
    const heroLines = heroTitle.querySelectorAll<HTMLElement>('.hero__line');
    const heroLead = heroSection.querySelector<HTMLElement>('.hero__lead');
    const heroActions = heroSection.querySelector<HTMLElement>('.hero__actions');
    const mobileHero = window.matchMedia('(max-width: 560px)').matches;
    let entranceStarted = false;

    const showHeroImmediately = () => {
      document.documentElement.classList.remove('hero-motion');
      mediaReveal?.style.setProperty('clip-path', 'none');
      mediaScale?.style.setProperty('transform', 'none');
      heroElements.forEach((element) => element.style.setProperty('opacity', '1'));
      heroLines.forEach((line) => line.style.setProperty('transform', 'none'));
      if (header) {
        header.style.setProperty('opacity', '1');
        header.style.setProperty('transform', 'none');
      }
    };

    const runHomepageHeroEntrance = () => {
      if (entranceStarted) return;
      entranceStarted = true;

      if (!document.documentElement.classList.contains('hero-motion') || window.scrollY > 32) {
        showHeroImmediately();
        return;
      }

      const imageDuration = mobileHero ? 1.1 : 1.3;
      if (mediaReveal) {
        animate(mediaReveal, {
          clipPath: ['inset(100% 0 0 0)', 'inset(0% 0 0 0)'],
        }, { duration: imageDuration, ease: easeOut });
      }
      if (mediaScale) {
        animate(mediaScale, {
          transform: ['scale(1.04)', 'scale(1)'],
        }, { duration: imageDuration, ease: easeOut });
      }
      if (header) {
        animate(header, {
          opacity: [0, 1],
          transform: ['translateY(8px)', 'translateY(0px)'],
        }, { delay: imageDuration, duration: 0.5, ease: easeOut });
      }
      if (heroEyebrow) {
        animate(heroEyebrow, {
          opacity: [0, 1],
          transform: ['translateY(14px)', 'translateY(0px)'],
        }, { delay: 0.35, duration: 0.46, ease: easeOut });
      }
      animate(heroTitle, { opacity: [0, 1] }, { delay: 0.45, duration: 0.18, ease: easeOut });
      animate(heroLines, {
        transform: ['translateY(105%)', 'translateY(0%)'],
      }, { delay: stagger(0.07, { startDelay: 0.45 }), duration: 0.68, ease: easeOut });
      if (heroLead) {
        animate(heroLead, {
          opacity: [0, 1],
          transform: ['translateY(16px)', 'translateY(0px)'],
        }, { delay: 0.68, duration: 0.52, ease: easeOut });
      }
      if (heroActions) {
        animate(heroActions, {
          opacity: [0, 1],
          transform: ['translateY(14px)', 'translateY(0px)'],
        }, { delay: 0.86, duration: 0.5, ease: easeOut });
      }

      window.setTimeout(() => {
        document.documentElement.classList.remove('hero-motion');
        mediaReveal?.style.removeProperty('will-change');
        mediaScale?.style.removeProperty('will-change');
        heroLines.forEach((line) => line.style.removeProperty('will-change'));
      }, imageDuration * 1000 + 100);
    };

    const startAfterDecode = () => {
      if (typeof backgroundHeroMedia.decode === 'function') {
        backgroundHeroMedia.decode().then(runHomepageHeroEntrance, runHomepageHeroEntrance);
      } else {
        runHomepageHeroEntrance();
      }
    };

    if (backgroundHeroMedia.complete) {
      if (backgroundHeroMedia.naturalWidth > 0) startAfterDecode();
      else showHeroImmediately();
    } else {
      backgroundHeroMedia.addEventListener('load', startAfterDecode, { once: true });
      backgroundHeroMedia.addEventListener('error', showHeroImmediately, { once: true });
    }
  } else {
    if (heroEyebrow) {
      animate(heroEyebrow, { opacity: [0, 1], transform: ['translateY(16px)', 'translateY(0px)'] }, { delay: 0.34, duration: 0.48, ease: easeOut });
    }
    if (heroTitle) {
      animate(heroTitle, {
        opacity: [0, 1],
        clipPath: ['inset(0 0 100% 0)', 'inset(0 0 0% 0)'],
        transform: ['translateY(24px)', 'translateY(0px)'],
      }, { delay: 0.42, duration: 0.78, ease: easeOut });
    }
    animate(heroFollowingElements, { opacity: [0, 1], transform: ['translateY(18px)', 'translateY(0px)'] }, { delay: stagger(0.1, { startDelay: 0.68 }), duration: 0.56, ease: easeOut });
    if (header && window.scrollY <= 32) {
      animate(header, { opacity: [0, 1], transform: ['translateY(10px)', 'translateY(0px)'] }, { delay: 0.64, duration: 0.58, ease: easeOut });
    }
  }
  if (pageTitle && pageTitle !== heroTitle) {
    const pageIntro = pageTitle.closest<HTMLElement>('[data-page-intro]');
    const pageEyebrow = pageIntro?.querySelector<HTMLElement>(':scope > .eyebrow');
    const pageFollowingElements = pageIntro
      ? pageIntro.querySelectorAll<HTMLElement>(':scope > .lead, :scope > .button')
      : [];

    if (pageEyebrow) {
      animate(pageEyebrow, {
        opacity: [0, 1],
        transform: ['translateY(16px)', 'translateY(0px)'],
      }, { delay: 0.34, duration: 0.48, ease: easeOut });
    }
    animate(pageTitle, {
      opacity: [0, 1],
      clipPath: ['inset(0 0 100% 0)', 'inset(0 0 0% 0)'],
      transform: ['translateY(24px)', 'translateY(0px)'],
    }, { delay: 0.42, duration: 0.78, ease: easeOut });
    animate(pageFollowingElements, {
      opacity: [0, 1],
      transform: ['translateY(18px)', 'translateY(0px)'],
    }, { delay: stagger(0.1, { startDelay: 0.68 }), duration: 0.56, ease: easeOut });
  }
  // Photos use a slower editorial mask: the visible area grows from the
  // bottom upward while the image settles from a restrained scale. This keeps
  // photography distinct from the quicker text reveal without introducing a
  // competing direction of movement.
  inView('.reveal--media', (element) => {
    const target = element as HTMLElement;
    if (target.dataset.revealed === 'true') return;
    target.dataset.revealed = 'true';

    const delay = Number.parseInt(getComputedStyle(target).getPropertyValue('--delay') || '0') / 1000;
    animate(target, {
      opacity: [0, 1],
      clipPath: ['inset(0 0 100% 0)', 'inset(0 0 0% 0)'],
      transform: ['translateY(24px)', 'translateY(0px)'],
    }, { duration: 0.82, ease: easeInOut, delay });

    const images = target.querySelectorAll<HTMLElement>(':scope > img');
    if (images.length) {
      animate(images, { transform: ['scale(1.045)', 'scale(1)'] }, { duration: 0.92, ease: easeOut, delay });
    }
  }, { amount: 0.18 });

  inView('.reveal:not(.reveal--media)', (element) => {
    const target = element as HTMLElement;
    if (target.dataset.revealed === 'true') return;
    target.dataset.revealed = 'true';
    const delay = Number.parseInt(getComputedStyle(target).getPropertyValue('--delay') || '0') / 1000;

    const distance = getComputedStyle(target).getPropertyValue('--reveal-distance').trim() || '24px';
    animate(target, { opacity: [0, 1], transform: [`translateY(${distance})`, 'translateY(0px)'] }, { duration: 0.58, ease: easeOut, delay });
  }, { amount: 0.18 });

  // Every content H2 now follows the landing-page mask reveal. Keeping this
  // separate from container reveals makes the motion consistent across page templates.
  inView('main h2', (element) => {
    const heading = element as HTMLElement;
    const revealParent = heading.closest<HTMLElement>('.reveal');
    const parentDelay = revealParent
      ? Number.parseInt(getComputedStyle(revealParent).getPropertyValue('--delay') || '0') / 1000
      : 0;

    animate(heading, {
      opacity: [0, 1],
      clipPath: ['inset(0 0 100% 0)', 'inset(0 0 0% 0)'],
      transform: ['translateY(18px)', 'translateY(0px)'],
    }, { delay: parentDelay + 0.06, duration: 0.7, ease: easeOut });
  }, { amount: 0.35 });

  // The statistics are read once as a trust signal. Their count-up reinforces
  // hierarchy without delaying access to the final values for assistive tech.
  inView('[data-count-up]', (element) => {
    const counter = element as HTMLElement;
    if (counter.dataset.counted === 'true') return;

    const target = Number(counter.dataset.countTarget ?? '0');
    const suffix = counter.dataset.countSuffix ?? '';
    const delay = Number(counter.dataset.countDelay ?? '0') / 1000;
    counter.dataset.counted = 'true';
    counter.textContent = `0${suffix}`;

    const duration = 1400;
    const startCounting = () => {
      const startedAt = performance.now();

      const updateCount = (now: number) => {
        const progress = Math.min((now - startedAt) / duration, 1);
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        counter.textContent = `${Math.round(target * easedProgress)}${suffix}`;

        if (progress < 1) requestAnimationFrame(updateCount);
      };

      requestAnimationFrame(updateCount);
    };

    window.setTimeout(startCounting, delay * 1000);
  }, { amount: 0.35 });
}

const trustScene = document.querySelector<HTMLElement>('[data-trust-scene]');
const trustBackground = document.querySelector<HTMLElement>('[data-trust-background]');
const trustMotion = window.matchMedia('(min-width: 821px) and (prefers-reduced-motion: no-preference)');
if (trustScene && trustBackground) {
  let stopTrustScroll: (() => void) | undefined;
  const configureTrustMotion = () => {
    stopTrustScroll?.();
    trustBackground.style.removeProperty('transform');
    if (!trustMotion.matches) return;
    stopTrustScroll = scroll((progress: number) => {
      trustBackground.style.transform = `translate3d(0, ${(progress - .5) * 60}px, 0)`;
    }, { target: trustScene, offset: ['start end', 'end start'] });
  };
  trustMotion.addEventListener('change', configureTrustMotion);
  configureTrustMotion();
}

const processStory = document.querySelector<HTMLElement>('[data-process-story]');
const processSteps = Array.from(document.querySelectorAll<HTMLElement>('[data-process-step]'));
const processMarkers = Array.from(document.querySelectorAll<HTMLElement>('[data-process-marker]'));
const processImages = Array.from(document.querySelectorAll<HTMLElement>('[data-process-image]'));
const processProgress = document.querySelector<HTMLElement>('[data-process-progress]');
const processLine = processProgress?.parentElement ?? null;
const processStepsPanel = processLine?.parentElement ?? null;
const processDesktop = window.matchMedia('(min-width: 1181px) and (min-height: 800px)');
const processTrack = document.querySelector<HTMLElement>('.process__track');
const processStage = document.querySelector<HTMLElement>('.process__stage');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

const syncProcessLineBounds = () => {
  if (!processLine || !processStepsPanel || processMarkers.length < 2) return;

  const panelRect = processStepsPanel.getBoundingClientRect();
  const firstRect = processMarkers[0].getBoundingClientRect();
  const lastRect = processMarkers[processMarkers.length - 1].getBoundingClientRect();
  const firstCenter = firstRect.top - panelRect.top + firstRect.height / 2;
  const lastCenter = lastRect.top - panelRect.top + lastRect.height / 2;

  processLine.style.top = `${firstCenter}px`;
  processLine.style.bottom = `${Math.max(0, panelRect.height - lastCenter)}px`;
};

if (processLine && processStepsPanel && processMarkers.length) {
  syncProcessLineBounds();
  new ResizeObserver(syncProcessLineBounds).observe(processStepsPanel);
}

// One subscription handles desktop, responsive changes, and reduced motion.
// Native sticky positioning owns the layout; scrolling is never intercepted.
if (processStory && processSteps.length && processImages.length && processProgress) {
  let activeStep = -1;
  let stopProcessScroll: (() => void) | undefined;
  const setActiveStep = (nextStep: number, changeImage: boolean) => {
    if (nextStep !== activeStep) {
      activeStep = nextStep;
      processSteps.forEach((step, index) => {
        step.classList.toggle('is-active', index === nextStep);
        step.classList.toggle('is-past', index < nextStep);
        if (index === nextStep) step.setAttribute('aria-current', 'step');
        else step.removeAttribute('aria-current');
      });
    }
    processImages.forEach((image, index) => {
      const selected = index === (changeImage ? nextStep : 0);
      if (image.classList.contains('is-active') !== selected) image.classList.toggle('is-active', selected);
    });
  };
  const updateProcessStory = () => {
    if (reducedMotion.matches) {
      processProgress.style.transform = 'scaleY(1)';
      setActiveStep(0, false);
      return;
    }
    const centers = processMarkers.map(marker => {
      const rect = marker.getBoundingClientRect();
      return rect.top + rect.height / 2;
    });
    const first = centers[0];
    const distance = Math.max(1, centers[centers.length - 1] - first);
    const sticky = processDesktop.matches && processTrack && processStage;
    let progress: number;
    if (sticky) {
      const top = Number.parseFloat(getComputedStyle(processStage).top);
      const travel = Math.max(1, processTrack.offsetHeight - processStage.offsetHeight);
      // Hold the final state for the last 15% before the composition releases.
      progress = (top - processTrack.getBoundingClientRect().top) / (travel * .85);
    } else {
      progress = (window.innerHeight * .58 - first) / distance;
    }
    progress = Math.max(0, Math.min(1, progress));
    processProgress.style.transform = `scaleY(${progress})`;
    let nextStep = 0;
    centers.forEach((center, index) => {
      if (progress >= (center - first) / distance) nextStep = index;
    });
    setActiveStep(nextStep, Boolean(sticky));
  };
  const configureProcessStory = () => {
    stopProcessScroll?.();
    syncProcessLineBounds();
    activeStep = -1;
    updateProcessStory();
    if (!reducedMotion.matches) stopProcessScroll = scroll(updateProcessStory);
  };
  processDesktop.addEventListener('change', configureProcessStory);
  reducedMotion.addEventListener('change', configureProcessStory);
  configureProcessStory();
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
      const isHomepageFaq = Boolean(detail.closest('.homepage #faq'));
      animate(answer, { opacity: [0, 1], transform: [`translateY(${isHomepageFaq ? 4 : 8}px)`, 'translateY(0px)'] }, { duration: isHomepageFaq ? 0.32 : 0.24, ease: easeOut });
    }
  });
});

const form = document.querySelector<HTMLFormElement>('#poptavka');
const formType = form?.querySelector<HTMLSelectElement>('select[name="provoz"]');
if (formType) {
  const preselectedType = new URLSearchParams(window.location.search).get('provoz')?.toLowerCase();
  const typeMap: Record<string, string> = {
    hotel: 'Hotel / wellness',
    wellness: 'Hotel / wellness',
    penzion: 'Penzion / apartmány',
    apartman: 'Penzion / apartmány',
    apartmany: 'Penzion / apartmány',
    chata: 'Horská chata / chalupa',
    chalupa: 'Horská chata / chalupa',
    gastro: 'Restaurace / gastro',
    restaurace: 'Restaurace / gastro',
  };
  const mappedType = preselectedType ? typeMap[preselectedType] : undefined;
  if (mappedType) formType.value = mappedType;
}
form?.addEventListener('submit', (event) => {
  event.preventDefault();
  const status = form.querySelector<HTMLElement>('.form-status');
  if (!form.checkValidity()) {
    form.reportValidity();
    if (status) status.textContent = 'Prosím doplňte povinné údaje.';
    return;
  }

  const data = new FormData(form);
  const subject = `Nezávazná poptávka: ${data.get('provoz')}`;
  const body = [
    `Jméno: ${data.get('jmeno')}`,
    ...(data.get('firma') ? [`Název provozu: ${data.get('firma')}`] : []),
    `Typ provozu: ${data.get('provoz')}`,
    `Telefon: ${data.get('telefon')}`,
    `E-mail: ${data.get('email')}`,
    '',
    `Poznámka: ${data.get('poznamka') || 'Neuvedeno'}`,
  ].join('\n');

  if (status) status.textContent = 'Otevíráme váš e-mail s připravenou poptávkou…';
  window.location.href = `mailto:info@pradelnakrkonose.cz?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});
