export function toBaseSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function resolveUniqueSlug(base: string, existingSlugs: string[]): string {
  const slugSet = new Set(existingSlugs);
  const pattern = new RegExp(`^${base}-(\\d{3,})$`);

  const usedNumbers = existingSlugs
    .map((s) => pattern.exec(s))
    .filter(Boolean)
    .map((m) => parseInt(m![1], 10));

  let next = 1;
  if (usedNumbers.length > 0) {
    next = Math.max(...usedNumbers) + 1;
  }

  let candidate = `${base}-${String(next).padStart(3, '0')}`;
  while (slugSet.has(candidate)) {
    next++;
    candidate = `${base}-${String(next).padStart(3, '0')}`;
  }

  return candidate;
}
