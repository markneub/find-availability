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
        companyHolidays.push(commaSplit[1])
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

  if (Array.isArray(companyWorkHours) && companyWorkHours.length === 7) {
    companyWorkHours.forEach(day => {
      let parsedHours = parseInt(day, 10)
      if (parsedHours > 24 || parsedHours < 0 || isNaN(parsedHours)) {
        throw new Error('At least of the supplied company workweek hours is not a number or is not between 0 and 24.')
      }
    })
  } else {
    throw new Error('There is an issue with the format of the supplied company work hours. Check the number of days.')
  }

  if (Array.isArray(companyHolidays)) {
    companyHolidays.forEach(holiday => {
      if (!moment(holiday, DATE_FORMAT, true).isValid()) {
        throw new Error('One or more holidays are invalid dates.')
      }
    })
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