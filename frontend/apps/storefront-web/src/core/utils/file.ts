// File Utilities (SPEC_CORE_FE)

/**
 * Trigger browser secure download of a file from a URL or Blob
 */
export function downloadFile(urlOrBlob: string | Blob, filename: string): void {
  if (typeof window === 'undefined') return;

  const link = document.createElement('a');
  let href = '';

  if (urlOrBlob instanceof Blob) {
    href = URL.createObjectURL(urlOrBlob);
  } else {
    href = urlOrBlob;
  }

  link.href = href;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  if (urlOrBlob instanceof Blob) {
    URL.revokeObjectURL(href);
  }
}

/**
 * Validates a file size and accepted MIME types for safe uploads
 */
export function validateUploadFile(file: File, maxSizeBytes: number, allowedTypes: string[]): { valid: boolean; error?: string } {
  if (file.size > maxSizeBytes) {
    const sizeMb = (maxSizeBytes / (1024 * 1024)).toFixed(1);
    return { valid: false, error: `Dung lượng tệp vượt quá giới hạn cho phép là ${sizeMb}MB` };
  }

  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Định dạng tệp tin không hợp lệ hoặc không được hỗ trợ' };
  }

  return { valid: true };
}
