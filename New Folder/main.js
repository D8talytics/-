/* ==========================================================================
   d8talytics — main.js
   Small page interactions that don't belong in the 3D scene or the GSAP
   animation file: nav background on scroll, mobile menu toggle, and the
   cursor glow that follows the pointer.
   ========================================================================== */

(function () {
  // ---- Nav background state on scroll ----
  const nav = document.getElementById('site-nav');
  const onScroll = () => {
    if (window.scrollY > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---- Mobile menu toggle ----
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      const isHidden = mobileMenu.classList.contains('hidden');
      mobileMenu.classList.toggle('hidden');
      mobileMenu.classList.toggle('flex', isHidden);
    });
    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        mobileMenu.classList.remove('flex');
      });
    });
  }

  // ---- Cursor glow (desktop / mouse only — hidden on touch via CSS) ----
  const glow = document.getElementById('cursor-glow');
  if (glow) {
    let mouseX = -9999, mouseY = -9999;
    let glowX = -9999, glowY = -9999;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function loop() {
      glowX += (mouseX - glowX) * 0.12;
      glowY += (mouseY - glowY) * 0.12;
      glow.style.transform = `translate(${glowX}px, ${glowY}px)`;
      requestAnimationFrame(loop);
    }
    loop();
  }
})();
