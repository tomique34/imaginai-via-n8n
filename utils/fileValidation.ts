export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validates an image file using multiple security checks:
 * 1. File extension validation
 * 2. MIME type verification
 * 3. File size limits
 * 4. Magic number (file signature) verification
 */
export const validateImageFile = async (file: File): Promise<FileValidationResult> => {
  // 1. Check file extension
  const allowedExtensions = ['png', 'jpg', 'jpeg', 'gif', 'webp'];
  const ext = file.name.split('.').pop()?.toLowerCase();

  if (!ext || !allowedExtensions.includes(ext)) {
    return { valid: false, error: 'Invalid file extension. Only PNG, JPG, GIF, and WebP are allowed.' };
  }

  // 2. Verify MIME type
  const allowedMimes = ['image/png', 'image/jpeg', 'image/gif', 'image/webp'];
  if (!allowedMimes.includes(file.type)) {
    return { valid: false, error: 'Invalid file type. Only image files are allowed.' };
  }

  // 3. Check file size (10MB max)
  const MAX_SIZE = 10 * 1024 * 1024;
  if (file.size > MAX_SIZE) {
    return { valid: false, error: 'File is too large. Maximum size is 10MB.' };
  }

  if (file.size === 0) {
    return { valid: false, error: 'File is empty.' };
  }

  // 4. Verify magic numbers (file signature)
  try {
    const magicNumber = await readFileMagicNumber(file);
    if (!isValidImageMagicNumber(magicNumber, file.type)) {
      return { valid: false, error: 'Invalid file format. The file may be corrupted or not a valid image.' };
    }
  } catch (error) {
    return { valid: false, error: 'Failed to read file. Please try again.' };
  }

  return { valid: true };
};

/**
 * Reads the first 4 bytes of a file to determine its magic number
 */
const readFileMagicNumber = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const arr = new Uint8Array(reader.result as ArrayBuffer);
      const header = Array.from(arr.slice(0, 4))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
      resolve(header);
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file.slice(0, 4));
  });
};

/**
 * Validates that the magic number matches the expected signature for the MIME type
 */
const isValidImageMagicNumber = (magic: string, mimeType: string): boolean => {
  const signatures: Record<string, string[]> = {
    'image/png': ['89504e47'],
    'image/jpeg': ['ffd8ffe0', 'ffd8ffe1', 'ffd8ffe2', 'ffd8ffe3', 'ffd8ffe8'],
    'image/gif': ['47494638'],
    'image/webp': ['52494646'], // RIFF format
  };

  const validSignatures = signatures[mimeType];
  if (!validSignatures) {
    return false;
  }

  return validSignatures.some(sig => magic.startsWith(sig));
};

/**
 * Validates base64 encoded data size
 */
export const validateBase64Size = (base64: string): boolean => {
  const base64SizeLimit = 15 * 1024 * 1024; // 15MB (accounting for base64 encoding overhead)
  const base64Size = (base64.length * 3) / 4;
  return base64Size <= base64SizeLimit;
};
