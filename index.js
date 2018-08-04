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
  { day: 1, time: 'morning', maxTime: 180, timeLeft: 180, talks: [] },
  { day: 1, time: 'afternoon', maxTime: 240, timeLeft: 240, talks: [] },
  { day: 2, time: 'morning', maxTime: 180, timeLeft: 180, talks: [] },
  { day: 2, time: 'afternoon', maxTime: 240, timeLeft: 240, talks: [] },
]

const assigned = utils.assignTalks(conference, allTalks)
assigned.forEach(track => {
  console.log({ track })

  track.talks.forEach(talk => console.log(talk))
})
