export function formatDate(date: Date) {
  return new Date(date).toLocaleDateString(undefined, {
    timeZone: "UTC",
  })
}
