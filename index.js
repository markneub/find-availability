var moment = require('moment')

// constants and helper functions
var {
  DATE_FORMAT,
  getEmployeeHourOverrides,
  getOverrideHours
} = require('./src/helpers.js')

// input data from file
var {
  companyWorkHours,
  companyHolidays,
  employeeHourOverrides,
  searchParams
} = require('./src/load-input.js')

function find_available_work_hours(user_id, from, to) {
  let output = ''
  let fromDate = moment(from, DATE_FORMAT)
  let toDate = moment(to, DATE_FORMAT)

  let overrides = getEmployeeHourOverrides(user_id)

  // loop over each date in the requested range
  let currDate = fromDate
  while (currDate.isSameOrBefore(toDate)) {
    let formattedDate = currDate.format(DATE_FORMAT)
    let hours
    let isHoliday = false

    // check for company holiday
    companyHolidays.forEach(holiday => {
      if (currDate.isSame(moment(holiday, DATE_FORMAT))) {
        hours = 0
        isHoliday = true
      }
    })

    if (!isHoliday) {
      hours = overrides.length == 0 ?
              companyWorkHours[currDate.day()] : // no custom overrides
              getOverrideHours(user_id, currDate, overrides) // employee specific override
    }

    output += `${formattedDate},${hours}\n`
    currDate.add(1, 'days')
  }

  return output
}

// run the query and output results to console
console.log( find_available_work_hours(searchParams[0], searchParams[1], searchParams[2]) )