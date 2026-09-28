// Creates the initial SEO-ready article only when it is absent. Existing team
// edits are never replaced.
import {readFileSync} from 'node:fs';

const env = Object.fromEntries(readFileSync(new URL('../.env.local', import.meta.url), 'utf8')
  .split(/\r?\n/).filter(line => line && !line.startsWith('#') && line.includes('='))
  .map(line => { const at = line.indexOf('='); return [line.slice(0, at), line.slice(at + 1).replace(/^"|"$/g, '')] }));

const block = (key, text, style = 'normal') => ({
  _key: key,
  _type: 'block',
  style,
  markDefs: [],
  children: [{_key: `${key}-text`, _type: 'span', marks: [], text}]
});

const article = {
  _id: 'article.kebiasaan-membaca-anak',
  _type: 'article',
  title: 'Bagaimana membangun kebiasaan membaca anak tanpa menjadikannya beban',
  slug: {_type: 'slug', current: 'kebiasaan-membaca-anak'},
  category: 'Parenting & reading',
  summary: 'Cara membangun kebiasaan membaca anak tanpa menjadikannya beban: mulai dari ritual kecil, pilihan buku, dan percakapan yang hangat.',
  seoTitle: 'Cara Membangun Kebiasaan Membaca Anak',
  seoDescription: 'Cara membangun kebiasaan membaca anak tanpa menjadikannya beban: mulai dari ritual kecil, pilihan buku, dan percakapan yang hangat.',
  publishedAt: '2026-09-28T00:00:00.000Z',
  body: [
    block('intro-one', 'Sering kali kita ingin anak-anak menyukai membaca karena kita tahu betapa banyak hal yang dapat mereka temukan di dalam buku. Tetapi ketika keinginan itu berubah menjadi target yang harus dicapai, membaca bisa terasa seperti tugas tambahan.'),
    block('intro-two', 'Menurut saya, kita bisa mulai dari pertanyaan yang lebih sederhana: bagaimana membuat buku terasa dekat dengan kehidupan anak?'),
    block('heading-one', 'Mulai dari waktu yang kecil dan dapat diulang', 'h2'),
    block('body-one', 'Lima belas menit sebelum tidur, satu cerita setelah makan malam, atau beberapa halaman sambil menunggu waktu berangkat. Waktu yang kecil lebih mudah dijaga daripada rencana yang terlalu ambisius. Yang kita bangun bukan kecepatan, melainkan rasa akrab.'),
    block('heading-two', 'Biarkan anak melihat bahwa membaca adalah bagian dari hidup', 'h2'),
    block('body-two', 'Anak tidak selalu perlu disuruh membaca. Mereka juga belajar dari apa yang mereka lihat. Saat buku, majalah, atau cerita hadir sebagai bagian dari rutinitas keluarga, membaca perlahan menjadi sesuatu yang wajar.'),
    block('heading-three', 'Jadikan percakapan lebih penting daripada jawaban', 'h2'),
    block('body-three', 'Setelah membaca, kita tidak perlu selalu bertanya apa pesan moralnya. Coba tanyakan, “Bagian mana yang paling kamu ingat?” atau “Kalau kamu ada di cerita itu, apa yang akan kamu lakukan?”'),
    block('closing-heading', 'Mulailah dari yang sudah ada', 'h2'),
    block('closing-body', 'Tidak perlu menunggu sudut baca yang sempurna atau koleksi buku yang banyak. Pilih satu cerita, satu waktu, dan satu tempat yang terasa nyaman.')
  ]
};

const endpoint = `https://${env.SANITY_API_PROJECT_ID}.api.sanity.io/v2025-02-19/data/mutate/${env.SANITY_API_DATASET}`;
const response = await fetch(endpoint, {
  method: 'POST',
  headers: {Authorization: `Bearer ${env.SANITY_API_WRITE_TOKEN}`, 'Content-Type': 'application/json'},
  body: JSON.stringify({mutations: [{createIfNotExists: article}]})
});

if (!response.ok) throw new Error((await response.text()) || 'Could not synchronise the initial article.');
console.log('Initial SEO article is available in Sanity without replacing existing content.');
