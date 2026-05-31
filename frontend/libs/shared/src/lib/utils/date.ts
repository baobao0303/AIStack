// Date Formatting Utilities (SPEC_CORE_FE)

/**
 * Format a date string or object to DD/MM/YYYY
 */
export function formatDate(date: string | Date | number): string {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  
  return `${day}/${month}/${year}`;
}

/**
 * Format a date string or object to HH:MM DD/MM/YYYY
 */
export function formatDateTime(date: string | Date | number): string {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  
  return `${hours}:${minutes} ${day}/${month}/${year}`;
}
