// Number and Currency Formatting Utilities (SPEC_CORE_FE)

/**
 * Format a number to Vietnamese Dong currency format (e.g. 450,000đ)
 */
export function formatCurrency(value: number): string {
  if (value === undefined || value === null) return '0đ';
  return `${value.toLocaleString('vi-VN')}đ`;
}

/**
 * Format a raw decimal/integer number to structured local string format
 */
export function formatNumber(value: number, decimals = 0): string {
  if (value === undefined || value === null) return '0';
  return value.toLocaleString('vi-VN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}
