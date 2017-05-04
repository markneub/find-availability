# find-availability

## Description

This program implements a solution for the requirements as specified for the [Find Availability Problem](https://gist.github.com/thenickcox/2c24f686d99eef57fdfc30359cb7ec23).

## Prerequisites

find-availability has the following dependencies:
- Node.js v6 or greater
- npm (you should already have this if you have Node.js installed)

## Instructions

Clone the repository to your local machine, then run:

```
cd find-availability
npm install
node index.js
```

## Notes and Considerations

- [Moment.js](https://momentjs.com/) is installed as a dependency during `npm install`
  - JavaScript's built-in date parsing abilities are limited. Moment adds immediate support for parsing the MM/DD/YYYY format used in the requirements, as well as easily enabling other date formats in the future.
  - As the program is run locally in Node.js, the concern of delivering unnecessary extra data 'over the wire' is mitigated. If this were used in a web service, it would likely be used as an asynchronous service where only the request and response are transmitted over the network. If the whole program needed to be integrated into a client-side application, Moment provides a useful abstraction for what functions would need to be recreated to avoid downloading the whole library to a client.
