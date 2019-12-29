export function link(url: string, text: string): string {
  let linkUrl = url

  if (!url.startsWith('http')) {
    linkUrl = `https://${linkUrl}`
  }
  return `[${text}](${linkUrl})`
}
