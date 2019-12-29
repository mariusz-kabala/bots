import { findTransitionPath } from './update'

describe('Update command', () => {
  it('Should find proper transition path', () => {
    const workflow = {
      '711': {
        // backlog
        '721': {
          // select for development
          '731': {
            // open the issue
            '4': {
              // in progress
              '5': null,
              '2': null,
            },
            '5': {
              // resolved
              '701': null, // close
              '3': null, // reopen
              '711': null,
            },
            '2': {
              // closed
              '711': null,
            },
          },
        },
      },
    }

    expect(findTransitionPath('3', workflow)).toEqual(['711', '721', '731', '5', '3'])
    expect(findTransitionPath('4', workflow)).toEqual(['711', '721', '731', '4'])
    expect(findTransitionPath('2', workflow)).toEqual(['711', '721', '731', '2'])
  })
})
