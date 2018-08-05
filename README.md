# Thoughtworks Conference Timetable Task

A simple NPM module which answers the Thoughtworks interview question about
automatically assigning talks to conference tracks.

It works by sorting the talks into an array where the longest talks are first
then assigning each talk in turn to the track/period which currently has the
most time remaining.

## Setup

```
yarn install
```

## Testing

```
yarn test
```

## Running the example

```
node index.js
```

This uses the sample input data from the Thoughtworks task, although the output
is different because the example output just fills the tracks one after another
whereas this solution assigns talks depending which track has most time remaining
