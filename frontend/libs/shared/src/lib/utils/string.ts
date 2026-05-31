// String Manipulation Utilities (SPEC_CORE_FE)

/**
 * Capitalize the first letter of a string
 */
export function capitalize(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Truncate a string with an ellipsis if it exceeds the specified maximum length
 */
export function truncate(str: string, maxLength: number): string {
  if (!str) return '';
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + '...';
}

/**
 * Convert a string to a URL-friendly slug
 */
export function slugify(str: string): string {
  if (!str) return '';
  
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove Vietnamese accents
    .replace(/[đĐ]/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}
