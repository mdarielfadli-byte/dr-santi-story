(function () {
  if (window.DrSantiCMSStarted) return;
  window.DrSantiCMSStarted = true;
  const pathPages = {
    '/': 'home',
    '/index.html': 'home',
    '/about': 'about',
    '/about.html': 'about',
    '/programs-services': 'programs',
    '/programs-services.html': 'programs',
    '/contact': 'contact',
    '/contact.html': 'contact',
    '/stories-resources': 'stories',
    '/stories-resources.html': 'stories',
    '/articles': 'articles',
    '/articles.html': 'articles',
    '/fantasia': 'fantasia',
    '/fantasia.html': 'fantasia',
    '/fantasia-event': 'fantasia-event',
    '/fantasia-event.html': 'fantasia-event',
    '/stories-resources/cartea': 'cartea',
    '/partnership': 'partnership',
    '/partnership.html': 'partnership',
    '/collaborate': 'collaborate',
    '/collaborate.html': 'collaborate',
    '/speaking-collaboration': 'speaking-collaboration',
    '/speaking-collaboration.html': 'speaking-collaboration'
  };
  const pageId = document.body.dataset.cmsPage || pathPages[location.pathname];
  if (!pageId) return;

  const selectors = {
    home: {heroEyebrow: '.hero .eyebrow', heroTitle: '.hero h1', heroLead: '.hero .lead', contextEyebrow: '#about .eyebrow', contextTitle: '#about h2', contextBodyOne: '#about .body-stack p:nth-of-type(1)', contextBodyTwo: '#about .body-stack p:nth-of-type(2)', invitationTitle: '.invitation-panel h2', invitationBody: '.invitation-panel > div:last-child > p'},
    about: {heroEyebrow: '.inner-hero .eyebrow', heroTitle: '.inner-hero h1', introOne: '.editorial-copy p:nth-of-type(1)', introTwo: '.editorial-copy p:nth-of-type(2)', introThree: '.editorial-copy p:nth-of-type(3)', invitationTitle: '.invitation-panel h2', invitationBody: '.invitation-panel > div:last-child > p'},
    programs: {heroEyebrow: '.service-entry-copy .eyebrow', heroTitle: '.service-entry-copy h1', heroLead: '.service-entry-copy .lead', heroNote: '.service-entry-note', sectionTitle: '.service-entry-section .section-heading h2', serviceOneTitle: '.service-entry-grid article:nth-child(1) h3', serviceOneBody: '.service-entry-grid article:nth-child(1) p', serviceTwoTitle: '.service-entry-grid article:nth-child(2) h3', serviceTwoBody: '.service-entry-grid article:nth-child(2) p', serviceThreeTitle: '.service-entry-grid article:nth-child(3) h3', serviceThreeBody: '.service-entry-grid article:nth-child(3) p', serviceFourTitle: '.service-entry-grid article:nth-child(4) h3', serviceFourBody: '.service-entry-grid article:nth-child(4) p', processTitle: '.service-entry-process h2', stepOneTitle: '.process-grid > div:nth-child(1) h3', stepOneBody: '.process-grid > div:nth-child(1) p', stepTwoTitle: '.process-grid > div:nth-child(2) h3', stepTwoBody: '.process-grid > div:nth-child(2) p', stepThreeTitle: '.process-grid > div:nth-child(3) h3', stepThreeBody: '.process-grid > div:nth-child(3) p', invitationTitle: '.service-entry-cta h2', invitationBody: '.service-entry-cta > div:last-child > p'},
    contact: {heroEyebrow: '.contact-hero .eyebrow', heroTitle: '.contact-hero h1', heroLead: '.contact-hero .lead', formEyebrow: '.form-layout .eyebrow', formTitle: '.form-layout h2', formLead: '.form-layout > div > p:not(.eyebrow):not(.form-note)'},
    stories: {heroEyebrow: '.page-banner .eyebrow', heroTitle: '.page-banner h1', heroLead: '.page-banner .lead', eventsEyebrow: '#event-archive .eyebrow', eventsTitle: '#event-archive h2', eventsLead: '.event-archive-heading > p'},
    articles: {heroEyebrow: '.article-listing-header .eyebrow', heroTitle: '.article-listing-header h1', heroLead: '.article-listing-header .lead'},
    fantasia: {heroEyebrow: '.fantasia-warm-copy .eyebrow', heroTitle: '.fantasia-warm-copy h1', heroLead: '.fantasia-warm-copy .lead', heroBody: '.fantasia-warm-copy .fantasia-event-note', actionLabel: '.fantasia-warm-copy .button'},
    'fantasia-event': {heroEyebrow: '.fantasia-documentation-hero .eyebrow', heroTitle: '.fantasia-documentation-hero h1', heroLead: '.fantasia-documentation-hero .lead', storyEyebrow: '.fantasia-event-story .eyebrow', storyTitle: '.fantasia-event-story h2', storyBodyOne: '.fantasia-event-story > div:last-child p:nth-of-type(1)', storyBodyTwo: '.fantasia-event-story > div:last-child p:nth-of-type(2)', themesEyebrow: '.fantasia-event-themes-heading .eyebrow', themesTitle: '.fantasia-event-themes-heading h2', themesLead: '.fantasia-event-themes-heading > p:last-child', themeOneTitle: '.fantasia-event-theme-grid article:nth-child(1) h3', themeOneBody: '.fantasia-event-theme-grid article:nth-child(1) p', themeTwoTitle: '.fantasia-event-theme-grid article:nth-child(2) h3', themeTwoBody: '.fantasia-event-theme-grid article:nth-child(2) p', themeThreeTitle: '.fantasia-event-theme-grid article:nth-child(3) h3', themeThreeBody: '.fantasia-event-theme-grid article:nth-child(3) p'},
    cartea: {heroEyebrow: '.cartea-hero-copy .eyebrow', heroTitle: '.cartea-hero-copy h1', heroLead: '.cartea-hero-copy .lead', storyTitle: '.cartea-story h2'},
    partnership: {heroEyebrow: '.page-banner .eyebrow', heroTitle: '.page-banner h1', heroLead: '.page-banner .lead', invitationTitle: '.invitation-panel h2', invitationBody: '.invitation-panel > div:last-child > p'},
    collaborate: {heroEyebrow: '.collaborate-hero .eyebrow', heroTitle: '.collaborate-hero h1', heroLead: '.collaborate-hero .lead', audiencesTitle: '.collaborate-audiences h2', audienceOneTitle: '.collaborate-audience-grid article:nth-child(1) h3', audienceOneBody: '.collaborate-audience-grid article:nth-child(1) p', audienceTwoTitle: '.collaborate-audience-grid article:nth-child(2) h3', audienceTwoBody: '.collaborate-audience-grid article:nth-child(2) p', audienceThreeTitle: '.collaborate-audience-grid article:nth-child(3) h3', audienceThreeBody: '.collaborate-audience-grid article:nth-child(3) p', invitationTitle: '.collaborate-invitation h2', invitationBody: '.collaborate-invitation > div > div:last-child > p'},
    'speaking-collaboration': {heroEyebrow: '.landing-hero .eyebrow', heroTitle: '.landing-hero h1', heroLead: '.landing-hero .lead', quote: '.landing-proof p'}
  };

  let isStudioPreview = false;
  const applyCopy = (copy, seoDescription) => {
    // The first CMS version named two service fields differently. Keep using
    // their values so existing team edits remain visible after the layout sync.
    if (pageId === 'programs') {
      if (copy.keynoteTitle) copy.serviceOneTitle = copy.keynoteTitle;
      if (copy.keynoteBody) copy.serviceOneBody = copy.keynoteBody;
      if (copy.workshopTitle) copy.serviceTwoTitle = copy.workshopTitle;
      if (copy.workshopBody) copy.serviceTwoBody = copy.workshopBody;
    }
    Object.entries(selectors[pageId] || {}).forEach(([key, selector]) => {
      const element = document.querySelector(selector);
      if (element && copy[key]) {
        const icon = key === 'actionLabel' && element.querySelector('span');
        element.textContent = copy[key];
        if (icon) element.append(' ', icon);
      }
    });
    if (seoDescription) {
      const description = document.querySelector('meta[name="description"]');
      if (description) description.setAttribute('content', seoDescription);
    }
  };

  window.addEventListener('message', event => {
    if (event.origin !== 'https://cms.drsantistory.com') return;
    const preview = event.data;
    if (!preview || preview.type !== 'dr-santi-cms-preview' || preview.pageId !== pageId || !Array.isArray(preview.fields)) return;
    isStudioPreview = true;
    applyCopy(Object.fromEntries(preview.fields.map(field => [field.key, field.value])), preview.seoDescription);
  });

  fetch(`/api/cms-content?page=${encodeURIComponent(pageId)}`)
    .then(response => response.ok ? response.json() : null)
    .then(payload => {
      if (!payload?.page) return;
      if (isStudioPreview) return;
      applyCopy(Object.fromEntries((payload.page.fields || []).map(field => [field.key, field.value])), payload.page.seoDescription);
    })
    .catch(() => {});
})();
