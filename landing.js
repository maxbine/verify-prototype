/* ============================================================
   Sella Health — landing page
   Light interactivity: nav scroll state, reveal-on-scroll,
   demo modal, qualifying form submission.
   ============================================================ */

(() => {
  'use strict';

  /* ----------------------------------------------------------
     Form submission endpoint — swap this at deploy.
     Free options:
       - Formspree:  https://formspree.io/f/YOUR_FORM_ID
       - Basin:      https://usebasin.com/f/YOUR_FORM_ID
     Or wire to your own backend. While the placeholder is set,
     submissions fall back to a mailto: link to abe@sellahealth.com.
     ---------------------------------------------------------- */
  const FORM_ENDPOINT = ''; // e.g. 'https://formspree.io/f/xxxxxx'
  const FALLBACK_EMAIL = 'abe@sellahealth.com';

  /* ----------------------------------------------------------
     Nav scroll state — adds .is-scrolled past 8px scroll
     ---------------------------------------------------------- */
  const nav = document.getElementById('nav');
  const updateNavState = () => {
    if (!nav) return;
    nav.classList.toggle('is-scrolled', window.scrollY > 8);
  };
  updateNavState();
  window.addEventListener('scroll', updateNavState, { passive: true });

  /* ----------------------------------------------------------
     Copyright year
     ---------------------------------------------------------- */
  const yearEl = document.getElementById('copyYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ----------------------------------------------------------
     Scroll reveals — opacity + translateY, one-shot
     ---------------------------------------------------------- */
  const revealTargets = document.querySelectorAll(
    '.problem .container > *, ' +
    '.product .section-header, .product .cards-row, .product .system-error-note, ' +
    '.positioning .section-header, .positioning .comparison, ' +
    '.how .section-header, .how .steps, ' +
    '.field .section-header, .field .features, ' +
    '.mission__inner, ' +
    '.trust .section-header, .trust__body, ' +
    '.cta-final__inner'
  );
  revealTargets.forEach(el => el.classList.add('reveal'));

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -48px 0px' });
    revealTargets.forEach(el => io.observe(el));
  } else {
    revealTargets.forEach(el => el.classList.add('is-visible'));
  }

  /* ----------------------------------------------------------
     Demo modal
     ---------------------------------------------------------- */
  const modal = document.getElementById('demoModal');
  const formWrap = document.getElementById('demoFormWrap');
  const thanksWrap = document.getElementById('demoThanks');
  const form = document.getElementById('demoForm');
  const submitBtn = document.getElementById('demoSubmit');

  let lastFocus = null;

  const openModal = (event) => {
    if (event) event.preventDefault();
    if (!modal) return;
    lastFocus = document.activeElement;
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    // Focus the first input after the panel animates in
    setTimeout(() => {
      const firstField = modal.querySelector('input, select, textarea, button');
      if (firstField) firstField.focus();
    }, 60);
    document.addEventListener('keydown', escClose);
  };

  const closeModal = () => {
    if (!modal) return;
    modal.hidden = true;
    document.body.style.overflow = '';
    document.removeEventListener('keydown', escClose);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
    // Reset form view if closed after thanks
    if (formWrap && thanksWrap && !thanksWrap.hidden) {
      thanksWrap.hidden = true;
      formWrap.hidden = false;
      if (form) form.reset();
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Request a demo';
      }
    }
  };

  const escClose = (e) => { if (e.key === 'Escape') closeModal(); };

  document.querySelectorAll('[data-open-demo]').forEach(el => {
    el.addEventListener('click', openModal);
  });
  document.querySelectorAll('[data-close-demo]').forEach(el => {
    el.addEventListener('click', closeModal);
  });

  /* ----------------------------------------------------------
     Form submission — POSTs JSON to FORM_ENDPOINT, or mailto fallback
     ---------------------------------------------------------- */
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Native validation
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const data = {
        name:   form.elements['name'].value.trim(),
        email:  form.elements['email'].value.trim(),
        agency: form.elements['agency'].value.trim(),
        role:   form.elements['role'].value,
        page:   window.location.href,
        submitted_at: new Date().toISOString(),
      };

      // No endpoint configured — fall back to mailto:
      if (!FORM_ENDPOINT) {
        const subject = encodeURIComponent(`Demo request — ${data.agency}`);
        const body = encodeURIComponent(
          `Name: ${data.name}\n` +
          `Email: ${data.email}\n` +
          `Agency: ${data.agency}\n` +
          `Role: ${data.role}\n`
        );
        window.location.href = `mailto:${FALLBACK_EMAIL}?subject=${subject}&body=${body}`;
        showThanks();
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';

      try {
        const res = await fetch(FORM_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error('Submission failed');
        showThanks();
      } catch (err) {
        // Fall back to mailto on transport error
        const subject = encodeURIComponent(`Demo request — ${data.agency}`);
        const body = encodeURIComponent(
          `Name: ${data.name}\n` +
          `Email: ${data.email}\n` +
          `Agency: ${data.agency}\n` +
          `Role: ${data.role}\n`
        );
        window.location.href = `mailto:${FALLBACK_EMAIL}?subject=${subject}&body=${body}`;
        submitBtn.disabled = false;
        submitBtn.textContent = 'Request a demo';
      }
    });
  }

  function showThanks() {
    if (formWrap) formWrap.hidden = true;
    if (thanksWrap) thanksWrap.hidden = false;
  }
})();
