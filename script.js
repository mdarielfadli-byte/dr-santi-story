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

const translationPairs = [
  ['Home', 'Beranda'], ['About', 'Tentang'], ['Programs & Services', 'Program & Layanan'], ['Stories & Resources', 'Cerita & Referensi'], ['Contact', 'Kontak'], ['Start a conversation', 'Mulai percakapan'], ['Explore programs', 'Jelajahi program'], ['About Dr Santi', 'Tentang Dr Santi'], ['Articles', 'Artikel'], ['Partnership', 'Kemitraan'], ['Explore partnership', 'Jelajahi kemitraan'], ['Explore Fantasia', 'Jelajahi Fantasia'], ['Explore stories', 'Jelajahi cerita'], ['Coming soon', 'Segera hadir'], ['Reading, leadership & lifelong learning', 'Membaca, kepemimpinan & pembelajaran sepanjang hayat'],
  ["Dr Santi's Story is a brand created by Dr Santi Dharmaputra.", "Dr Santi's Story adalah brand yang dibuat oleh Dr Santi Dharmaputra."], ['Through books, reflective ideas, and meaningful conversation, it helps families and learning communities build a stronger culture of reading and lifelong learning.', 'Melalui buku, gagasan reflektif, dan percakapan bermakna, brand ini membantu keluarga serta komunitas belajar membangun budaya membaca dan belajar sepanjang hayat.'], ['Make room for the questions that help us grow.', 'Memberi ruang bagi pertanyaan yang membantu kita bertumbuh.'], ['Ideas that become a shared practice.', 'Gagasan yang menjadi praktik bersama.'], ['Small ideas, held with care.', 'Gagasan kecil, dirawat dengan penuh perhatian.'], ['A thoughtful, trusted voice for people who want perspective they can understand and use.', 'Suara yang hangat dan tepercaya bagi mereka yang mencari perspektif untuk dipahami dan digunakan.'],
  ['Pilihan bacaan', 'Reading selections'], ['Buku yang menemani pertanyaan-pertanyaan baik.', 'Books that accompany good questions.'], ['Rekomendasi bacaan pilihan dari Dr Santi untuk membangun percakapan, rasa ingin tahu, dan kebiasaan membaca yang bertumbuh bersama.', 'Dr Santi’s selected reading recommendations for building conversation, curiosity, and a reading habit that grows together.'], ['Pilihan untuk keluarga', 'For families'], ['Buku anak yang dibaca bersama', 'Children’s books to read together'], ['Memulai dari cerita yang dekat', 'Beginning with stories that feel close'], ['Pilih buku yang membuka ruang untuk bercerita, bertanya, dan kembali dibaca bersama.', 'Choose books that make room for telling stories, asking questions, and reading together again.'], ['Rekomendasi lengkap akan segera hadir.', 'Full recommendations are coming soon.'], ['Untuk orang tua', 'For parents'], ['Mendampingi anak bertumbuh', 'Supporting children as they grow'], ['Untuk pendidik', 'For educators'], ['Menghidupkan budaya belajar', 'Bringing learning culture to life'],
  ['A Dr Santi\'s Story gathering', 'Sebuah pertemuan Dr Santi’s Story'], ['A room for imagination, stories, and conversations that help us see more possibilities.', 'Ruang untuk imajinasi, cerita, dan percakapan yang membantu kita melihat lebih banyak kemungkinan.'], ['Fantasia is an upcoming gathering by Dr Santi\'s Story. Its final date, format, venue, and programme will be announced after the event details are confirmed.', 'Fantasia adalah pertemuan mendatang dari Dr Santi’s Story. Tanggal, format, tempat, dan program final akan diumumkan setelah detail acara dikonfirmasi.'], ['Receive the first invitation', 'Dapatkan undangan pertama'], ['What to expect', 'Yang akan hadir'], ['Not just an event. A gentle invitation to stay curious.', 'Bukan sekadar acara. Sebuah undangan lembut untuk tetap ingin tahu.'], ['First to know', 'Jadi yang pertama tahu'], ['Be on the Fantasia invitation list.', 'Masuk ke daftar undangan Fantasia.'], ['Leave your contact and we will share the confirmed event information and registration link.', 'Tinggalkan kontak Anda dan kami akan membagikan informasi acara serta tautan registrasi yang telah dikonfirmasi.'], ['QR lead capture will be added when the registration flow is live.', 'QR lead capture akan ditambahkan saat alur registrasi sudah aktif.'], ['Register your interest online', 'Daftarkan minat Anda secara online'],
  ['A library is more than a collection. It is an everyday invitation.', 'Perpustakaan lebih dari sekadar koleksi. Ia adalah undangan sehari-hari.'], ['Dr Santi\'s Story partners with homes, schools, and workplaces to shape thoughtful reading environments—starting from the people who will use them.', 'Dr Santi’s Story bermitra dengan rumah, sekolah, dan tempat kerja untuk membangun ruang baca yang relevan—dimulai dari orang-orang yang akan menggunakannya.'], ['Home library', 'Perpustakaan rumah'], ['School library', 'Perpustakaan sekolah'], ['Workplace library', 'Perpustakaan tempat kerja'], ['Start a partnership', 'Mulai kemitraan'], ['Tell us about the library you want to bring to life.', 'Ceritakan perpustakaan yang ingin Anda hidupkan.'], ['Partnership formats, scope, and fees are developed after an initial conversation.', 'Format, ruang lingkup, dan biaya kemitraan disusun setelah percakapan awal.']
];

const toIndonesian = new Map(translationPairs);
const toEnglish = new Map(translationPairs.map(([english, indonesian]) => [indonesian, english]));
const languageButton = document.createElement('button');
languageButton.type = 'button';
languageButton.className = 'language-switch';

function translatePage(language) {
  const dictionary = language === 'id' ? toIndonesian : toEnglish;
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach((node) => {
    const original = node.nodeValue;
    const trimmed = original.trim();
    if (dictionary.has(trimmed)) node.nodeValue = original.replace(trimmed, dictionary.get(trimmed));
  });
  document.documentElement.lang = language;
  languageButton.textContent = language === 'id' ? 'EN' : 'ID';
  languageButton.setAttribute('aria-label', language === 'id' ? 'Switch to English' : 'Ganti ke Bahasa Indonesia');
  localStorage.setItem('dr-santi-language', language);
}

if (nav) {
  nav.insertAdjacentElement('afterend', languageButton);
  const savedLanguage = localStorage.getItem('dr-santi-language') || 'en';
  translatePage(savedLanguage);
  languageButton.addEventListener('click', () => translatePage(document.documentElement.lang === 'id' ? 'en' : 'id'));
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
        <a href="partnership.html">Partnership</a>
      </nav>
      <nav class="footer-nav" aria-label="Connect with Dr Santi's Story">
        <p class="footer-title">Connect</p>
        <a href="stories-resources.html">Stories &amp; Resources</a>
        <a href="articles.html">Articles</a>
        <a href="fantasia.html">Fantasia</a>
        <a href="contact.html">Contact</a>
      </nav>
    </div>
    <div class="footer-meta section-shell">
      <p>© 2026 Dr Santi's Story. All rights reserved.</p>
      <a href="contact.html">Start a conversation <span aria-hidden="true">→</span></a>
    </div>`;
}

if (nav) translatePage(document.documentElement.lang);

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
  .photo-placeholder,.portrait-placeholder,.article-image{background-image:linear-gradient(0deg,rgba(31,91,76,.12),rgba(31,91,76,.12)),url('https://raw.githubusercontent.com/mdarielfadli-byte/dr-santi-story/main/assets/dr-santi-portrait-dummy.png')!important;background-size:cover!important;background-position:center!important;border-radius:24px}.photo-placeholder{font-size:0!important}.photo-placeholder span{display:none}.portrait-placeholder{font-size:0!important}.article-image{font-size:0!important}
  .hero-visual{border-radius:28px}.hero-visual .photo-placeholder{border-radius:16px}.visual-caption{border-radius:0 16px 16px 0}
  .program-card,.story-card,.resource-grid article,.article-feature,.article-list article,.credentials>div,.newsletter-panel,.invitation-panel,.offer-section,.article-cta,.book-card,.book-cover,.inquiry-form input,.inquiry-form select,.inquiry-form textarea{border-radius:16px}
  .quote-band{border-radius:28px;margin:0 6%}.quote-band .section-shell{margin-inline:auto}.proof-strip{border-radius:0}
  .landing-hero{border-radius:0 0 28px 28px}.landing-hero:before{display:none}
  .button,.nav-cta{border-radius:999px}.site-nav a{font-family:var(--sans)}
  @media(max-width:760px){.quote-band{margin:0;border-radius:0}.hero-visual{border-radius:20px}.program-card,.story-card,.resource-grid article,.article-feature,.article-list article,.credentials>div,.newsletter-panel,.invitation-panel,.offer-section,.article-cta,.book-card{border-radius:14px}}
`;
document.head.appendChild(visualStyles);

const brandStyles = document.createElement('style');
brandStyles.textContent = `
  .hero-copy .lead strong{display:block;margin-bottom:8px;color:var(--forest);font-weight:700}.home-feature-grid{display:grid;grid-template-columns:1fr 1fr;gap:18px;padding:0 0 112px}.home-feature-card{min-height:310px;padding:40px;border-radius:20px;background:var(--white)}.home-feature-card h2{margin:0 0 14px;font-size:39px}.home-feature-card p:not(.eyebrow){max-width:430px}.fantasia-feature{background:#f5df96}.partnership-feature{background:#d8e0d2}
  .fantasia-hero{display:grid;grid-template-columns:1.08fr .92fr;gap:70px;align-items:center;min-height:600px;padding:90px 0}.fantasia-hero h1{margin:0;color:var(--forest);font-size:clamp(70px,10vw,130px);line-height:.85}.fantasia-intro{max-width:560px;margin:27px 0 16px;color:var(--forest);font-size:25px;font-weight:700;line-height:1.25}.fantasia-hero p:not(.eyebrow):not(.fantasia-intro){max-width:540px}.fantasia-orbit{position:relative;display:grid;place-items:center;min-height:365px;border-radius:50%;background:var(--forest);color:var(--cream);box-shadow:inset 0 0 0 24px var(--emerald)}.fantasia-orbit:before,.fantasia-orbit:after{position:absolute;border:1px solid var(--gold);border-radius:50%;content:""}.fantasia-orbit:before{width:78%;height:78%}.fantasia-orbit:after{width:48%;height:48%}.fantasia-orbit span{position:absolute;z-index:1;font-size:14px;font-weight:700;color:var(--gold)}.fantasia-orbit span:nth-child(1){top:17%;left:18%}.fantasia-orbit span:nth-child(2){right:12%;bottom:32%}.fantasia-orbit span:nth-child(3){bottom:14%;left:34%}.fantasia-promise{padding:95px 0}.fantasia-promise h2{max-width:730px;margin:0;color:var(--forest);font-size:clamp(37px,5vw,62px);line-height:1.02}.fantasia-capture{display:grid;grid-template-columns:1.1fr .9fr;gap:65px;align-items:center;margin-bottom:110px;padding:58px;border-radius:24px;background:var(--emerald);color:var(--cream)}.fantasia-capture h2{margin:0;font-size:45px;line-height:1.04}.fantasia-capture .eyebrow{color:var(--gold)}.qr-placeholder{display:grid;grid-template-columns:90px 1fr;gap:20px;align-items:center}.qr-placeholder span{display:grid;place-items:center;width:90px;height:90px;background:var(--cream);color:var(--forest);font-size:21px;font-weight:700}.qr-placeholder p{grid-column:2;margin:0;color:#d5e6da}.qr-placeholder a{grid-column:2;font-size:13px;font-weight:700}
  .partnership-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;padding-bottom:100px}.partnership-grid article{padding:30px;border-radius:18px;background:var(--white);border-top:4px solid var(--emerald)}.partnership-grid article:nth-child(2){background:#d8e0d2}.partnership-grid article:nth-child(3){background:#f5df96}.partnership-grid h2{margin:40px 0 12px;font-size:30px;line-height:1.08}.partnership-grid ul{margin:28px 0 0;padding:20px 0 0;border-top:1px solid rgba(23,61,53,.2);font-size:14px}.partnership-grid li{margin:8px 0}.partnership-process{padding-bottom:100px}.content-status{display:inline-block;margin:0 0 24px;padding:8px 11px;border-radius:999px;background:#d8e0d2;color:var(--forest);font-size:11px;font-weight:700;letter-spacing:.04em}
  @media(max-width:760px){.home-feature-grid,.fantasia-hero,.fantasia-capture,.partnership-grid{grid-template-columns:1fr}.home-feature-grid{padding-bottom:70px}.home-feature-card{min-height:260px;padding:30px}.fantasia-hero{gap:38px;min-height:0;padding:57px 0}.fantasia-orbit{min-height:300px;width:min(100%,330px);justify-self:center}.fantasia-capture{gap:34px;margin-bottom:70px;padding:35px 28px}.fantasia-capture h2{font-size:37px}.partnership-grid{padding-bottom:70px}.partnership-process{padding-bottom:70px}}
`;
document.head.appendChild(brandStyles);

const languageStyles = document.createElement('style');
languageStyles.textContent = `
  .language-switch{flex:0 0 auto;border:1px solid var(--emerald);border-radius:999px;background:transparent;color:var(--forest);padding:8px 10px;font:700 11px var(--sans);letter-spacing:.06em;cursor:pointer}.language-switch:hover{background:var(--emerald);color:var(--white)}
  @media(max-width:760px){.language-switch{margin-left:auto;margin-right:10px}.site-header{gap:10px}.nav-toggle{order:3}.site-nav{top:78px}}
`;
document.head.appendChild(languageStyles);

const contentPlaceholderPages = ['stories-resources.html', 'articles.html'];
if (contentPlaceholderPages.some((page) => location.pathname.endsWith(`/${page}`))) {
  const banner = document.querySelector('.page-banner');
  if (banner) {
    banner.insertAdjacentHTML('afterbegin', '<p class="content-status">Content preview · Stories, articles, and social integrations will be published after the website launch.</p>');
  }
}

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
