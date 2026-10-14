const campaignForm = document.querySelector('#campaign-inquiry-form');
const profileModal = document.querySelector('#profile-dialog');
const profileTrigger = document.querySelector('.profile-trigger');
const profileClose = document.querySelector('.profile-close');

if (profileModal && profileTrigger && profileClose) {
  const closeProfile = () => {
    profileModal.hidden = true;
    document.body.classList.remove('modal-open');
    profileTrigger.focus();
  };
  profileTrigger.addEventListener('click', () => {
    profileModal.hidden = false;
    document.body.classList.add('modal-open');
    profileClose.focus();
  });
  profileClose.addEventListener('click', closeProfile);
  profileModal.addEventListener('click', (event) => { if (event.target === profileModal) closeProfile(); });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && !profileModal.hidden) closeProfile(); });
}

const reveals = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  reveals.forEach((element) => observer.observe(element));
} else {
  reveals.forEach((element) => element.classList.add('is-visible'));
}

if (campaignForm) {
  campaignForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const response = campaignForm.querySelector('.form-response');
    if (!campaignForm.checkValidity()) {
      campaignForm.reportValidity();
      return;
    }

    const button = campaignForm.querySelector('button[type="submit"]');
    button.disabled = true;
    response.textContent = 'Mengirim permintaan Anda…';
    try {
      const payload = Object.fromEntries(new FormData(campaignForm).entries());
      payload.consent = campaignForm.elements.consent.checked;
      const result = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await result.json().catch(() => ({}));
      if (!result.ok) throw new Error(data.message || 'Permintaan belum dapat dikirim. Silakan coba lagi.');
      const thankYouPath = window.location.protocol === 'file:'
        ? 'campaign-thank-you.html'
        : '/parenting-reading/thanks';
      window.location.assign(thankYouPath);
    } catch (error) {
      response.textContent = error.message || 'Permintaan belum dapat dikirim. Silakan coba lagi.';
      button.disabled = false;
    }
  });
}
