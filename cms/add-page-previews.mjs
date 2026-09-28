import {readFileSync} from 'node:fs'

const env = Object.fromEntries(
  readFileSync(new URL('../.env.local', import.meta.url), 'utf8')
    .split(/\r?\n/)
    .filter((line) => line && !line.startsWith('#') && line.includes('='))
    .map((line) => {
      const index = line.indexOf('=')
      return [line.slice(0, index), line.slice(index + 1).replace(/^"|"$/g, '')]
    })
)

const previewUrls = {
  home: 'https://www.drsantistory.com/',
  about: 'https://www.drsantistory.com/about',
  programs: 'https://www.drsantistory.com/programs-services',
  contact: 'https://www.drsantistory.com/contact',
  stories: 'https://www.drsantistory.com/stories-resources',
  'fantasia-event': 'https://www.drsantistory.com/fantasia-event'
}

const mutations = Object.entries(previewUrls).flatMap(([pageId, previewUrl]) => [
  {patch: {id: `pageCopy.${pageId}`, set: {previewUrl}}},
  {patch: {id: `drafts.pageCopy.${pageId}`, set: {previewUrl}}}
])

const endpoint = `https://${env.SANITY_API_PROJECT_ID}.api.sanity.io/v2025-02-19/data/mutate/${env.SANITY_API_DATASET}`
const result = await fetch(endpoint, {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${env.SANITY_API_WRITE_TOKEN}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({mutations})
})

if (!result.ok) throw new Error((await result.text()) || 'Could not add website preview links.')
console.log('Added preview links for CMS pages.')
