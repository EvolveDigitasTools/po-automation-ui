export function getMimeTypeFromFileName(filename) {
    // Split the filename by dots to get the file extension
    const parts = filename.split('.');
    const extension = parts[parts.length - 1].toLowerCase();
  
    // Define a mapping of common file extensions to MIME types
    const mimeTypes = {
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      gif: 'image/gif',
      pdf: 'application/pdf',
      // Add more mappings as needed
    };
  
    // Look up the MIME type based on the file extension
    const mimeType = mimeTypes[extension] || 'application/octet-stream';
  
    return mimeType;
}