import { getXataClient } from "src/xata";

export async function getMetrics(year: string) {
  const metrics = await getXataClient().db.bugs.filter({ year }).getAll();
  return metrics;
}
