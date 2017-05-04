var fs = require('fs')

var companyWorkHours = [],
    companyHolidays = [],
    employees = [],
    employeeHourOverrides = [],
    searchParams = [];

module.exports = (() => {
  let inputData = fs.readFileSync('./input.txt', 'utf8')
  let lines = inputData.split('\n')
  lines.forEach(line => {
    // comment or whitespace line
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

  return {
    companyWorkHours,
    companyHolidays,
    employees,
    employeeHourOverrides,
    searchParams
  }
})()