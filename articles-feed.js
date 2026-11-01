(function () {
  const grid = document.querySelector('.article-card-grid');
  if (!grid) return;

  const articleByLanguage = {
    en: 'from-personal-experience-to-purpose',
    id: 'dari-pengalaman-pribadi-ke-tujuan'
  };
  const escapeHtml = value => String(value || '').replace(/[&<>'"]/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  }[character]));
  const getLanguage = () => {
    const requested = new URLSearchParams(window.location.search).get('lang');
    if (requested === 'en' || requested === 'id') return requested;
    return document.documentElement.lang.toLowerCase().startsWith('id') ? 'id' : 'en';
  };

  let articles = [];
  const render = () => {
    const language = getLanguage();
    const slug = articleByLanguage[language];
    const article = articles.find(item => item.slug === slug);
    grid.replaceChildren();
    if (!article) return;

    const href = `/articles/${article.slug}`;
    const image = document.createElement('img');
    image.src = article.imageUrl || '/assets/dr-santi-reading.webp';
    image.alt = article.imageAlt || article.title || '';
    image.loading = 'lazy';

    const card = document.createElement('article');
    card.className = 'article-card';
    card.append(image);

    const details = document.createElement('div');
    const category = document.createElement('p');
    category.className = 'story-type';
    category.textContent = article.category || (language === 'id' ? 'Artikel' : 'Article');

    const title = document.createElement('h2');
    title.textContent = article.title || '';

    details.append(category, title);
    if (article.summary) {
      const summary = document.createElement('p');
      summary.textContent = article.summary;
      details.append(summary);
    }

    const link = document.createElement('a');
    link.href = href;
    link.append(document.createTextNode(language === 'id' ? 'Baca selengkapnya ' : 'Read more '));
    const arrow = document.createElement('span');
    arrow.textContent = '→';
    link.append(arrow);
    details.append(link);
    card.append(details);
    grid.append(card);
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
