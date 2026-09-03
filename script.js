const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.site-nav');
if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.textContent = isOpen ? 'Close' : 'Menu';
  });
}

const bookNavItem = document.querySelector('.site-nav a[href="speaking-collaboration.html"]');
if (bookNavItem) {
  bookNavItem.href = 'books.html';
  bookNavItem.textContent = "Buku Santi's Story";
  bookNavItem.classList.toggle('active', location.pathname.endsWith('/books.html'));
}

const footer = document.querySelector('.site-footer');
if (footer) {
  footer.innerHTML = `
    <div class="footer-main section-shell">
      <div class="footer-brand">
        <a class="wordmark" href="index.html">Dr Santi's <span>Story</span></a>
        <p>Reading, leadership &amp; lifelong learning—untuk keluarga, pendidik, dan komunitas yang ingin terus bertumbuh.</p>
      </div>
      <nav class="footer-nav" aria-label="Explore Dr Santi's Story">
        <p class="footer-title">Explore</p>
        <a href="about.html">About Dr Santi</a>
        <a href="programs-services.html">Programs &amp; Services</a>
        <a href="books.html">Buku Santi's Story</a>
      </nav>
      <nav class="footer-nav" aria-label="Connect with Dr Santi's Story">
        <p class="footer-title">Connect</p>
        <a href="stories-resources.html">Stories &amp; Resources</a>
        <a href="articles.html">Articles</a>
        <a href="contact.html">Contact</a>
      </nav>
    </div>
    <div class="footer-meta section-shell">
      <p>© 2026 Dr Santi's Story. All rights reserved.</p>
      <a href="contact.html">Start a conversation <span aria-hidden="true">→</span></a>
    </div>`;
}

const sharedStyles = document.createElement('style');
sharedStyles.textContent = `
  .site-footer{display:block;padding:0;background:var(--forest);color:var(--cream)}
  .footer-main{display:grid;grid-template-columns:1.45fr 1fr 1fr;gap:48px;padding:62px 0 52px}
  .footer-brand{max-width:365px}.site-footer .wordmark{color:var(--cream);font-size:28px}.site-footer .wordmark span{color:var(--gold)}
  .footer-brand p{margin:22px 0 0;color:#c9dbce;font-size:14px;line-height:1.6}.footer-nav{display:flex;flex-direction:column;align-items:flex-start;gap:9px}
  .footer-title{margin:0 0 6px!important;color:var(--gold);font-size:11px!important;font-weight:700;letter-spacing:.1em;text-transform:uppercase}.footer-nav a{font-size:14px;text-decoration:none}.footer-nav a:hover,.footer-meta a:hover{color:var(--gold)}
  .footer-meta{display:flex;align-items:center;justify-content:space-between;gap:20px;padding:20px 0 24px;border-top:1px solid rgba(244,240,231,.25)}.footer-meta p{font-size:12px;color:#c9dbce}.footer-meta a{font-size:13px;font-weight:700;text-decoration:none}
  .book-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;padding-bottom:108px}.book-card{display:flex;min-height:540px;flex-direction:column;padding:28px;background:var(--white);border-top:4px solid var(--emerald)}.book-card-featured{background:var(--forest);border-color:var(--gold);color:var(--cream)}.book-card-featured .story-type{color:var(--gold)}.book-card h2{margin:24px 0 10px;font:32px/1.06 var(--serif)}.book-card p:not(.story-type){margin:0;font-size:15px}.book-cover{display:grid;min-height:180px;place-items:center;margin-top:25px;padding:22px;background:#b3977a;color:var(--white);font:26px/1.1 var(--serif);text-align:center}.book-cover-sage{background:#8e9b84}.book-cover-gold{background:var(--gold);color:var(--forest)}.book-note{margin-top:auto;padding-top:28px;color:var(--emerald);font-size:12px;font-weight:700}.book-card-featured .book-note{color:var(--gold)}
  @media(max-width:760px){.footer-main{grid-template-columns:1fr;gap:34px;padding:44px 0 36px}.footer-meta{display:block;padding:18px 0 24px}.footer-meta a{display:inline-block;margin-top:11px}.book-grid{grid-template-columns:1fr;padding-bottom:70px}.book-card{min-height:470px}}
`;
document.head.appendChild(sharedStyles);

const visualStyles = document.createElement('style');
visualStyles.textContent = `
  :root{--serif:var(--sans)}
  h1,h2,h3,blockquote,.wordmark,.article-pullquote{font-family:var(--sans)!important;font-weight:700!important;letter-spacing:-.035em}
  .photo-placeholder,.portrait-placeholder,.article-image{background-image:linear-gradient(0deg,rgba(31,91,76,.12),rgba(31,91,76,.12)),url('assets/dr-santi-portrait-dummy.png')!important;background-size:cover!important;background-position:center!important;border-radius:24px}.photo-placeholder{font-size:0!important}.photo-placeholder span{display:none}.portrait-placeholder{font-size:0!important}.article-image{font-size:0!important}
  .hero-visual{border-radius:28px}.hero-visual .photo-placeholder{border-radius:16px}.visual-caption{border-radius:0 16px 16px 0}
  .program-card,.story-card,.resource-grid article,.article-feature,.article-list article,.credentials>div,.newsletter-panel,.invitation-panel,.offer-section,.article-cta,.book-card,.book-cover,.inquiry-form input,.inquiry-form select,.inquiry-form textarea{border-radius:16px}
  .quote-band{border-radius:28px;margin:0 6%}.quote-band .section-shell{margin-inline:auto}.proof-strip{border-radius:0}
  .landing-hero{border-radius:0 0 28px 28px}.landing-hero:before{display:none}
  .button,.nav-cta{border-radius:999px}.site-nav a{font-family:var(--sans)}
  @media(max-width:760px){.quote-band{margin:0;border-radius:0}.hero-visual{border-radius:20px}.program-card,.story-card,.resource-grid article,.article-feature,.article-list article,.credentials>div,.newsletter-panel,.invitation-panel,.offer-section,.article-cta,.book-card{border-radius:14px}}
`;
document.head.appendChild(visualStyles);

const form = document.querySelector('#inquiry-form');
if (form) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const response = form.querySelector('.form-response');
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    response.textContent = 'Thank you. Your inquiry is ready to be sent to the Dr Santi’s Story team.';
    form.reset();
  });
}
