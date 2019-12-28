import config from 'config'

import { getParams } from './show'

jest.mock('@libs/jira', () => ({
  ISSUE_STATUS: {
    backlog: 'backlog',
    inProgress: 'inProgress',
    done: 'done',
  },
  TIME_FIELDS: {
    created: 'created',
    updated: 'updated',
  },
}))

describe('Show command', () => {
  it('Should have project property', () => {
    expect(getParams('')).toHaveProperty('project')
  })

  it('Should have backlog status', () => {
    const params = getParams('show my backlog tickets')

    expect(params).toHaveProperty('status')
    expect(params.status).toBe('backlog')
  })

  it('Should have inProgress status', () => {
    expect(getParams('show my work').status).toBe('inProgress')

    expect(getParams('on what am I working now?').status).toBe('inProgress')

    expect(getParams('What John is doing?').status).toBe('inProgress')

    expect(getParams('show tickets in progress').status).toBe('inProgress')
  })

  it('Should have done status', () => {
    expect(getParams('What have I done?').status).toBe('done')

    expect(getParams('What Johin did yesterday').status).toBe('done')

    expect(getParams('Show closed tickets from this week').status).toBe('done')

    expect(getParams('What have we finished yesterday').status).toBe('done')
  })

  it('Should have user property', () => {
    ;(config.get as jest.Mock).mockImplementation(
      jest.fn((key: string) => {
        switch (key) {
          case 'users':
            return {
              chatUser: 'jiraUser',
            }
          default:
            return ''
        }
      }),
    )

    const params = getParams('show chatUser tickets')

    expect(params).toHaveProperty('user')
    expect(params.user).toBe('jiraUser')
  })

  it('Should have created field equal 7d', () => {
    const params = getParams('Show tickets created this week')

    expect(params).toHaveProperty('created')
    expect(params.created).toBe('-7d')

    expect(params).not.toHaveProperty('updated')
  })

  it('Should have updated filed equal 1d', () => {
    const params = getParams('Show tickets updated yesterday')

    expect(params).toHaveProperty('updated')
    expect(params.updated).toBe('-2d')

    expect(params).not.toHaveProperty('created')
  })
})
