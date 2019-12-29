export function splitText(str: string, width = 1500): string[] {
  let len = 0
  const results = []
  let current = ''

  for (const txt of str.split('\n')) {
    len += txt.length
    if (len > width) {
      len = txt.length
      results.push(current)

      current = ''
    }

    current += `${txt}\n`
  }

  if (current !== '') {
    results.push(current)
  }

  return results
}
