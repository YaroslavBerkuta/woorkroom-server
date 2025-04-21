type TimeUnit = 'ms' | 's';

export type TimeString = `${number}s` | `${number}m` | `${number}h` | `${number}d`;

export function parseTime(
  value: TimeString,
  returnUnit: TimeUnit = 'ms',
): number {
  const num = parseInt(value.slice(0, -1));
  const unit = value.slice(-1);

  let milliseconds: number;

  switch (unit) {
    case 's':
      milliseconds = num * 1000;
      break;
    case 'm':
      milliseconds = num * 60 * 1000;
      break;
    case 'h':
      milliseconds = num * 60 * 60 * 1000;
      break;
    case 'd':
      milliseconds = num * 24 * 60 * 60 * 1000;
      break;
    default:
      throw new Error(`Invalid time format: ${value}`);
  }

  if (returnUnit === 's') {
    return Math.floor(milliseconds / 1000);
  }

  return milliseconds;
}
