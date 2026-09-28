import {useEffect, useRef} from 'react'
import {Box, Card, Flex, Text} from '@sanity/ui'

const previewUrls = {
  home: 'https://www.drsantistory.com/',
  about: 'https://www.drsantistory.com/about',
  programs: 'https://www.drsantistory.com/programs-services',
  contact: 'https://www.drsantistory.com/contact',
  stories: 'https://www.drsantistory.com/stories-resources',
  articles: 'https://www.drsantistory.com/articles',
  fantasia: 'https://www.drsantistory.com/fantasia',
  'fantasia-event': 'https://www.drsantistory.com/fantasia-event',
  cartea: 'https://www.drsantistory.com/stories-resources/cartea',
  partnership: 'https://www.drsantistory.com/partnership',
  collaborate: 'https://www.drsantistory.com/collaborate',
  'speaking-collaboration': 'https://www.drsantistory.com/speaking-collaboration'
}

const pageIdsByTitle = {
  Home: 'home',
  About: 'about',
  'Programs & Services': 'programs',
  Contact: 'contact',
  'Stories & Resources': 'stories',
  Articles: 'articles',
  Fantasia: 'fantasia',
  'Fantasia Event': 'fantasia-event',
  'Cartea Event': 'cartea',
  Partnership: 'partnership',
  Collaborate: 'collaborate',
  'Speaking & Collaboration': 'speaking-collaboration'
}

export function PreviewPane(props) {
  const document = props.document || {}
  const displayed = document.displayed || {}
  const title = displayed.title || document.draft?.title || document.published?.title || 'Halaman website'
  const pageId = displayed.pageId || document.draft?.pageId || document.published?.pageId || props.documentId?.replace(/^pageCopy\./, '') || pageIdsByTitle[title]
  const previewUrl = displayed.previewUrl || document.draft?.previewUrl || document.published?.previewUrl || previewUrls[pageId]
  const iframeRef = useRef(null)
  const previewPayload = {
    type: 'dr-santi-cms-preview',
    pageId,
    fields: displayed.fields || document.draft?.fields || document.published?.fields || [],
    seoDescription: displayed.seoDescription || document.draft?.seoDescription || document.published?.seoDescription || '',
  }

  const sendPreview = () => {
    iframeRef.current?.contentWindow?.postMessage(previewPayload, 'https://www.drsantistory.com')
  }

  useEffect(() => {
    sendPreview()
  }, [pageId, JSON.stringify(previewPayload.fields), previewPayload.seoDescription])

  if (!previewUrl) {
    return (
      <Card padding={5} radius={2} tone="caution">
        <Text>Preview untuk halaman ini belum tersedia.</Text>
      </Card>
    )
  }

  return (
    <Flex direction="column" height="fill">
      <Card padding={3} borderBottom>
        <Text size={1} muted>
          Preview draf · {title}
        </Text>
      </Card>
      <Box flex={1} style={{minHeight: 0}}>
        <iframe
          ref={iframeRef}
          title={`Preview ${title}`}
          src={previewUrl}
          onLoad={sendPreview}
          style={{border: 0, display: 'block', height: '100%', width: '100%'}}
        />
      </Box>
    </Flex>
  )
}
