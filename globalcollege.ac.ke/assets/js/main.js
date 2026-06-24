// Page interaction scripts for the refactored homepage.
// - Smooth anchor scroll
// - Reveal animations as the user scrolls
// - Feedback for the wizard form

document.addEventListener('DOMContentLoaded', function () {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('[data-animate]').forEach((el) => observer.observe(el));

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const targetId = link.getAttribute('href');
      if (targetId && targetId.startsWith('#')) {
        const target = document.querySelector(targetId);
        if (target) {
          event.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  document.querySelectorAll('.btn').forEach((button) => {
    button.addEventListener('pointerdown', () => button.classList.add('active'));
    button.addEventListener('pointerup', () => button.classList.remove('active'));
    button.addEventListener('pointerleave', () => button.classList.remove('active'));
  });

  const form = document.getElementById('applicationForm');
  if (form) {
    const panels = Array.from(form.querySelectorAll('.wizard-panel'));
    const steps = Array.from(document.querySelectorAll('.wizard-steps .step'));
    let currentIndex = 0;

    const showPanel = (index) => {
      panels.forEach((panel, idx) => panel.classList.toggle('hidden', idx !== index));
      steps.forEach((step, idx) => step.classList.toggle('active', idx === index));
      currentIndex = index;
    };

    form.addEventListener('click', (event) => {
      const action = event.target.dataset.action;
      if (!action) return;
      event.preventDefault();
      if (action === 'next') {
        const inputs = panels[currentIndex].querySelectorAll('input,select');
        const valid = Array.from(inputs).every((input) => !input.required || input.value.trim() !== '');
        const status = panels[currentIndex].querySelector('.form-status');
        if (!valid) {
          if (status) status.textContent = 'Please complete all required fields before continuing.';
          return;
        }
        if (status) status.textContent = '';
        showPanel(Math.min(currentIndex + 1, panels.length - 1));
      }
      if (action === 'prev') {
        showPanel(Math.max(currentIndex - 1, 0));
      }
    });

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const requiredFields = form.querySelectorAll('[required]');
      const valid = Array.from(requiredFields).every((field) => field.value.trim() !== '');
      const status = form.querySelector('.form-status');
      if (!valid) {
        if (status) status.textContent = 'Please complete all fields before submitting.';
        return;
      }
      if (status) status.textContent = 'Submitting…';
      setTimeout(() => {
        if (status) status.textContent = 'Application submitted successfully — our team will contact you shortly.';
        form.reset();
        showPanel(0);
      }, 900);
    });

    showPanel(0);
  }
});
