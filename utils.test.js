const utils = require('./utils')

describe('utils', () => {
  describe('parseLine', () => {
    it('parses a line with a single word title', () => {
      expect(utils.parseLine('Woah 30min')).toEqual({
        title: 'Woah',
        minutes: 30,
        startTime: null,
      })
    })

    it('parses a line with a multi-word title', () => {
      expect(utils.parseLine('Common Ruby Errors 45min')).toEqual({
        title: 'Common Ruby Errors',
        minutes: 45,
        startTime: null,
      })
    })

    it('maps lightning to 5 mins', () => {
      expect(utils.parseLine('Rails for Python Developers lightning')).toEqual({
        title: 'Rails for Python Developers',
        minutes: 5,
        startTime: null,
      })
    })

    it('throws an error if the line is invalid', () => {
      expect(() => utils.parseLine('badline')).toThrow('Invalid line: badline')
    })
  })

  describe('assignTalks', () => {
    describe('assigns to the track with most time remaining', () => {
      it('assigns a single talk', () => {
        const talk = { title: 'Some Talk', minutes: 60 }
        const confArr = [
          utils.createTrackPeriod(1, 'morning'),
          utils.createTrackPeriod(1, 'afternoon'),
          utils.createTrackPeriod(2, 'morning'),
          utils.createTrackPeriod(2, 'afternoon'),
        ]
        const assigned = assignTalks(confArr, [talk])
        expect(assigned[0].talks).toEqual([])
        expect(assigned[1].talks).toEqual([
          { ...talk, startTime: utils.periodToStartTime(assigned[1].period) },
        ])
        expect(assigned[1].timeLeft).toEqual(180)
      })

      it('assigns multiple talks', () => {
        const firstTalk = { title: 'Some Talk', minutes: 80 }
        const secondTalk = { title: 'Other Talk', minutes: 30 }
        const thirdTalk = { title: 'Last Talk', minutes: 30 }
        const confArr = [
          utils.createTrackPeriod(1, 'morning'),
          utils.createTrackPeriod(1, 'afternoon'),
        ]
        const assigned = assignTalks(confArr, [
          firstTalk,
          secondTalk,
          thirdTalk,
        ])
        expect(assigned[0].talks).toEqual([
          {
            ...secondTalk,
            startTime: utils.periodToStartTime(assigned[0].period),
          },
        ])
        expect(assigned[0].timeLeft).toEqual(150)
        expect(assigned[1].talks[0]).toEqual({
          ...firstTalk,
          startTime: utils.periodToStartTime(assigned[1].period),
        })
        expect(assigned[1].talks[1]).toEqual({
          ...thirdTalk,
          startTime:
            utils.periodToStartTime(assigned[1].period) + firstTalk.minutes,
        })
      })
    })

    it('throws an error if the track with the most time remaining can\t fit the talk', () => {
      const talk = { title: 'Some Talk', minutes: 60 }
      const confArr = [{ track: 1, period: 'morning', timeLeft: 30, talks: [] }]
      expect(() => assignTalks(confArr, [talk])).toThrow(
        'Too many talks to fit in the available time',
      )
    })
  })

  describe('minsToTimeStr', () => {
    it('converts a time before 12pm', () => {
      expect(utils.minsToTimeStr(480)).toEqual('08:00AM')
    })
    it('converts 12pm', () => {
      expect(utils.minsToTimeStr(720)).toEqual('12:00PM')
    })
    it('converts a time after 12pm', () => {
      expect(utils.minsToTimeStr(900)).toEqual('03:00PM')
    })
  })

  describe('getTimetableLines', () => {
    it('appends the track title to the morning session', () => {
      const talk = { title: 'Some Talk', minutes: 60 }
      const assigned = assignTalks(
        [utils.createTrackPeriod(1, 'morning')],
        [talk],
      )
      expect(utils.getTimetableLines(assigned)).toEqual([
        'Track 1:',
        '09:00AM Some Talk 60min',
      ])
    })
    it('appends the networing session to the afternoon session after the talks', () => {
      const talk = { title: 'Some Talk', minutes: 60 }
      const assigned = assignTalks(
        [utils.createTrackPeriod(1, 'afternoon')],
        [talk],
      )
      expect(utils.getTimetableLines(assigned)).toEqual([
        '12:00PM Lunch',
        '01:00PM Some Talk 60min',
        '02:00PM Networking Event',
        '',
      ])
    })
  })
})
