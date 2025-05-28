export function calculateOpenRate(deliveredCount?: number, openedCount?: number): number {
  if (!deliveredCount || deliveredCount === 0) {
    return 0;
  }

  const opens = openedCount || 0;

  return (opens / deliveredCount) * 100;
}
