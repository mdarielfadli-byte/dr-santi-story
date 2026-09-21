import {defineConfig, defineField, defineType} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'

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
      title: 'Wording di website',
      type: 'text',
      rows: 4,
      description: 'Ubah teks ini, lalu klik Publish di kanan bawah.'
    })
  ],
  preview: {select: {title: 'label', subtitle: 'value'}}
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
  title: 'Article',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string', validation: Rule => Rule.required()}),
    defineField({name: 'slug', title: 'URL slug', type: 'slug', options: {source: 'title'}, validation: Rule => Rule.required()}),
    defineField({name: 'category', title: 'Category', type: 'string'}),
    defineField({name: 'summary', title: 'Summary', type: 'text', rows: 3}),
    defineField({name: 'featuredImage', title: 'Featured image', type: 'image', options: {hotspot: true}}),
    defineField({name: 'body', title: 'Article body', type: 'array', of: [{type: 'block'}]}),
    defineField({name: 'publishedAt', title: 'Published date', type: 'datetime'})
  ],
  preview: {select: {title: 'title', subtitle: 'category', media: 'featuredImage'}}
})

const event = defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Event title', type: 'string', validation: Rule => Rule.required()}),
    defineField({name: 'slug', title: 'URL slug', type: 'slug', options: {source: 'title'}}),
    defineField({name: 'status', title: 'Status', type: 'string', options: {list: ['Upcoming', 'Past', 'Draft']}}),
    defineField({name: 'eventDate', title: 'Date and time', type: 'datetime'}),
    defineField({name: 'location', title: 'Location', type: 'string'}),
    defineField({name: 'summary', title: 'Short description', type: 'text', rows: 3}),
    defineField({name: 'details', title: 'Event details', type: 'array', of: [{type: 'block'}]}),
    defineField({name: 'featuredImage', title: 'Featured image', type: 'image', options: {hotspot: true}}),
    defineField({name: 'ctaLabel', title: 'CTA label', type: 'string'}),
    defineField({name: 'ctaUrl', title: 'CTA URL', type: 'url'})
  ],
  preview: {select: {title: 'title', subtitle: 'status', media: 'featuredImage'}}
})

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
          S.documentTypeList('pageCopy')
            .title('Edit Website')
            .filter('_type == "pageCopy"')
            .child((documentId) => S.document().documentId(documentId).schemaType('pageCopy')),
          S.divider(),
          S.documentTypeListItem('article').title('Artikel'),
          S.documentTypeListItem('event').title('Event')
        ])
    }),
    visionTool()
  ],
  schema: {types: [pageCopy, copyField, article, event]}
})
