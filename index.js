const fs = require('fs')
const moment = require('moment')

const utils = require('./utils')

const input = fs
  .readFileSync('./conf-input.txt')
  .toString()
  .trim()

// parse the lines into a more usable form
const allTalks = input.split('\n').map(utils.parseLine)

// sort the talks in reverse order by minutes
allTalks.sort((a, b) => {
  if (a.minutes === b.minutes) return 0
  return a.minutes < b.minutes ? 1 : -1
})

const conference = [
  utils.createTrackPeriod(1, 'morning'),
  utils.createTrackPeriod(1, 'afternoon'),
  utils.createTrackPeriod(2, 'morning'),
  utils.createTrackPeriod(2, 'afternoon'),
]

const assigned = utils.assignTalks(conference, allTalks)
console.log(utils.getTimetableLines(assigned).join('\n'))
