var moment = require('moment')

var {
  companyWorkHours
} = require('./load-input.js')

var {
  DATE_FORMAT
} = require('./load-input.js')

function getEmployeeHourOverrides(user_id, allOverrides) {
  let overrides = []
  allOverrides.forEach(override => {
    if (override[0] === parseInt(user_id, 10)) {
      overrides.push(override)
    }
  })
  return overrides
}

function getOverrideHours(user_id, currDate, overrides) {
  for (let i = 0; i < overrides.length; i++) {
    let override = overrides[i]
    let startDate = override[1] === null ? null : moment(override[1], DATE_FORMAT)
    let endDate = override[2] === null ? null : moment(override[2], DATE_FORMAT)
    let hours = override[3]

    // no start date, yes end date
    if (startDate === null && endDate !== null) {
      if (currDate.isSameOrBefore(endDate)) {
        return hours[currDate.day()]
      }
    }

    // yes start date, no end date
    if (startDate !== null && endDate === null) {
      if (currDate.isSameOrAfter(startDate)) {
        return hours[currDate.day()]
      }
    }

    // yes start date, yes end date
    if (startDate !== null && endDate !== null) {
      if (currDate.isSameOrAfter(startDate) && currDate.isSameOrBefore(endDate)) {
        return hours[currDate.day()]
      }
    }
  }

  // no override matched for this date, so use company work hours
  return companyWorkHours[currDate.day()]
}

module.exports = {
  getEmployeeHourOverrides,
  getOverrideHours
}