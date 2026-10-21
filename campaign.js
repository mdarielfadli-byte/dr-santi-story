const campaignForm = document.querySelector('#campaign-inquiry-form');
const profileModal = document.querySelector('#profile-dialog');
const profileTrigger = document.querySelector('.profile-trigger');
const profileClose = document.querySelector('.profile-close');
const galleryModal = document.querySelector('#gallery-dialog');
const galleryItems = document.querySelectorAll('.event-gallery-item');
const galleryClose = document.querySelector('.gallery-close');
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

if (galleryModal && galleryClose && galleryItems.length) {
  const galleryImage = galleryModal.querySelector('.gallery-modal-image');
  const galleryCaption = galleryModal.querySelector('#gallery-caption');
  let activeGalleryItem = null;
  const closeGallery = () => {
    galleryModal.hidden = true;
    document.body.classList.remove('modal-open');
    activeGalleryItem?.focus();
  };
  galleryItems.forEach((item) => {
    item.addEventListener('click', () => {
      activeGalleryItem = item;
      galleryImage.src = item.dataset.gallerySrc;
      galleryImage.alt = item.dataset.galleryAlt;
      galleryCaption.textContent = item.dataset.galleryCaption;
      galleryModal.hidden = false;
      document.body.classList.add('modal-open');
      galleryClose.focus();
    });
  });
  galleryClose.addEventListener('click', closeGallery);
  galleryModal.addEventListener('click', (event) => { if (event.target === galleryModal) closeGallery(); });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && !galleryModal.hidden) closeGallery(); });
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
      if (typeof window.fbq === 'function') {
        window.fbq('track', 'Lead');
      }
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

