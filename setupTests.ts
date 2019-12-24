jest.mock('config', () => ({
  __esModule: true,
  default: {
    get: jest.fn((key: string) => {
      switch (key) {
        case 'users':
          return {}
        default:
          return ''
      }
    }),
  },
}))
