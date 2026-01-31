export function generateSlug(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // remove special chars
    .replace(/\s+/g, '-') // spaces → hyphen
    .replace(/-+/g, '-'); // avoid multiple hyphens
}
