(function () {
  const archive = document.querySelector('#event-archive .event-archive-grid');
  if (!archive) return;

  const escapeHtml = value => String(value || '').replace(/[&<>"']/g, character => ({'&': '&amp;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[character]));
  const formatDate = value => value ? new Intl.DateTimeFormat(document.documentElement.lang === 'id' ? 'id-ID' : 'en-GB', {day: 'numeric', month: 'long', year: 'numeric'}).format(new Date(value)) : '';

  fetch('/api/events')
    .then(response => response.ok ? response.json() : null)
    .then(payload => {
      const events = payload?.events || [];
      events.forEach(event => {
        if (!event.slug || archive.querySelector(`[href="/events/${CSS.escape(event.slug)}"]`)) return;
        const meta = [formatDate(event.eventDate), event.location].filter(Boolean).join(' · ');
        const image = event.imageUrl ? `<img src="${escapeHtml(event.imageUrl)}" alt="${escapeHtml(event.imageAlt || event.title)}" loading="lazy">` : '';
        const label = event.status === 'Upcoming' ? 'Upcoming' : 'Documentation';
        archive.insertAdjacentHTML('afterbegin', `<article class="event-cms-card">${image}<div><p>${escapeHtml(meta || label)}</p><h3>${escapeHtml(event.title)}</h3>${event.summary ? `<p class="event-summary">${escapeHtml(event.summary)}</p>` : ''}<a class="text-link" href="/events/${encodeURIComponent(event.slug)}">Read more <span>→</span></a></div></article>`);
      });
    })
    .catch(() => {});
})();
