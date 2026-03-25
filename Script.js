/* ─────────────────────────────────────────
   FXPILOT — script.js
───────────────────────────────────────── */

'use strict';

// ── NAVBAR: sticky scroll state ──────────────────────────
const navbar = document.getElementById('navbar');

function handleNavScroll() {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', handleNavScroll, { passive: true });
handleNavScroll();

// ── MOBILE NAV TOGGLE ─────────────────────────────────────
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.classList.toggle('open', isOpen);
  navToggle.setAttribute('aria-expanded', isOpen);
});

// Close nav on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// Close nav on outside click
document.addEventListener('click', (e) => {
  if (!navbar.contains(e.target)) {
    navLinks.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  }
});

// ── SCROLL REVEAL ─────────────────────────────────────────
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

revealEls.forEach(el => revealObserver.observe(el));

// ── FLOATING CTA (mobile) ─────────────────────────────────
const floatingCta = document.getElementById('floatingCta');
const heroSection = document.getElementById('hero');
const ctaSection  = document.getElementById('cta');

function handleFloatingCta() {
  if (window.innerWidth > 768) {
    floatingCta.classList.remove('visible');
    return;
  }

  const heroBottom = heroSection.getBoundingClientRect().bottom;
  const ctaTop     = ctaSection.getBoundingClientRect().top;

  if (heroBottom < 0 && ctaTop > window.innerHeight) {
    floatingCta.classList.add('visible');
  } else {
    floatingCta.classList.remove('visible');
  }
}

window.addEventListener('scroll', handleFloatingCta, { passive: true });
window.addEventListener('resize', handleFloatingCta, { passive: true });
handleFloatingCta();

// ── TICKER: random price drift ────────────────────────────
// Makes the ticker values drift slightly every few seconds
const tickerSpans = document.querySelectorAll('.ticker-track em');

const basePrices = {
  'EUR/USD': 1.0842, 'GBP/USD': 1.2671, 'USD/JPY': 149.32,
  'AUD/USD': 0.6523, 'USD/CAD': 1.3601, 'NZD/USD': 0.5988,
  'USD/CHF': 0.8941, 'EUR/GBP': 0.8558, 'XAU/USD': 2318.40,
  'USD/NGN': 1548.00
};

function randomDrift(base, pct = 0.0005) {
  const delta = base * pct * (Math.random() * 2 - 1);
  return +(base + delta).toFixed(base > 100 ? 2 : 4);
}

function updateTicker() {
  const rows = document.querySelectorAll('.ticker-track span');
  const pairNames = Object.keys(basePrices);

  rows.forEach((row, i) => {
    const pairName = pairNames[i % pairNames.length];
    const base = basePrices[pairName];
    const newPrice = randomDrift(base);
    const prev = parseFloat(row.querySelector('em').textContent.replace(/[▲▼\s]/g, ''));
    const up = newPrice >= prev;

    const em = row.querySelector('em');
    em.textContent = (up ? '▲ ' : '▼ ') + newPrice.toFixed(base > 100 ? 2 : 4);
    em.className = up ? 'up' : 'dn';
  });
}

setInterval(updateTicker, 3000);

// ── SMOOTH ANCHOR SCROLLING (fallback for older browsers) ──
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = navbar.offsetHeight + 16;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ── ACTIVE NAV LINK on scroll ──────────────────────────────
const sections = document.querySelectorAll('section[id], div[id="cta"]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navAnchors.forEach(a => {
          a.classList.toggle('active-nav', a.getAttribute('href') === '#' + id);
        });
      }
    });
  },
  { threshold: 0.35 }
);

sections.forEach(sec => sectionObserver.observe(sec));

// ── TERMINAL: animated typing effect ──────────────────────
const terminalRows = document.querySelectorAll('.t-row:not(.blink-row)');
let terminalStarted = false;

const terminalObserver = new IntersectionObserver(
  (entries) => {
    if (entries[0].isIntersecting && !terminalStarted) {
      terminalStarted = true;
      terminalRows.forEach((row, i) => {
        row.style.opacity = '0';
        setTimeout(() => {
          row.style.transition = 'opacity 0.3s ease';
          row.style.opacity = '1';
        }, i * 140 + 200);
      });
    }
  },
  { threshold: 0.3 }
);

const termCard = document.querySelector('.terminal-card');
if (termCard) terminalObserver.observe(termCard);

// ── BUTTON RIPPLE ──────────────────────────────────────────
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', function (e) {
    const rect = this.getBoundingClientRect();
    const ripple = document.createElement('span');
    const size = Math.max(rect.width, rect.height);
    ripple.style.cssText = `
      position:absolute;
      border-radius:50%;
      width:${size}px;
      height:${size}px;
      top:${e.clientY - rect.top - size / 2}px;
      left:${e.clientX - rect.left - size / 2}px;
      background:rgba(255,255,255,0.2);
      transform:scale(0);
      animation:rippleAnim 0.55s ease forwards;
      pointer-events:none;
    `;
    if (!this.style.position || this.style.position === 'static') {
      this.style.position = 'relative';
    }
    this.style.overflow = 'hidden';
    this.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  });
});

// Inject ripple keyframe
const rippleStyle = document.createElement('style');
rippleStyle.textContent = '@keyframes rippleAnim { to { transform: scale(2.5); opacity: 0; } }';
document.head.appendChild(rippleStyle);

// ── STEP CARDS: hover number highlight ────────────────────
document.querySelectorAll('.step').forEach(step => {
  step.addEventListener('mouseenter', () => {
    step.querySelector('.step-num').style.textShadow = '0 0 20px rgba(0,230,118,0.5)';
  });
  step.addEventListener('mouseleave', () => {
    step.querySelector('.step-num').style.textShadow = '';
  });
});
