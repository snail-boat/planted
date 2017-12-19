export function parseDate(format, [a, b, c]) {
  switch (format.toLowerCase()) {
    case 'd/m/y':
      return new Date(c, b - 1, a)
    case 'm/d/y':
      return new Date(c, a - 1, b);
    default:
      throw new Error(`Invalid date format "${format}"`);
  }
}