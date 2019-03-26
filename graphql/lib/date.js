const subDays = require('date-fns/sub_days')

// get Date object for the day that was 30 days ago
const thirtyDaysAgo = () => subDays(Date.now(), 30)

module.exports = {
  thirtyDaysAgo,
}
