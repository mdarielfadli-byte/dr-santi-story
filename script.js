const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.site-nav');
if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.textContent = isOpen ? 'Close' : 'Menu';
  });
}

const isPage = (name) => location.pathname === `/${name}` || location.pathname.endsWith(`/${name}.html`);
const bookNavItem = document.querySelector('.site-nav a[href="speaking-collaboration.html"]');
if (bookNavItem) {
  bookNavItem.href = 'books.html';
  bookNavItem.textContent = "Buku Santi's Story";
  bookNavItem.classList.toggle('active', isPage('books'));
}

const translationPairs = [
  ['Home', 'Beranda'], ['About', 'Tentang'], ['Programs & Services', 'Program & Layanan'], ['Stories & Resources', 'Cerita & Referensi'], ['Contact', 'Kontak'], ['Start a conversation', 'Mulai percakapan'], ['Explore programs', 'Jelajahi program'], ['About Dr Santi', 'Tentang Dr Santi'], ['Articles', 'Artikel'], ['Partnership', 'Kemitraan'], ['Explore partnership', 'Jelajahi kemitraan'], ['Explore Fantasia', 'Jelajahi Fantasia'], ['Explore stories', 'Jelajahi cerita'], ['Coming soon', 'Segera hadir'], ['Reading, leadership & lifelong learning', 'Membaca, kepemimpinan & pembelajaran sepanjang hayat'],
  ["Dr Santi's Story is a thoughtful platform for families, educators, and leaders who believe books can shape how we grow, care, and lead. Through reflective ideas and meaningful conversation, it nurtures a culture of reading that stays close to everyday life.", 'Dr Santi’s Story adalah platform reflektif bagi keluarga, pendidik, dan pemimpin yang percaya bahwa buku dapat membentuk cara kita bertumbuh, merawat, dan memimpin. Melalui gagasan reflektif dan percakapan bermakna, Dr Santi’s Story menumbuhkan budaya membaca yang dekat dengan kehidupan sehari-hari.'], ['Make room for the questions that help us grow.', 'Memberi ruang bagi pertanyaan yang membantu kita bertumbuh.'], ['Ideas that become a shared practice.', 'Gagasan yang menjadi praktik bersama.'], ['Small ideas, held with care.', 'Gagasan kecil, dirawat dengan penuh perhatian.'], ['A thoughtful, trusted voice for people who want perspective they can understand and use.', 'Suara yang hangat dan tepercaya bagi mereka yang mencari perspektif untuk dipahami dan digunakan.'],
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
  renderLocalizedPage(language);
}

function renderLocalizedPage(language) {
  if (!isPage('programs-services')) return;
  const main = document.querySelector('main');
  if (!main) return;
  const copy = language === 'id'
    ? {
        eyebrow: 'Untuk percakapan & kolaborasi',
        title: 'Sebuah titik awal yang hangat untuk menumbuhkan budaya membaca.',
        intro: 'Mungkin Anda baru bertemu Dr Santi di sebuah acara, atau kembali ke kartu nama ini beberapa waktu kemudian. Halaman ini adalah tempat untuk mengenal cara kerja Dr Santi’s Story dan memulai percakapan yang sesuai dengan kebutuhan Anda.',
        note: 'Dr Santi’s Story terus bertumbuh. Format di bawah adalah cara untuk memulai hari ini; layanan dan kolaborasi baru akan hadir seiring kebutuhan komunitas semakin jelas.',
        section: 'Pilih percakapan yang paling relevan hari ini.',
        services: [['01', 'Keynote & thoughtful conversations', 'Perspektif yang hangat dan membumi untuk audiens yang berkumpul membahas membaca, belajar, parenting, kepemimpinan, atau perkembangan manusia.'], ['02', 'Parent & family workshops', 'Ruang praktis untuk keluarga yang ingin menjadikan membaca bagian yang lebih dekat dari kehidupan sehari-hari.'], ['03', 'Learning for educators & leaders', 'Sesi reflektif bagi pendidik dan pemimpin yang ingin membangun rasa ingin tahu, percakapan, dan budaya belajar.'], ['04', 'Book conversations & curation', 'Percakapan berbasis buku serta arah kurasi untuk komunitas, ruang baca, book café, atau library yang ingin tumbuh dengan tujuan yang jelas.']],
        process: 'Setiap kolaborasi dimulai dari konteks Anda.',
        steps: [['01', 'Mendengar', 'Kami mulai dari orang-orang yang hadir, kebutuhan mereka, dan perubahan yang ingin Anda lihat.'], ['02', 'Mengarahkan', 'Kami menyusun format, sudut pandang, dan pengalaman yang terasa relevan—bukan paket satu ukuran untuk semua.'], ['03', 'Melanjutkan', 'Kami mengidentifikasi langkah kecil yang dapat dibawa pulang dan diteruskan setelah percakapan selesai.']],
        future: 'Punya kebutuhan yang belum tercantum?',
        futureText: 'Ceritakan konteks Anda. Layanan baru akan bertumbuh dari percakapan nyata bersama keluarga, sekolah, komunitas, dan organisasi.',
        cta: 'Mulai percakapan'
      }
    : {
        eyebrow: 'For conversations & collaborations',
        title: 'A thoughtful starting point for growing a reading culture.',
        intro: 'Perhaps you met Dr Santi at an event, or returned to this card some time later. This page is a lasting place to understand how Dr Santi’s Story works and begin a conversation that fits what you need.',
        note: 'Dr Santi’s Story is continuing to grow. The formats below are ways to begin today; new services and collaborations will take shape as community needs become clearer.',
        section: 'Choose the conversation that feels most relevant today.',
        services: [['01', 'Keynote & thoughtful conversations', 'A warm, grounded perspective for audiences gathering around reading, learning, parenting, leadership, or human development.'], ['02', 'Parent & family workshops', 'Practical spaces for families who want to make reading feel closer to everyday life.'], ['03', 'Learning for educators & leaders', 'Reflective sessions for educators and leaders who want to build curiosity, conversation, and a culture of learning.'], ['04', 'Book conversations & curation', 'Book-led conversations and curation direction for communities, reading spaces, book cafés, or libraries that want to grow with intention.']],
        process: 'Every collaboration begins with your context.',
        steps: [['01', 'Listen', 'We begin with the people in the room, what they need, and the change you hope to create.'], ['02', 'Shape', 'We develop a format, perspective, and experience that feels relevant—not a one-size-fits-all package.'], ['03', 'Continue', 'We identify small next steps that people can carry forward after the conversation ends.']],
        future: 'Have a need that is not listed yet?',
        futureText: 'Tell us about your context. New services will grow from real conversations with families, schools, communities, and organisations.',
        cta: 'Start a conversation'
      };
  document.title = language === 'id' ? 'Program & Layanan | Dr Santi’s Story' : 'Programs & Services | Dr Santi’s Story';
  main.innerHTML = `<section class="service-entry-hero section-shell"><p class="eyebrow">${copy.eyebrow}</p><h1>${copy.title}</h1><p class="lead">${copy.intro}</p><p class="service-entry-note">${copy.note}</p></section><section class="service-entry-section section-shell"><div class="section-heading"><div><p class="eyebrow">Ways to begin</p><h2>${copy.section}</h2></div><a class="text-link" href="contact.html">${copy.cta} <span>→</span></a></div><div class="service-entry-grid">${copy.services.map(([number, name, description]) => `<article><span>${number}</span><h3>${name}</h3><p>${description}</p><a href="contact.html">${copy.cta} <span>→</span></a></article>`).join('')}</div></section><section class="service-entry-process"><div class="section-shell"><p class="eyebrow light">A considered process</p><h2>${copy.process}</h2><div class="process-grid">${copy.steps.map(([number, name, description]) => `<div><span>${number}</span><h3>${name}</h3><p>${description}</p></div>`).join('')}</div></div></section><section class="section-shell service-entry-cta"><div><p class="eyebrow">Keep this page close</p><h2>${copy.future}</h2></div><div><p>${copy.futureText}</p><a class="button button-primary" href="contact.html">${copy.cta} <span>→</span></a></div></section>`;
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

document.querySelectorAll('a[href]').forEach((link) => {
  const href = link.getAttribute('href');
  if (!href || /^(https?:|mailto:|tel:|#)/.test(href)) return;
  if (href === 'index.html') link.setAttribute('href', '/');
  else link.setAttribute('href', href.replace(/\.html(?=($|[?#]))/, ''));
});

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

const serviceEntryStyles = document.createElement('style');
serviceEntryStyles.textContent = `
  .service-entry-hero{padding:88px 0 66px}.service-entry-hero h1{max-width:850px;margin:0;color:var(--forest);font-size:clamp(46px,5.5vw,74px);line-height:1.01}.service-entry-hero .lead{max-width:760px;margin-bottom:22px}.service-entry-note{max-width:720px;margin:0;padding:17px 20px;border-left:4px solid var(--gold);border-radius:0 12px 12px 0;background:var(--white);font-size:14px;color:#315e53}
  .service-entry-section{padding:34px 0 110px}.service-entry-section .section-heading h2{max-width:700px}.service-entry-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:18px}.service-entry-grid article{display:flex;min-height:305px;flex-direction:column;align-items:flex-start;padding:30px;border-radius:18px;background:var(--white);border-top:4px solid var(--emerald)}.service-entry-grid article:nth-child(2){background:#d8e0d2}.service-entry-grid article:nth-child(3){background:#f5df96}.service-entry-grid article:nth-child(4){background:var(--forest);color:var(--cream);border-color:var(--gold)}.service-entry-grid article>span{color:var(--coral);font-size:13px;font-weight:700}.service-entry-grid article:nth-child(4)>span{color:var(--gold)}.service-entry-grid h3{margin:52px 0 10px;font-size:30px;line-height:1.05}.service-entry-grid p{margin:0;font-size:15px}.service-entry-grid a{margin-top:auto;padding-top:22px;font-size:13px;font-weight:700;text-decoration:none;border-bottom:1px solid currentColor}
  .service-entry-process{padding:94px 0;background:var(--forest);color:var(--cream)}.service-entry-process h2{max-width:660px;margin:0;font-size:clamp(37px,4.6vw,58px);line-height:1.03}.service-entry-process .eyebrow{color:var(--gold)}.service-entry-process .process-grid{margin-top:48px}.service-entry-process .process-grid span{color:var(--gold)}.service-entry-process .process-grid p{color:#d5e6da}.service-entry-cta{display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:center;padding:105px 0}.service-entry-cta h2{margin:0;color:var(--forest);font-size:clamp(37px,4vw,54px);line-height:1.04}.service-entry-cta>div:last-child{max-width:420px}.service-entry-cta>div:last-child p{font-size:17px}
  @media(max-width:760px){.service-entry-hero{padding:55px 0 45px}.service-entry-section{padding:26px 0 70px}.service-entry-grid{grid-template-columns:1fr}.service-entry-grid article{min-height:260px;padding:27px}.service-entry-grid h3{margin-top:38px}.service-entry-process{padding:70px 0}.service-entry-cta{grid-template-columns:1fr;gap:30px;padding:70px 0}.service-entry-note{font-size:13px}}
`;
document.head.appendChild(serviceEntryStyles);

const serviceMotionStyles = document.createElement('style');
serviceMotionStyles.textContent = `
  .service-entry-hero{position:relative;overflow:hidden;display:grid;grid-template-columns:1.05fr .55fr;gap:40px;align-items:end}.service-entry-hero:after{position:absolute;right:-90px;top:-125px;width:390px;height:390px;border:42px solid var(--gold);border-radius:50%;content:"";opacity:.7}.service-entry-hero:before{position:absolute;right:90px;bottom:45px;width:145px;height:145px;border-radius:28px;background:var(--emerald);box-shadow:33px -32px 0 var(--coral);content:"";transform:rotate(14deg)}.service-entry-hero>*{position:relative;z-index:1}.service-entry-note{transition:transform .25s ease,box-shadow .25s ease}.service-entry-note:hover{transform:translateX(7px);box-shadow:0 12px 22px rgba(23,61,53,.12)}
  .service-entry-grid article{position:relative;overflow:hidden;isolation:isolate;transition:transform .25s ease,box-shadow .25s ease,border-color .25s ease}.service-entry-grid article:after{position:absolute;right:-45px;bottom:-62px;z-index:-1;width:145px;height:145px;border-radius:50%;background:rgba(33,134,111,.12);content:"";transition:transform .35s ease,background .35s ease}.service-entry-grid article:hover{transform:translateY(-9px) rotate(-.4deg);box-shadow:0 20px 35px rgba(23,61,53,.16);border-color:var(--gold)}.service-entry-grid article:hover:after{background:rgba(241,194,75,.45);transform:scale(1.45)}.service-entry-grid article:nth-child(even):hover{transform:translateY(-9px) rotate(.4deg)}.service-entry-grid article a span{display:inline-block;transition:transform .2s ease}.service-entry-grid article:hover a span{transform:translateX(6px)}.service-entry-process .process-grid>div{transition:transform .25s ease}.service-entry-process .process-grid>div:hover{transform:translateY(-7px)}
  @media(max-width:760px){.service-entry-hero{display:block}.service-entry-hero:after{right:-135px;width:280px;height:280px;border-width:30px}.service-entry-hero:before{display:none}.service-entry-grid article:hover,.service-entry-grid article:nth-child(even):hover{transform:translateY(-4px)}}
`;
document.head.appendChild(serviceMotionStyles);

const serviceHeroRefinementStyles = document.createElement('style');
serviceHeroRefinementStyles.textContent = `
  .service-entry-hero{display:block;min-height:0;padding:100px 0 76px;overflow:visible}.service-entry-hero:before,.service-entry-hero:after{display:none}.service-entry-hero h1{max-width:780px;font-size:clamp(48px,5.2vw,70px);letter-spacing:-.045em}.service-entry-hero .lead{max-width:680px;margin:28px 0 24px;font-size:19px;line-height:1.6}.service-entry-hero .eyebrow{display:flex;align-items:center;gap:10px}.service-entry-hero .eyebrow:after{width:62px;height:1px;background:var(--gold);content:""}.service-entry-note{max-width:680px;padding:16px 18px;border-left:3px solid var(--emerald);border-radius:0;background:transparent;box-shadow:none!important}.service-entry-note:hover{transform:none}
  @media(max-width:760px){.service-entry-hero{padding:58px 0 48px}.service-entry-hero h1{font-size:46px}.service-entry-hero .lead{font-size:17px}.service-entry-hero .eyebrow:after{width:42px}}
`;
document.head.appendChild(serviceHeroRefinementStyles);

const contentPlaceholderPages = ['stories-resources', 'articles'];
if (contentPlaceholderPages.some((page) => isPage(page))) {
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
