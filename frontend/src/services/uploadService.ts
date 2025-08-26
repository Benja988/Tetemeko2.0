// services/uploadService.ts
export const uploadImageToServer = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  const data = await res.json();
  if (!res.ok || !data?.url) {
    throw new Error(data?.message || 'Image upload failed');
  }

  return data.url;
};
