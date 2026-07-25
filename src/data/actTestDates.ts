// Official national ACT test dates. Source: act.org test-dates page (2026-2027
// national schedule). Update this list periodically as ACT publishes new dates.
export const ACT_NATIONAL_TEST_DATES: string[] = [
  "2026-09-19",
  "2026-10-17",
  "2026-12-12",
  "2027-02-27",
  "2027-04-10",
  "2027-06-12",
  "2027-07-10",
];

/** The next N official test dates that haven't already passed, as Date objects (midnight local). */
export function upcomingActTestDates(count: number, from: Date = new Date()): Date[] {
  const startOfToday = new Date(from);
  startOfToday.setHours(0, 0, 0, 0);

  return ACT_NATIONAL_TEST_DATES.map((iso) => {
    const [y, m, d] = iso.split("-").map(Number);
    return new Date(y, m - 1, d);
  })
    .filter((d) => d.getTime() >= startOfToday.getTime())
    .slice(0, count);
}
