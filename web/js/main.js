/**
 * InmoSmart AI — Landing page interactions
 */

const header = document.getElementById('header');
const menuToggle = document.getElementById('menuToggle');
const mobileNav = document.getElementById('mobileNav');
const stickyCta = document.getElementById('stickyCta');

/* Header scroll state */
let lastScroll = 0;

function onScroll() {
  const y = window.scrollY;
  header.classList.toggle('is-scrolled', y > 20);
  stickyCta.classList.toggle('is-visible', y > 400);
  stickyCta.setAttribute('aria-hidden', y <= 400 ? 'true' : 'false');
  lastScroll = y;
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* Mobile menu */
function closeMobileNav() {
  menuToggle.classList.remove('is-open');
  menuToggle.setAttribute('aria-expanded', 'false');
  mobileNav.classList.remove('is-open');
  mobileNav.hidden = true;
  document.body.style.overflow = '';
}

function openMobileNav() {
  menuToggle.classList.add('is-open');
  menuToggle.setAttribute('aria-expanded', 'true');
  mobileNav.classList.remove('is-open');
  mobileNav.hidden = false;
  requestAnimationFrame(() => mobileNav.classList.add('is-open'));
  document.body.style.overflow = 'hidden';
}

menuToggle.addEventListener('click', () => {
  if (menuToggle.classList.contains('is-open')) {
    closeMobileNav();
  } else {
    openMobileNav();
  }
});

mobileNav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', closeMobileNav);
});

/* FAQ accordion */
document.querySelectorAll('.faq-item').forEach((item) => {
  const btn = item.querySelector('.faq-question');
  btn.addEventListener('click', () => {
    const isOpen = item.classList.contains('is-open');
    document.querySelectorAll('.faq-item.is-open').forEach((open) => {
      open.classList.remove('is-open');
      open.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
    });
    if (!isOpen) {
      item.classList.add('is-open');
      btn.setAttribute('aria-expanded', 'true');
    }
  });
});

/* Scroll reveal */
const revealEls = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );
  revealEls.forEach((el) => observer.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add('is-visible'));
}

/* Smooth anchor offset for fixed header */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    const id = anchor.getAttribute('href');
    if (id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) || 72;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* Checkout placeholders — replace with Hotmart/Gumroad URLs */
const CHECKOUT_URLS = {
  esencial: '#precios',
  completa: '#precios',
};

document.querySelectorAll('[data-checkout]').forEach((btn) => {
  btn.addEventListener('click', (e) => {
    const key = btn.dataset.checkout;
    const url = CHECKOUT_URLS[key];
    if (url && url !== '#precios') {
      e.preventDefault();
      window.location.href = url;
    }
  });
});

/* Hide mobile CTA when pricing section visible */
const pricingSection = document.getElementById('precios');
if (pricingSection && 'IntersectionObserver' in window) {
  const pricingObserver = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        stickyCta.classList.remove('is-visible');
      }
    },
    { threshold: 0.3 }
  );
  pricingObserver.observe(pricingSection);
}
