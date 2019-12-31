import { createCommand } from './create'
import { jira } from '@libs/jira'
import config from 'config'

jest.mock('@libs/jira', () => ({
  ISSUE_TYPES: {
    bug: 'bug',
    story: 'story',
    epic: 'epic',
    task: 'task',
    subtask: 'subtask',
  },
  jira: {
    addNewIssue: jest.fn().mockImplementation(() => ({
      key: 'Fake-KEY',
    })),
  },
}))

jest.mock('config', () => ({
  __esModule: true,
  default: {
    get: jest.fn((key: string) => {
      switch (key) {
        case 'users':
          return {
            marduk: 'admin',
            rafal: 'rafal-jira',
          }
        case 'issueTypes':
          return {
            bug: 10004,
            story: 10001,
            epic: 10000,
            task: 10002,
            subtask: 10003,
          }
        case 'JiraHost':
          return 'https://fake-host.com'
        default:
          return ''
      }
    }),
  },
}))

const issueTypes: {
  [key: string]: number
} = config.get('issueTypes')

describe('JIRA bot: create command', () => {
  beforeEach(() => {
    ;(jira.addNewIssue as jest.Mock).mockClear()
  })

  it('Should create a new task', async () => {
    await createCommand('create a new task - lorem ipsum', {
      username: 'marduk',
      _id: 'fake-id',
    })

    expect(jira.addNewIssue).toBeCalled()
    expect(jira.addNewIssue).toBeCalledWith({
      fields: {
        project: {
          key: 'GEOT',
        },
        summary: 'lorem ipsum',
        issuetype: {
          id: issueTypes.task,
        },
        assignee: {
          name: 'admin',
        },
      },
    })
  })

  it('Should create a new task with proper description', async () => {
    await createCommand('create a new ticket lorem ipsum, 1234, test test', {
      username: 'marduk',
      _id: 'fake-id',
    })

    expect(jira.addNewIssue).toBeCalledWith({
      fields: {
        project: {
          key: 'GEOT',
        },
        summary: 'lorem ipsum, 1234, test test',
        issuetype: {
          id: issueTypes.task,
        },
        assignee: {
          name: 'admin',
        },
      },
    })
  })

  it('Should create a proper bug ticket and assign right user to it', async () => {
    await createCommand('create a new bug lorem ipsum, 1234, test test assign to rafal', {
      username: 'marduk',
      _id: 'fake-id',
    })

    expect(jira.addNewIssue).toBeCalledWith({
      fields: {
        project: {
          key: 'GEOT',
        },
        summary: 'lorem ipsum, 1234, test test',
        issuetype: {
          id: issueTypes.bug,
        },
        assignee: {
          name: 'rafal-jira',
        },
      },
    })
  })

  it('Should create proper epic when using complex assign sentense', async () => {
    await createCommand('create a new epic lorem ipsum, 1234, test test, and assign to rafal', {
      username: 'marduk',
      _id: 'fake-id',
    })

    expect(jira.addNewIssue).toBeCalledWith({
      fields: {
        project: {
          key: 'GEOT',
        },
        summary: 'lorem ipsum, 1234, test test',
        issuetype: {
          id: issueTypes.epic,
        },
        assignee: {
          name: 'rafal-jira',
        },
      },
    })
  })

  it('Should return proper response', async () => {
    const result = await createCommand('create a new task lorem ipsum', {
      username: 'marduk',
      _id: 'fake-id',
    })

    expect(jira.addNewIssue).toBeCalledWith({
      fields: {
        project: {
          key: 'GEOT',
        },
        summary: 'lorem ipsum',
        issuetype: {
          id: issueTypes.task,
        },
        assignee: {
          name: 'admin',
        },
      },
    })

    expect(result).toBe('created: https://fake-host.com/browse/Fake-KEY')
  })

  it('Should return an info about subtask not being supported currently', async () => {
    const result = await createCommand('create a new subtask lorem ipsum', {
      username: 'marduk',
      _id: 'fake-id',
    })

    expect(jira.addNewIssue).not.toBeCalled()

    expect(result).toBe("sorry, currently I don't know how to create a subtask")
  })
})
