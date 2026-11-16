(() => {
  const projectId = 'zdz14n9xf7';
  const productionHosts = new Set(['drsantistory.com', 'www.drsantistory.com']);

  if (!productionHosts.has(window.location.hostname)
    || window.location.pathname.startsWith('/cms')
    || window.clarity
    || !projectId) return;

  (function (c, l, a, r, i, t, y) {
    c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
    t = l.createElement(r);
    t.async = true;
    t.src = `https://www.clarity.ms/tag/${i}`;
    y = l.getElementsByTagName(r)[0];
    y.parentNode.insertBefore(t, y);
  })(window, document, 'clarity', 'script', projectId);
})();
