import Image from "next/image";
import { useState } from "react";

export default function FileUpload() {
  const [preview, setPreview] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col space-y-2">
      <input type="file" accept="image/*" onChange={handleChange} />
      {preview && (
        <Image src={preview} alt="Preview" className="w-full max-w-xs rounded" />
      )}
    </div>
  );
}
