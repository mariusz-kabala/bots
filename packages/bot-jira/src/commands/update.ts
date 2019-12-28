import { ISSUE_STATUS, jira } from '@libs/jira'
import config from 'config'

import { TICKET_REGEXR, statusesMapper } from '../constants'
import { getStatusCategoryToStatusMapper } from '../helpers/status'

interface IWorkflowTree {
  [key: string]: null | IWorkflowTree
}

type IStatusToTransition = {
  [key in ISSUE_STATUS]: string
}

async function performTransitions({
  neededTransition,
  ticket,
  transitionsPath,
}: {
  neededTransition: string
  ticket: string
  transitionsPath: string[]
}): Promise<boolean> {
  const data = await jira.listTransitions(ticket)

  for (const transition of transitionsPath.slice().reverse()) {
    if (data.transitions.some((t: { id: string }) => t.id === transition)) {
      await jira.transitionIssue(ticket, {
        transition: {
          id: transition,
        },
      })

      if (transition === neededTransition) {
        return true
      }

      return performTransitions({
        neededTransition,
        ticket,
        transitionsPath,
      })
    }
  }

  return false
}

async function updateStatus(status: ISSUE_STATUS, ticket: string) {
  const statusToTransition: IStatusToTransition = config.get('statusToTransition')
  const neededTransition = statusToTransition[status]

  // eslint-disable-next-line
  const transitionsPath = findTransitionPath(neededTransition, config.get<IWorkflowTree>('workflow'))

  if (!transitionsPath) {
    return `I don\' know how to change status of ${ticket}`
  }

  await performTransitions({
    neededTransition,
    ticket,
    transitionsPath,
  })

  return `${ticket.toLocaleUpperCase()} is now ${status}`
}

async function getIssueStatus(ticket: string): Promise<string[]> {
  const issue = await jira.findIssue(ticket)
  const mapper = getStatusCategoryToStatusMapper()
  const category = issue.fields.status.statusCategory.key

  if (!mapper[category]) {
    return []
  }

  return mapper[category]
}

export function findTransitionPath(
  transitionToFind: string,
  tree: IWorkflowTree,
  currentPath: string[] = [],
): string[] | undefined {
  const result = [...currentPath]

  for (const element of Object.keys(tree)) {
    if (element === transitionToFind) {
      result.push(element)
      return result
    }
    const localTree = tree[element]

    if (localTree !== null) {
      const localTreeResult = findTransitionPath(transitionToFind, localTree, [element])

      if (Array.isArray(localTreeResult)) {
        result.push(...localTreeResult)

        return result
      }
    }
  }

  return undefined
}

export async function updateCommand(msg: string): Promise<string> {
  const ticket = msg.match(TICKET_REGEXR)

  if (!ticket) {
    return 'I can\'t find the ticket number in your message'
  }

  const users = config.get<{ [key: string]: string }>('users')
  const RCUser = Object.keys(users).find(user => msg.includes(user))

  if (RCUser) {
    await jira.updateIssue(`${ticket}`, {
      fields: {
        assignee: {
          name: users[RCUser],
        },
      },
    })
  }

  const status = Object.keys(statusesMapper).find(status =>
    statusesMapper[status as ISSUE_STATUS].some(txt => msg.includes(txt)),
  ) as ISSUE_STATUS

  if (status) {
    const currentStatus = await getIssueStatus(`${ticket}`)
    if (!currentStatus.includes(status)) {
      return updateStatus(status, `${ticket}`)
    }
  }
  return `ticket ${ticket} has been updated`
}
