/* ==========================================================================
   d8talytics — animations.js
   GSAP-powered motion: hero entrance, scroll-triggered section reveals,
   the pipeline connector line drawing in as you scroll, and a light tilt
   interaction on the "why synthetic data" cards.
   ========================================================================== */

(function () {
  if (typeof gsap === 'undefined') return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  gsap.registerPlugin(ScrollTrigger);

  // ---- Hero entrance ----
  if (!prefersReducedMotion) {
    gsap.timeline({ defaults: { ease: 'power3.out' } })
      .fromTo('#hero-badge', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6 })
      .fromTo('#hero-title', { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 0.8 }, '-=0.3')
      .fromTo('#hero-sub', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7 }, '-=0.5')
      .fromTo('#hero-cta', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7 }, '-=0.5');
  } else {
    gsap.set(['#hero-badge', '#hero-title', '#hero-sub', '#hero-cta'], { opacity: 1, y: 0 });
  }

  // ---- Section / card reveal on scroll ----
  document.querySelectorAll('.reveal').forEach((el, i) => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out',
      delay: prefersReducedMotion ? 0 : (i % 4) * 0.08,
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    });
  });

  // ---- Pipeline connector line draws in as the section enters view ----
  const pipelineLine = document.getElementById('pipeline-line');
  if (pipelineLine) {
    gsap.to(pipelineLine, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: '#platform',
        start: 'top 60%',
        end: 'bottom 60%',
        scrub: 0.6,
      },
    });
  }

  // ---- Tilt interaction on cards ----
  if (!prefersReducedMotion) {
    document.querySelectorAll('.tilt-card').forEach((card) => {
      const strength = 8; // degrees

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        gsap.to(card, {
          rotateX: -y * strength,
          rotateY: x * strength,
          duration: 0.4,
          ease: 'power2.out',
          transformPerspective: 600,
        });
      });

      card.addEventListener('mouseleave', () => {
        gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.6, ease: 'power3.out' });
      });
    });
  }
})();
