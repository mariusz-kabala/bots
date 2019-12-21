function link(url, text) {
  if (!url.startsWith('http')) {
    url = `https://${url}`
  }
  return `[${text}](${url})`
}

module.exports = {
  link,
}
