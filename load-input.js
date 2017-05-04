var fs = require('fs')

var companyWorkHours = [],
    employees = [],
    employeeHourOverrides = [];

module.exports = (() => {
  let inputData = fs.readFileSync('./input.txt', 'utf8')
  let lines = inputData.split('\n')
  lines.forEach(line => {
    // comment or whitespace line
    if (line.indexOf('#') === 0 || line.trim().length === 0) return

    // company work hours
    let commaSplit = line.split(',')
    if (commaSplit.length === 7) {
      companyWorkHours = commaSplit
      return
    }

    // employees
    if (commaSplit.length === 2) {
      employees.push({
        'id': commaSplit[0],
        'name': commaSplit[1]
      })
      return
    }

    // employee availability override
    try {
      let parsedLine = JSON.parse(`[${line}]`)
      if (parsedLine.length === 4) {
        employeeHourOverrides.push(parsedLine)
      }
    } catch (e) {}
  })

  return {
    companyWorkHours,
    employees,
    employeeHourOverrides
  }
})()