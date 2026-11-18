(function () {
  const grid = document.querySelector('.article-card-grid, .home-perspective-grid');
  if (!grid) return;
  const isHomeGrid = grid.classList.contains('home-perspective-grid');

  const escapeHtml = value => String(value || '').replace(/[&<>'"]/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  }[character]));
  const getLanguage = () => {
    const requested = new URLSearchParams(window.location.search).get('lang');
    if (requested === 'en' || requested === 'id') return requested;
    return document.documentElement.lang.toLowerCase().startsWith('id') ? 'id' : 'en';
  };
  const getArticleLanguage = article => {
    if (article.language === 'en' || article.language === 'id') return article.language;
    return /^(dari-|kebiasaan-|cara-|meski-|sebelum-|fatherless-)/i.test(article.slug || '') ? 'id' : 'en';
  };

  let articles = [];
  const render = () => {
    const language = getLanguage();
    grid.replaceChildren();
    articles
      .filter(article => article.slug && getArticleLanguage(article) === language)
      .slice(0, isHomeGrid ? 3 : undefined)
      .forEach(article => {
        const image = document.createElement('img');
        image.src = article.imageUrl || '/assets/dr-santi-reading.webp';
        image.alt = article.imageAlt || article.title || '';
        image.loading = 'lazy';

        const card = document.createElement('article');
        card.className = isHomeGrid ? 'home-article-card' : 'article-card';
        card.append(image);

        const details = document.createElement('div');
        const category = document.createElement('p');
        category.className = 'story-type';
        category.textContent = article.category || (language === 'id' ? 'Artikel' : 'Article');

        const title = document.createElement(isHomeGrid ? 'h3' : 'h2');
        title.textContent = article.title || '';
        details.append(category, title);

        if (article.summary) {
          const summary = document.createElement('p');
          summary.textContent = article.summary;
          details.append(summary);
        }

        const link = document.createElement('a');
        link.href = '/articles/' + encodeURIComponent(article.slug);
        link.append(document.createTextNode(language === 'id' ? 'Baca selengkapnya ' : 'Read more '));
        const arrow = document.createElement('span');
        arrow.textContent = '→';
        link.append(arrow);
        details.append(link);
        card.append(details);
        grid.append(card);
      });
  };

  window.addEventListener('dr-santi-language-change', render);
  fetch('/api/articles')
    .then(response => response.ok ? response.json() : null)
    .then(payload => {
      articles = payload?.articles || [];
      render();
    })
    .catch(() => {});
})();
