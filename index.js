var moment = require('moment')

// helper functions
var {
  getEmployeeHourOverrides,
  getOverrideHours
} = require('./src/helpers.js')

// get data from input file
var {
  DATE_FORMAT,
  companyWorkHours,
  companyHolidays,
  employeeHourOverrides,
  searchParams
} = require('./src/load-input.js')

function find_available_work_hours(user_id, from, to, overrides) {
  let output = ''
  let fromDate = moment(from, DATE_FORMAT)
  let toDate = moment(to, DATE_FORMAT)

  let userOverrides = getEmployeeHourOverrides(user_id, overrides)

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
      hours = userOverrides.length == 0 ?
              companyWorkHours[currDate.day()] : // no custom overrides
              getOverrideHours(user_id, currDate, userOverrides) // employee specific override
    }

    output += `"${formattedDate}",${hours}\n`
    currDate.add(1, 'days')
  }

  return output
}

// run the query and output results to console
let user_id = searchParams[0]
let from = searchParams[1]
let to = searchParams[2]
let overrides = employeeHourOverrides

console.log( find_available_work_hours(user_id, from, to, overrides) )