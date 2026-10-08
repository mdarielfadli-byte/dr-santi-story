// Creates a review-only SEO article draft. It never updates an existing team draft
// or published article, and draft IDs are excluded from the public APIs.
import {readFileSync} from 'node:fs';

const env = Object.fromEntries(readFileSync(new URL('../.env.local', import.meta.url), 'utf8')
  .split(/\r?\n/).filter(line => line && !line.startsWith('#') && line.includes('='))
  .map(line => { const at = line.indexOf('='); return [line.slice(0, at), line.slice(at + 1).replace(/^"|"$/g, '')] }));

const {SANITY_API_PROJECT_ID: projectId, SANITY_API_DATASET: dataset, SANITY_API_WRITE_TOKEN: token} = env;
if (!projectId || !dataset || !token) throw new Error('Sanity CMS credentials are missing from .env.local.');

const documentId = 'drafts.article.cara-menumbuhkan-minat-baca-anak';
const apiVersion = '2025-02-19';
const dataUrl = `https://${projectId}.api.sanity.io/v${apiVersion}/data`;
const headers = {Authorization: `Bearer ${token}`};
const block = (key, text, style = 'normal', markDefs = [], marks = []) => ({
  _key: key, _type: 'block', style, markDefs,
  children: [{_key: `${key}-text`, _type: 'span', marks, text}]
});
const linkBlock = (key, before, linkText, href, after = '') => ({
  _key: key, _type: 'block', style: 'normal',
  markDefs: [{_key: `${key}-link`, _type: 'link', href}],
  children: [
    {_key: `${key}-before`, _type: 'span', marks: [], text: before},
    {_key: `${key}-link-text`, _type: 'span', marks: [`${key}-link`], text: linkText},
    {_key: `${key}-after`, _type: 'span', marks: [], text: after}
  ]
});

const exists = await fetch(`${dataUrl}/query/${dataset}?query=${encodeURIComponent('*[_id == $id][0]._id')}&$id=${encodeURIComponent(JSON.stringify(documentId))}`, {headers});
if (!exists.ok) throw new Error((await exists.text()) || 'Could not read the CMS draft.');
if ((await exists.json()).result) {
  console.log('SEO article draft already exists; no team wording was replaced.');
  process.exit(0);
}

const imageBytes = readFileSync(new URL('../assets/dr-santi-reading.jpg', import.meta.url));
const assetResponse = await fetch(`https://${projectId}.api.sanity.io/v${apiVersion}/assets/images/${dataset}?filename=dr-santi-reading.jpg`, {
  method: 'POST', headers: {...headers, 'Content-Type': 'image/jpeg'}, body: imageBytes
});
if (!assetResponse.ok) throw new Error((await assetResponse.text()) || 'Could not upload the featured image.');
const asset = (await assetResponse.json()).document;

const article = {
  _id: documentId,
  _type: 'article',
  title: 'Cara Menumbuhkan Minat Baca Anak Tanpa Menjadikannya Tugas',
  slug: {_type: 'slug', current: 'cara-menumbuhkan-minat-baca-anak'},
  category: 'Parenting & reading',
  summary: 'Cara menumbuhkan minat baca anak dapat dimulai dari waktu kecil, pilihan yang dekat dengan dirinya, dan percakapan yang hangat.',
  seoTitle: 'Cara Menumbuhkan Minat Baca Anak di Rumah',
  seoDescription: 'Cara menumbuhkan minat baca anak di rumah: mulai dari ritual kecil, pilihan buku yang dekat, dan percakapan tanpa tekanan.',
  featuredImage: {_type: 'image', asset: {_type: 'reference', _ref: asset._id}, alt: 'Dr Santi Dharmaputra memegang buku di ruang baca yang hangat.'},
  body: [
    block('intro', 'Cara menumbuhkan minat baca anak tidak harus dimulai dari target halaman atau jadwal yang ketat. Minat biasanya tumbuh ketika buku terasa dekat, waktu bersama terasa aman, dan anak diberi ruang untuk merespons cerita dengan caranya sendiri.'),
    block('intro-two', 'Di rumah, kita dapat memulai dengan hal yang kecil: satu buku yang menarik perhatian, beberapa menit yang dapat diulang, dan satu pertanyaan yang sungguh ingin kita dengar jawabannya.'),
    block('what-it-means', 'Apa yang dimaksud dengan minat baca anak?', 'h2'),
    block('what-it-means-body', 'Minat baca bukan sekadar kemampuan anak menyelesaikan buku. Ia terlihat saat anak mau kembali pada cerita, penasaran pada gambar atau tokoh, meminta dibacakan lagi, atau membawa percakapan dari buku ke kehidupan sehari-hari. Setiap anak akan menemukan jalannya dengan ritme yang berbeda.'),
    block('one', 'Mulai dari waktu yang kecil dan dapat diulang', 'h2'),
    block('one-body', 'Lima belas menit sebelum tidur, satu cerita setelah makan malam, atau beberapa halaman sambil menunggu waktu berangkat dapat menjadi awal yang cukup. Waktu kecil lebih mudah dijaga daripada rencana yang besar. Yang sedang dibangun bukan kecepatan membaca, melainkan rasa akrab dengan buku.'),
    block('two', 'Pilih buku yang memberi anak alasan untuk kembali', 'h2'),
    block('two-body', 'Tidak semua buku harus langsung menjadi “buku yang baik” menurut orang dewasa. Anak mungkin tertarik pada gambar, humor, kendaraan, hewan, tokoh yang berulang, atau cerita yang ingin didengar berkali-kali. Ketertarikan itu dapat menjadi pintu masuk. Ketika anak boleh memilih, buku terasa lebih seperti miliknya.'),
    block('three', 'Membaca bersama, lalu dengarkan', 'h2'),
    block('three-body', 'Sesudah membaca, tidak perlu selalu mencari jawaban yang benar atau pesan moral yang besar. Coba hadirkan pertanyaan yang membuka percakapan: “Bagian mana yang paling kamu ingat?”, “Tokoh mana yang ingin kamu ajak bicara?”, atau “Kalau cerita ini berlanjut, kira-kira apa yang terjadi?” Pertanyaan seperti ini membantu anak melihat bahwa buku adalah ruang untuk berpikir dan membayangkan.'),
    block('four', 'Biarkan anak melihat orang dewasa juga dekat dengan bacaan', 'h2'),
    block('four-body', 'Anak belajar dari suasana yang mereka lihat setiap hari. Saat orang dewasa membaca buku, majalah, resep, atau sesuatu yang benar-benar ingin dipahami, anak menangkap bahwa membaca adalah bagian wajar dari kehidupan. Tidak perlu dibuat sebagai pertunjukan. Kehadiran bacaan yang alami sering kali lebih bermakna daripada banyak instruksi.'),
    block('five', 'Kurangi tekanan ketika anak belum tertarik', 'h2'),
    block('five-body', 'Ada masa ketika anak lebih ingin bergerak, menggambar, atau mengulang cerita lewat permainan. Itu bukan alasan untuk menjadikan buku sebagai hukuman atau ukuran keberhasilan. Tetap letakkan buku di sekitar mereka, tawarkan tanpa memaksa, dan cari bentuk cerita yang terasa dekat. Hubungan yang hangat dengan membaca lebih penting daripada memenangi satu sesi.'),
    block('home', 'Buat buku mudah dijangkau, bukan hanya disimpan', 'h2'),
    block('home-body', 'Buku lebih mudah menjadi bagian dari keseharian ketika dapat diambil sendiri. Satu keranjang kecil di ruang keluarga, beberapa buku dekat tempat tidur, atau satu buku yang ikut dibawa saat bepergian sudah cukup. Rumah tidak perlu terlihat seperti perpustakaan; yang penting, anak tahu bahwa cerita tersedia ketika ia ingin kembali.'),
    block('related', 'Lanjutkan dengan ritual yang sesuai keluarga Anda', 'h2'),
    linkBlock('related-body', 'Jika Anda ingin memulai dari rutinitas kecil, baca juga artikel ', 'Bagaimana membangun kebiasaan membaca anak tanpa menjadikannya beban', '/articles/kebiasaan-membaca-anak', '. Untuk melihat bagaimana kebiasaan di rumah juga dapat membangun cara anak mendengar, memilih, dan bertanggung jawab, kunjungi '),
    linkBlock('related-link-two', '', 'Leadership in the Home', '/leadership-in-the-home', '.'),
    block('faq', 'Pertanyaan yang sering muncul', 'h2'),
    block('faq-one', 'Berapa lama waktu membaca bersama yang ideal?', 'h3'),
    block('faq-one-body', 'Tidak ada angka yang sama untuk semua keluarga. Mulailah dari waktu yang benar-benar bisa diulang, bahkan bila hanya beberapa menit. Konsistensi yang ringan biasanya lebih berguna daripada sesi panjang yang terasa melelahkan.'),
    block('faq-two', 'Bagaimana jika anak hanya ingin membaca buku yang sama?', 'h3'),
    block('faq-two-body', 'Membaca ulang dapat menjadi cara anak mengenali cerita, bahasa, dan rasa aman di dalamnya. Anda dapat tetap mengikuti pilihannya sambil sesekali meletakkan satu pilihan baru di dekat buku yang ia sukai.'),
    block('faq-three', 'Apakah orang tua harus selalu membacakan buku?', 'h3'),
    block('faq-three-body', 'Tidak selalu. Membaca bersama juga dapat berarti melihat gambar, menceritakan ulang, mendengar anak membaca, atau membicarakan satu halaman. Yang penting adalah perhatian yang dibagikan, bukan format yang sempurna.'),
    block('cta-title', 'Mulai dari satu cerita yang terasa dekat', 'h2'),
    linkBlock('cta', 'Temukan lebih banyak gagasan tentang membaca, keluarga, dan pembelajaran di ', 'Stories & Resources', '/stories-resources', ', atau ceritakan konteks komunitas Anda melalui '),
    linkBlock('cta-contact', '', 'halaman Contact', '/contact', '.')
  ]
};

const mutation = await fetch(`${dataUrl}/mutate/${dataset}`, {
  method: 'POST', headers: {...headers, 'Content-Type': 'application/json'}, body: JSON.stringify({mutations: [{create: article}]})
});
if (!mutation.ok) throw new Error((await mutation.text()) || 'Could not create the SEO article draft.');
console.log('SEO article draft created in Sanity. It is not public until the team publishes it.');
