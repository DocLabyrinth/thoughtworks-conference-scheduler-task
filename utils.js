const maxBy = require('lodash/maxBy')

const parseLine = lineStr => {
  const splitLine = lineStr.split(' ')
  const timePart = splitLine[splitLine.length - 1]
  const minutes =
    timePart === 'lightning' ? 5 : parseInt(timePart.replace('mins', ''), 10)

  if (isNaN(minutes)) throw new Error(`Invalid line: ${lineStr}`)

  return {
    minutes,
    title: splitLine
      .slice(0, splitLine.length - 1)
      .join(' ')
      .trim(),
  }
}

assignTalks = (confArr, talksArr) => {
  talksArr.forEach(talk => {
    const track = maxBy(confArr, 'timeLeft')

    if (track.timeLeft < talk.minutes) {
      throw new Error('Too many talks to fit in the time')
    }

    track.talks.push(talk)
    track.timeLeft -= talk.minutes
  })

  return confArr
}

module.exports = { parseLine, assignTalks }
