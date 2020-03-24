import { sortedIssues } from '@libs/jira'
import { printIssues } from './printIssues'

export function generateReport(sorted: sortedIssues, showAssign = false, printedIssuesLimit = 10) {
  const total = sorted.done.length + sorted.indeterminate.length + sorted.new.length
  const printedIssuesLimitMsg = `\n__Only last ${printedIssuesLimit} issues have been printed__\n\n`
  let message = ''

  if (sorted.indeterminate.length > 0) {
    message += `\n:watch: *IN PROGRESS* (${sorted.indeterminate.length} / ${total})\n${printIssues(
      sorted.indeterminate,
      showAssign,
      printedIssuesLimit,
      false,
    )}\n`

    if (sorted.indeterminate.length > printedIssuesLimit) {
      message += printedIssuesLimitMsg
    }
  }

  if (sorted.new.length > 0) {
    message += `\n:new: *NEW* (${sorted.new.length} / ${total})\n${printIssues(
      sorted.new,
      showAssign,
      printedIssuesLimit,
      false,
    )}\n`

    if (sorted.new.length > printedIssuesLimit) {
      message += printedIssuesLimitMsg
    }
  }

  if (sorted.done.length > 0) {
    message += `\n:man_cartwheeling: *DONE* (${sorted.done.length} / ${total})\n${printIssues(
      sorted.done,
      showAssign,
      printedIssuesLimit,
      false,
    )}`

    if (sorted.done.length > printedIssuesLimit) {
      message += printedIssuesLimitMsg
    }
  }

  if (message !== '') {
    message += '\n'
  }

  if (sorted.new.length === 0) {
    message += `No *new* tickets\n`
  }

  if (sorted.indeterminate.length === 0) {
    message += 'No tickets *in progress*\n'
  }

  if (sorted.done.length === 0) {
    message += 'Nothing was *done*\n'
  }

  return message.substr(0, message.length - 1)
}
