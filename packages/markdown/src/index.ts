export function link(url: string, text: string, validate = true): string {
  let linkUrl = url

  if (!url.startsWith('http') && validate) {
    linkUrl = `https://${linkUrl}`
  }
  return `<${linkUrl} |${text}>`
}
