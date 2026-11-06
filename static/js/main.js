const menuToggle = document.getElementById('menuToggle');
const menuWrapper = document.querySelector('.nav-links-wrapper');
const menu = document.querySelector('.nav-links');

function closeMenu({ restoreFocus = false } = {}) {
  if (!menuToggle || !menuWrapper) return;
  menuWrapper.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
  if (restoreFocus) setTimeout(() => menuToggle.focus(), 0);
}

if (menuToggle && menuWrapper && menu) {
  menuToggle.addEventListener('click', () => {
    const isOpen = menuWrapper.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    if (isOpen) menu.querySelector('a')?.focus();
  });

  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => closeMenu({ restoreFocus: true }));
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuWrapper.classList.contains('open')) {
      closeMenu({ restoreFocus: true });
    }
  });

  document.addEventListener('pointerdown', (event) => {
    if (!menuWrapper.classList.contains('open')) return;
    if (!event.target.closest('.site-header')) {
      event.preventDefault();
      closeMenu({ restoreFocus: true });
    }
  });
}

document.querySelectorAll('.method-card').forEach((button) => {
  button.addEventListener('click', () => {
    const isExpanded = button.getAttribute('aria-expanded') === 'true';
    document.querySelectorAll('.method-card').forEach((item) => {
      item.classList.remove('is-active');
      item.setAttribute('aria-expanded', 'false');
      const detail = document.getElementById(item.getAttribute('aria-controls'));
      if (detail) detail.hidden = true;
    });

    if (!isExpanded) {
      button.classList.add('is-active');
      button.setAttribute('aria-expanded', 'true');
      const detail = document.getElementById(button.getAttribute('aria-controls'));
      if (detail) detail.hidden = false;
    }
  });
});


const hero = document.querySelector('.hero');
const heroScene = document.querySelector('[data-hero-scene]');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(pointer: fine)').matches;

if (hero && heroScene && !reduceMotion && finePointer) {
  let frame = null;
  let pointerX = 0;
  let pointerY = 0;

  const renderHeroScene = () => {
    frame = null;
    const bounds = hero.getBoundingClientRect();
    const scrollProgress = Math.max(-1, Math.min(1, (bounds.top + bounds.height * 0.5 - window.innerHeight * 0.5) / (window.innerHeight * 0.75)));
    heroScene.style.setProperty('--scene-tilt-x', `${pointerY * -3}deg`);
    heroScene.style.setProperty('--scene-tilt-y', `${pointerX * 4}deg`);
    heroScene.style.setProperty('--scene-scroll', `${scrollProgress * -10}px`);
  };

  const scheduleHeroScene = () => {
    if (frame === null) frame = requestAnimationFrame(renderHeroScene);
  };

  hero.addEventListener('pointermove', (event) => {
    const bounds = hero.getBoundingClientRect();
    pointerX = (event.clientX - bounds.left) / bounds.width * 2 - 1;
    pointerY = (event.clientY - bounds.top) / bounds.height * 2 - 1;
    scheduleHeroScene();
  });

  hero.addEventListener('pointerleave', () => {
    pointerX = 0;
    pointerY = 0;
    scheduleHeroScene();
  });

  window.addEventListener('scroll', scheduleHeroScene, { passive: true });
  scheduleHeroScene();
}
