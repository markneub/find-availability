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

### External Library

[Moment.js](https://momentjs.com/) is installed as a dependency during `npm install`

- JavaScript's built-in date parsing and formatting abilities are limited and clunky to work with. Moment adds an easy to use and understand API for parsing, comparing, and formatting dates, as well as a simple interface for features that could be useful in the future, such as other date formats or timezone support.
- As the program is run locally in Node.js, the concern of delivering unnecessary extra data over the wire is mitigated. If this were used in a web service, it would likely be used as an asynchronous service where only the request and response are transmitted over the network. If the whole program needed to be integrated into a client-side application, Moment's API provides a useful abstraction for what functions would need to be recreated to avoid downloading the whole library to a client, if file size were a concern.

### Input Validation

Basic input checking is done to make sure required parameters are present and formatted properly. It is possible to fool the validator, but without knowing the context of how this program will be used and what the data source is, it's hard to know exactly what the potential sources and risks of invalid data are. The machine-friendly format of the input file suggests that it's exported from another program and not intended to be regularly edited by a human, so human error in the input file is less of a concern.