import {readFileSync} from 'node:fs';

const env = Object.fromEntries(
  readFileSync(new URL('../.env.local', import.meta.url), 'utf8')
    .split(/\r?\n/)
    .filter(line => line && !line.startsWith('#') && line.includes('='))
    .map(line => {
      const index = line.indexOf('=');
      return [line.slice(0, index), line.slice(index + 1).replace(/^"|"$/g, '')];
    })
);

const fields = (values) => Object.entries(values).map(([key, value]) => ({
  _key: key,
  _type: 'copyField',
  key,
  label: key.replace(/([A-Z])/g, ' $1').replace(/^./, char => char.toUpperCase()),
  value
}));

const page = (id, title, seoDescription, values) => ({
  _id: `pageCopy.${id}`,
  _type: 'pageCopy',
  title,
  pageId: id,
  seoDescription,
  fields: fields(values)
});

const documents = [
  page('home', 'Home', "Dr Santi's Story - thoughtful ideas, practical reading rituals, and meaningful conversations for families and learning communities.", {
    heroEyebrow: 'Reading, leadership & lifelong learning',
    heroTitle: 'Make room for the questions that help us grow.',
    heroLead: "Dr Santi's Story is a thoughtful platform for families, educators, and leaders who believe books can shape how we grow, care, and lead. Through reflective ideas and meaningful conversation, it nurtures a culture of reading that stays close to everyday life.",
    contextEyebrow: 'A little context',
    contextTitle: 'Wisdom should feel close enough to use.',
    contextBodyOne: 'Dr Santi Dharmaputra is a learning and leadership practitioner whose work brings together education, research, executive search, and human development.',
    contextBodyTwo: "Through reading, stories, and reflective dialogue, she creates room for curiosity, character, and lifelong learning - at home, in schools, and in organizations.",
    invitationTitle: 'Looking for a more meaningful learning experience?',
    invitationBody: 'Tell us about the people you are bringing together. We will help identify a format that fits.'
  }),
  page('about', 'About', "About Dr Santi Dharmaputra and Dr Santi's Story.", {
    heroEyebrow: 'About Dr Santi',
    heroTitle: 'Learning becomes meaningful when it helps us see more clearly.',
    introOne: 'Dr Santi Dharmaputra is a learning and leadership practitioner with a background spanning education, research, executive search, and leadership development across Indonesia, Australia, and the Netherlands.',
    introTwo: 'With a PhD in Sociology and Language from the University of Sydney, she brings intellectual curiosity and research into practical conversations about how people learn, grow, and lead.',
    introThree: "Through Dr Santi's Story, she works with parents, educators, and leaders who want to use reading, stories, and reflective dialogue to build curiosity, character, and lifelong learning.",
    invitationTitle: 'Bring a thoughtful learning experience to your community.',
    invitationBody: 'Explore speaking, workshops, and collaborative learning formats.'
  }),
  page('programs', 'Programs & Services', "Programs and services by Dr Santi's Story.", {
    heroEyebrow: 'Programs & services',
    heroTitle: 'Ideas are only useful when they can become a practice.',
    heroLead: 'Choose a format that gives your audience the right amount of perspective, participation, and a clear next step.',
    keynoteTitle: 'Keynote talks',
    keynoteBody: 'For audiences gathering around reading, learning, parenting, leadership, or human development.',
    workshopTitle: 'Parent workshops',
    workshopBody: 'Practical conversations that help families make reading feel more natural at home.',
    invitationTitle: 'We can find the right format together.',
    invitationBody: 'Tell us about your audience, intention, and date.'
  }),
  page('contact', 'Contact', "Contact Dr Santi's Story.", {
    heroEyebrow: 'Contact',
    heroTitle: 'Start with the people you are bringing together.',
    heroLead: 'Tell us about your school, community, or organization. We will help identify a learning format that fits.',
    formEyebrow: 'Start a conversation',
    formTitle: 'What would you like to make possible?',
    formLead: 'Share a few details. We aim to respond within 2 working days.'
  }),
  page('stories', 'Stories & Resources', "Stories, resources, and perspectives from Dr Santi's Story.", {
    heroEyebrow: 'Stories & resources',
    heroTitle: 'Small ideas that make room for a different kind of attention.',
    heroLead: 'Perspectives on reading, parenting, learning, and the questions that stay with us.'
  }),
  page('fantasia-event', 'Fantasia Event', 'Documentation from the Fantasia parenting session with Dr Santi’s Story.', {
    heroEyebrow: 'Fantasia · 12 September 2026',
    heroTitle: 'Reading begins at home.',
    heroLead: 'A warm parenting session with Fantasia Kindergarten and Preschool on early literacy, shared stories, and the role of parents as a child’s first reading role model.',
    storyEyebrow: 'A shared conversation',
    storyTitle: 'Making space for stories from the very beginning.',
    storyBodyOne: 'At Fantasia, Dr Santi met with parents to explore what literacy can mean in a young child’s everyday life. The session returned to a simple truth: reading habits often begin at home, through the time, language, and attention that parents share with their children.',
    storyBodyTwo: 'Rather than treating reading as a task to complete, the conversation made room for stories as meaningful quality time—an invitation to be curious together, listen closely, and let books become familiar companions.',
    themesTitle: 'Three ways stories grow at home.',
    themesLead: 'Small ideas for making early literacy feel close, meaningful, and shared.'
  })
];

// Seed both published and draft copies. Sanity Studio opens the Drafts
// perspective by default, so this lets editors immediately find every page
// while the public website continues reading its published content.
const studioDocuments = documents.flatMap(document => [
  document,
  {...document, _id: `drafts.${document._id}`}
]);

const endpoint = `https://${env.SANITY_API_PROJECT_ID}.api.sanity.io/v2025-02-19/data/mutate/${env.SANITY_API_DATASET}`;
const result = await fetch(endpoint, {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${env.SANITY_API_WRITE_TOKEN}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({mutations: studioDocuments.map(document => ({createOrReplace: document}))})
});

if (!result.ok) throw new Error((await result.text()) || 'Could not seed CMS content.');
console.log(`Seeded ${documents.length} CMS pages with published and draft copies.`);
