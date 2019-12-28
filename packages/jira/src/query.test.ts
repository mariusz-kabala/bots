import { buildQuery } from './query'
import { ISSUE_STATUS } from './enums'

describe('buildQuery', () => {
  it('Should have project in query', () => {
    expect(
      buildQuery({
        project: 'GEOT',
      }),
    ).toBe('project = "GEOT" ORDER BY issuetype ASC, createdDate DESC')
  })

  it('Should have status in query', () => {
    expect(
      buildQuery({
        project: 'GEOT',
        status: ISSUE_STATUS.backlog,
      }),
    ).toBe('project = "GEOT" AND status = "Backlog" ORDER BY issuetype ASC, createdDate DESC')
  })

  it('Should have user in query', () => {
    expect(
      buildQuery({
        project: 'GEOT',
        user: 'admin',
      }),
    ).toBe('project = "GEOT" AND assignee = "admin" ORDER BY issuetype ASC, createdDate DESC')
  })

  it('Should have created in query', () => {
    expect(
      buildQuery({
        project: 'GEOT',
        created: '14d',
      }),
    ).toBe('project = "GEOT" AND created > 14d ORDER BY issuetype ASC, createdDate DESC')
  })

  it('Should have updated in query', () => {
    expect(
      buildQuery({
        project: 'GEOT',
        updated: '-7d',
      }),
    ).toBe('project = "GEOT" AND updated > -7d ORDER BY issuetype ASC, createdDate DESC')
  })
})
