(function () {
  const grid = document.querySelector('.article-card-grid');
  if (!grid) return;
  const escapeHtml = value => String(value || '').replace(/[&<>'"]/g, character => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'}[character]));

  fetch('/api/articles')
    .then(response => response.ok ? response.json() : null)
    .then(payload => {
      const articles = payload?.articles || [];
      if (!articles.length) return;
      const existingLinks = new Set(Array.from(grid.querySelectorAll('a')).map(link => link.getAttribute('href')));
      articles.forEach(article => {
        const href = `/articles/${article.slug}`;
        if (!article.slug || existingLinks.has(href)) return;
        const image = `<img src="${escapeHtml(article.imageUrl || '/assets/dr-santi-reading.webp')}" alt="${escapeHtml(article.imageAlt || article.title)}" loading="lazy">`;
        grid.insertAdjacentHTML('afterbegin', `<article class="article-card">${image}<div><p class="story-type">${escapeHtml(article.category || 'Article')}</p><h2>${escapeHtml(article.title)}</h2>${article.summary ? `<p>${escapeHtml(article.summary)}</p>` : ''}<a href="${href}">Read more <span>→</span></a></div></article>`);
      });
    })
    .catch(() => {});
})();
