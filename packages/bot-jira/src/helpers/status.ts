import config from 'config'

export function getStatusCategoryToStatusMapper(): {
  [key: string]: string[]
} {
  const results: {
    [key: string]: string[]
  } = {}
  const statusToStatusCategory: {
    [key: string]: string
  } = config.get('statusToStatusCategory')

  for (const status of Object.keys(statusToStatusCategory)) {
    const category = statusToStatusCategory[status]

    if (!results[category]) {
      results[category] = []
    }

    results[category].push(status)
  }

  return results
}
