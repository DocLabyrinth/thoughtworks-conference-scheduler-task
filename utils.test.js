const utils = require('./utils')

describe('utils', () => {
  describe('parseLine', () => {
    it('parses a line with a single word title', () => {
      expect(utils.parseLine('Woah 30min')).toEqual({
        title: 'Woah',
        minutes: 30,
      })
    })

    it('parses a line with a multi-word title', () => {
      expect(utils.parseLine('Common Ruby Errors 45min')).toEqual({
        title: 'Common Ruby Errors',
        minutes: 45,
      })
    })

    it('maps lightning to 5 mins', () => {
      expect(utils.parseLine('Rails for Python Developers lightning')).toEqual({
        title: 'Rails for Python Developers',
        minutes: 5,
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
          { day: 1, time: 'morning', maxTime: 180, timeLeft: 180, talks: [] },
          { day: 1, time: 'afternoon', maxTime: 240, timeLeft: 240, talks: [] },
        ]
        expect(assignTalks(confArr, [talk])).toEqual([
          { day: 1, time: 'morning', maxTime: 180, timeLeft: 180, talks: [] },
          {
            day: 1,
            time: 'afternoon',
            maxTime: 240,
            timeLeft: 180,
            talks: [talk],
          },
        ])
      })

      it('assigns multiple talks', () => {
        const firstTalk = { title: 'Some Talk', minutes: 80 }
        const secondTalk = { title: 'Some Talk', minutes: 30 }
        const confArr = [
          { day: 1, time: 'morning', maxTime: 180, timeLeft: 180, talks: [] },
          { day: 1, time: 'afternoon', maxTime: 240, timeLeft: 240, talks: [] },
        ]
        expect(assignTalks(confArr, [firstTalk, secondTalk])).toEqual([
          {
            day: 1,
            time: 'morning',
            maxTime: 180,
            timeLeft: 150,
            talks: [secondTalk],
          },
          {
            day: 1,
            time: 'afternoon',
            maxTime: 240,
            timeLeft: 160,
            talks: [firstTalk],
          },
        ])
      })
    })

    it("updates the track's remaining time to avoid needing to recompute when assigning many talks", () => {
      const talk = { title: 'Some Talk', minutes: 60 }
      const confArr = [
        { day: 1, time: 'morning', maxTime: 180, timeLeft: 180, talks: [] },
      ]
      expect(assignTalks(confArr, [talk])).toEqual([
        { day: 1, time: 'morning', maxTime: 180, timeLeft: 120, talks: [talk] },
      ])
    })

    it('throws an error if the track with the most time remaining can\t fit the talk', () => {
      const talk = { title: 'Some Talk', minutes: 60 }
      const confArr = [
        { day: 1, time: 'morning', maxTime: 180, timeLeft: 180, talks: [] },
      ]
      expect(assignTalks(confArr, [talk])).toEqual([
        { day: 1, time: 'morning', maxTime: 180, timeLeft: 120, talks: [talk] },
      ])
    })
  })
})
