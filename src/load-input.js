var moment = require('moment')
var fs = require('fs')

const DATE_FORMAT = 'MM/DD/YYYY'

var companyWorkHours = [],
    companyHolidays = [],
    employees = [],
    employeeHourOverrides = [],
    searchParams = [];

module.exports = (() => {
  let inputData = fs.readFileSync('./input.txt', 'utf8')
  let lines = inputData.split('\n')
  lines.forEach(line => {
    // comment or whitespace line, no need to parse
    if (line.indexOf('#') === 0 || line.trim().length === 0) return

    let commaSplit = line.split(',') // used to differentiate between input line types

    // company work hours
    if (commaSplit.length === 7) {
      companyWorkHours = commaSplit
      return
    }

    if (commaSplit.length === 2) {
      // company holidays
      if (isNaN(parseInt(commaSplit[0], 10))) {
        companyHolidays.push(commaSplit[1].slice(1, -1)) // slice off the quotes
        return
      }

      // employees (currently unused)
      employees.push({
        'id': commaSplit[0],
        'name': commaSplit[1]
      })
      return
    }

    // find availability for user and dates
    if (commaSplit.length === 3) {
      searchParams = commaSplit
      return
    }

    // employee availability override
    // comma split technique won't work because of nested array, so parse as JSON
    try {
      let parsedLine = JSON.parse(`[${line}]`)
      if (parsedLine.length === 4) {
        employeeHourOverrides.push(parsedLine)
      }
    } catch (e) {}
  })

  // basic input sanity checks

  if (companyWorkHours.length === 7) {
    validateHours(companyWorkHours, 'company work')
  } else {
    throw new Error('The supplied company work hours line is not formatted correctly. Is there a number other than 7 days of work hours provided?')
  }

  if (companyHolidays.length > 0) {
    companyHolidays.forEach(holiday => {
      if (!moment(holiday, DATE_FORMAT, true).isValid()) {
        throw new Error('One or more holidays are invalid dates.')
      }
    })
  } // else there are no holidays, which is fine

  if (employeeHourOverrides.length > 0) {
    employeeHourOverrides.forEach(override => {
      let startDate = override[1]
      let endDate = override[2]
      let hours = override[3]
      validateHours(hours, 'employee override')
      if (startDate && !moment(startDate, DATE_FORMAT, true).isValid()) {
        throw new Error('Invalid start date for employee hour overrides.')
      }
      if (endDate && !moment(endDate, DATE_FORMAT, true).isValid()) {
        throw new Error('Invalid end date for employee hour overrides.')
      }
      if (startDate && endDate && moment(startDate, DATE_FORMAT).isAfter(moment(endDate, DATE_FORMAT))) {
        throw new Error('Start date for employee hour overrides must come before end date.')
      }
    })
  } // else there are no employee hour overrides, which is fine

  if (searchParams.length === 3) {
    let startDate = searchParams[1]
    let endDate = searchParams[2]
    validateDateRange(startDate, endDate, 'search query')
  } else {
    throw new Error('No search query was detected in the input file, or the query has the wrong number of arguments.')
  }

  // validation functions

  function validateHours(hoursArray, hoursType) {
    hoursArray.forEach(day => {
      let parsedHours = parseInt(day, 10)
      if (parsedHours > 24 || parsedHours < 0 || isNaN(parsedHours)) {
        throw new Error(`At least one of the supplied ${hoursType} hours is not a number or is not between 0 and 24.`)
      }
    })
    return true
  }

  function validateDateRange(startDate, endDate, name) {
    startDate = startDate.slice(1, -1) // slice off the quotes
    endDate = endDate.slice(1, -1) // slice off the quotes
    if (!moment(startDate, DATE_FORMAT, true).isValid()) {
      throw new Error(`Invalid start date for ${name}.`)
    }
    if (!moment(endDate, DATE_FORMAT, true).isValid()) {
      throw new Error(`Invalid end date for ${name}.`)
    }
    if (moment(startDate, DATE_FORMAT).isAfter(moment(endDate, DATE_FORMAT))) {
      throw new Error(`Start date for ${name} must come before end date.`)
    }
    return true
  }

  return {
    DATE_FORMAT,
    companyWorkHours,
    companyHolidays,
    employees,
    employeeHourOverrides,
    searchParams
  }
})()