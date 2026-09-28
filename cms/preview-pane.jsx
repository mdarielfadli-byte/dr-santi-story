import {Box, Card, Flex, Text} from '@sanity/ui'

export function PreviewPane(props) {
  const previewUrl = props.document?.displayed?.previewUrl
  const title = props.document?.displayed?.title || 'Halaman website'

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
          Live preview · {title}
        </Text>
      </Card>
      <Box flex={1} style={{minHeight: 0}}>
        <iframe
          title={`Preview ${title}`}
          src={previewUrl}
          style={{border: 0, display: 'block', height: '100%', width: '100%'}}
        />
      </Box>
    </Flex>
  )
}
