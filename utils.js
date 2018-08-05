const maxByProp = (arr, prop) => {
  const max = arr.reduce(
    (acc, item) => {
      const itemVal = item[prop]
      if (!acc.max || itemVal > acc.max) {
        acc.max = itemVal
        acc.maxItem = item
      }

      return acc
    },
    { max: null, maxItem: null },
  )

  return max.maxItem
}

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
    startTime: null,
  }
}

assignTalks = (confArr, talksArr) => {
  talksArr.forEach(talk => {
    const track = maxByProp(confArr, 'timeLeft')

    if (track.timeLeft < talk.minutes) {
      throw new Error('Too many talks to fit in the available time')
    }

    const previousTalk = track.talks[track.talks.length - 1]
    const startTime = previousTalk
      ? previousTalk.startTime + previousTalk.minutes
      : track.startTime

    track.talks.push({ ...talk, startTime })
    track.timeLeft -= talk.minutes
  })

  return confArr
}

// for easier conversion to hours/minutes later, startTime is expressed as the
// number of minutes since midnight. Mornings start at 9am, afternoons at 1pm
const periodToStartTime = period => (period === 'morning' ? 540 : 780)
const periodToTimeLeft = period => (period === 'morning' ? 180 : 240)

// transforms the minutes from midnight style times into 01:00PM style strings
const minsToTimeStr = mins => {
  const rawHour = Math.floor(mins / 60)
  const minsStr = String(mins % 60).padStart(2, '0')
  const pmStr = rawHour >= 12 ? 'PM' : 'AM'
  const hourStr = String(rawHour > 12 ? rawHour - 12 : rawHour).padStart(2, '0')
  return `${hourStr}:${minsStr}${pmStr}`
}

const createTrackPeriod = (trackIdx, period) => ({
  period,
  track: trackIdx,
  startTime: periodToStartTime(period),
  timeLeft: periodToTimeLeft(period),
  talks: [],
})

const getTimetableLines = confArr =>
  confArr
    .map(trackPeriod => {
      const startArray =
        trackPeriod.period === 'morning'
          ? [`Track ${trackPeriod.track}:`]
          : ['12:00PM Lunch']

      const talkStrings = trackPeriod.talks.map(
        talk =>
          `${minsToTimeStr(talk.startTime)} ${talk.title} ${talk.minutes}min`,
      )

      if (trackPeriod.period === 'afternoon') {
        const lastTalk = trackPeriod.talks[trackPeriod.talks.length - 1]
        const netTimeStr = minsToTimeStr(lastTalk.startTime + lastTalk.minutes)
        talkStrings.push(`${netTimeStr} Networking Event`)
        // add a gap after each track to simplify joining/outputting the lines
        talkStrings.push('')
      }

      return startArray.concat(talkStrings)
    })
    .reduce((acc, trackPeriodArr) => acc.concat(trackPeriodArr))

module.exports = {
  assignTalks,
  createTrackPeriod,
  minsToTimeStr,
  getTimetableLines,
  parseLine,
  periodToStartTime,
  periodToTimeLeft,
}
