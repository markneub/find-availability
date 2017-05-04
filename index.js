var moment = require('moment')

// constants and helper functions
var {
  DATE_FORMAT,
  getEmployeeHourOverrides,
  getOverrideHours
} = require('./helpers.js')

// input data from file
var {
  companyWorkHours,
  employees,
  employeeHourOverrides
} = require('./load-input.js')

function find_available_work_hours(user_id, from, to) {
  let output = ''
  let fromDate = moment(from, DATE_FORMAT)
  let toDate = moment(to, DATE_FORMAT)

  let overrides = getEmployeeHourOverrides(user_id)

  // loop over each date in the requested range
  let currDate = fromDate
  while (currDate.isSameOrBefore(toDate)) {
    let formattedDate = currDate.format(DATE_FORMAT)
    let hours = overrides.length == 0 ?
              companyWorkHours[currDate.day()] : // no custom overrides
              getOverrideHours(user_id, currDate, overrides) // employee specific override

    output += `${formattedDate},${hours}\n`
    currDate.add(1, 'days')
  }

  return output
}

console.log( find_available_work_hours(1, '12/16/2015', '01/15/2016') )