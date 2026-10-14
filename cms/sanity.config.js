import {defineConfig, defineField, defineType} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {PreviewPane} from './preview-pane'

const copyField = defineType({
  name: 'copyField',
  title: 'Bagian halaman',
  type: 'object',
  fields: [
    defineField({name: 'key', type: 'string', hidden: true, readOnly: true}),
    defineField({
      name: 'label',
      title: 'Bagian yang sedang diubah',
      type: 'string',
      readOnly: true,
      description: 'Gunakan petunjuk ini untuk mengenali teks di halaman website.'
    }),
    defineField({
      name: 'value',
      title: 'Copy English lama',
      type: 'text',
      rows: 4,
      hidden: ({parent}) => Boolean(parent?.valueEn),
      description: 'Disimpan untuk menjaga wording lama. Setelah tersedia, gunakan field English di bawah ini.'
    }),
    defineField({
      name: 'valueId',
      title: 'Copy Bahasa Indonesia',
      type: 'text',
      rows: 4,
      description: 'Tulis seperti Dr Santi berbicara: hangat, jelas, dan tidak terlalu formal. Ini bukan terjemahan kata per kata dari English.'
    }),
    defineField({
      name: 'valueEn',
      title: 'Copy English',
      type: 'text',
      rows: 4,
      description: 'Write naturally for an English-speaking reader. Keep the intent, not a literal translation of Bahasa Indonesia.'
    }),
    defineField({
      name: 'purpose',
      title: 'Tujuan bagian ini',
      type: 'text',
      rows: 2,
      readOnly: true,
      description: 'Mengapa bagian ini ada di halaman.'
    }),
    defineField({
      name: 'editorPrompt',
      title: 'Panduan saat merevisi',
      type: 'text',
      rows: 3,
      readOnly: true,
      description: 'Hal penting yang perlu tetap terasa setelah copy direvisi.'
    })
  ],
  preview: {select: {title: 'label', subtitle: 'valueId'}}
})

const pageCopy = defineType({
  name: 'pageCopy',
  title: 'Edit Website',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Nama halaman', type: 'string', readOnly: true}),
    defineField({name: 'pageId', type: 'string', hidden: true, readOnly: true}),
    defineField({
      name: 'previewUrl',
      title: 'Lihat halaman website',
      type: 'url',
      readOnly: true,
      description: 'Buka tautan ini di tab baru untuk melihat hasilnya pada website.'
    }),
    defineField({
      name: 'seoDescription',
      title: 'Deskripsi Google',
      type: 'text',
      rows: 3,
      description: 'Ringkasan singkat yang dapat tampil pada hasil pencarian Google. Opsional.'
    }),
    defineField({
      name: 'fields',
      title: 'Wording halaman',
      type: 'array',
      of: [{type: 'copyField'}],
      description: 'Buka satu bagian, ubah wordingnya, lalu klik Publish.'
    })
  ],
  preview: {select: {title: 'title', subtitle: 'pageId'}}
})

const article = defineType({
  name: 'article',
  title: 'Artikel',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Judul artikel', type: 'string', validation: Rule => Rule.required()}),
    defineField({name: 'slug', title: 'URL artikel', type: 'slug', options: {source: 'title'}, validation: Rule => Rule.required(), description: 'Dibuat otomatis dari judul. Jangan diubah setelah artikel dipublikasikan.'}),
    defineField({name: 'category', title: 'Kategori', type: 'string'}),
    defineField({name: 'summary', title: 'Ringkasan', type: 'text', rows: 3, description: 'Tampil pada kartu artikel dan dapat digunakan sebagai deskripsi pencarian.'}),
    defineField({name: 'featuredImage', title: 'Foto utama', type: 'image', options: {hotspot: true}, fields: [defineField({name: 'alt', title: 'Deskripsi foto untuk aksesibilitas', type: 'string'})]}),
    defineField({name: 'body', title: 'Isi artikel', type: 'array', of: [{type: 'block'}, {type: 'image', fields: [defineField({name: 'alt', title: 'Deskripsi foto', type: 'string'})]}]}),
    defineField({name: 'publishedAt', title: 'Tanggal publikasi', type: 'datetime'}),
    defineField({name: 'seoTitle', title: 'Judul Google', type: 'string', description: 'Opsional. Gunakan bila judul hasil pencarian perlu berbeda dari judul artikel.'}),
    defineField({name: 'seoDescription', title: 'Deskripsi Google', type: 'text', rows: 3, description: 'Ringkasan yang digunakan untuk hasil Google dan saat artikel dibagikan.'})
  ],
  preview: {select: {title: 'title', subtitle: 'category', media: 'featuredImage'}}
})

const event = defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Judul event', type: 'string', validation: Rule => Rule.required()}),
    defineField({name: 'slug', title: 'URL event', type: 'slug', options: {source: 'title'}, validation: Rule => Rule.required(), description: 'Dibuat dari judul. Jangan diubah setelah event dipublikasikan.'}),
    defineField({name: 'status', title: 'Status', type: 'string', options: {list: [{title: 'Akan datang', value: 'Upcoming'}, {title: 'Sudah berlangsung', value: 'Past'}, {title: 'Draft (tidak tampil publik)', value: 'Draft'}]}, initialValue: 'Draft'}),
    defineField({name: 'eventDate', title: 'Tanggal dan waktu', type: 'datetime'}),
    defineField({name: 'location', title: 'Lokasi', type: 'string'}),
    defineField({name: 'summary', title: 'Ringkasan', type: 'text', rows: 3, description: 'Tampil di kartu event dan hasil pencarian.'}),
    defineField({name: 'details', title: 'Detail event', type: 'array', of: [{type: 'block'}]}),
    defineField({name: 'featuredImage', title: 'Foto utama', type: 'image', options: {hotspot: true}, fields: [defineField({name: 'alt', title: 'Deskripsi foto untuk aksesibilitas', type: 'string'})]}),
    defineField({name: 'ctaLabel', title: 'Label tombol', type: 'string'}),
    defineField({name: 'ctaUrl', title: 'Tautan tombol', type: 'url'})
  ],
  preview: {select: {title: 'title', subtitle: 'status', media: 'featuredImage'}}
})

const editablePages = [
  ['pageCopy.home', 'Home'],
  ['pageCopy.about', 'About'],
  ['pageCopy.programs', 'Programs & Services'],
  ['pageCopy.contact', 'Contact'],
  ['pageCopy.stories', 'Stories & Resources'],
  ['pageCopy.articles', 'Articles'],
  ['pageCopy.fantasia', 'Fantasia'],
  ['pageCopy.fantasia-event', 'Fantasia Event'],
  ['pageCopy.cartea', 'Cartea Event'],
  ['pageCopy.partnership', 'Partnership'],
  ['pageCopy.collaborate', 'Collaborate'],
  ['pageCopy.speaking-collaboration', 'Speaking & Collaboration']
  ,['pageCopy.leadership-home', 'Leadership in the Home']
]

const pageEditor = (S, documentId) => S.document()
  .documentId(documentId)
  .schemaType('pageCopy')
  .views([
    S.view.form().title('Edit copy'),
    S.view.component(PreviewPane).title('Preview halaman')
  ])

export default defineConfig({
  name: 'dr-santi-story',
  title: "Dr Santi’s Story CMS",
  projectId: 'j3iy9iqu',
  dataset: 'production',
  plugins: [
    structureTool({
      structure: (S) => S.list()
        .title("Dr Santi’s Story CMS")
        .items([
          S.listItem()
            .title('Edit Website')
            .id('edit-website')
            .child(
              S.list()
                .title('Edit Website')
                .items(editablePages.map(([documentId, title]) =>
                  S.listItem()
                    .title(title)
                    .id(documentId)
                    .child(pageEditor(S, documentId))
                ))
            ),
          S.divider(),
          S.documentTypeListItem('article').title('Artikel'),
          S.documentTypeListItem('event').title('Event')
        ])
    }),
    visionTool()
  ],
  schema: {types: [pageCopy, copyField, article, event]}
})
