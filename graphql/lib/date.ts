import subDays from 'date-fns/subDays'

// get Date object for the day that was 30 days ago
const thirtyDaysAgo = (): Date => subDays(Date.now(), 30)

export { thirtyDaysAgo }
