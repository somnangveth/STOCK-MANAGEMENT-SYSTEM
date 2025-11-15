"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ChangeEvent, useRef } from "react";
import { FaPlus } from "react-icons/fa";

interface UploadImageButtonProps {
  imageUrls: string[];
  setImageUrls: (urls: string[]) => void;
}

export default function UploadImageButton({ imageUrls, setImageUrls }: UploadImageButtonProps) {
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // Take only the first selected image (replace mode)
      const file = e.target.files[0];
      const newImageUrl = URL.createObjectURL(file);

      // Replace the old image with the new one
      setImageUrls([newImageUrl]);
    }
  };

  return (
    <div className="flex gap-5 items-center">
      <input
        type="file"
        accept="image/*"
        hidden
        ref={imageInputRef}
        onChange={handleImageChange}
      />

      <Button
        type="button"
        onClick={() => imageInputRef.current?.click()}
        className="w-35 h-50 p-2 bg-gray-300 flex items-center justify-center hover:bg-gray-400 transition-colors"
      >
        <FaPlus className="text-gray-700 text-5xl" />
      </Button>

      <div>
        {imageUrls.length > 0 && (
          <Image
            src={imageUrls[0]}
            className="border border-gray-500 rounded-md"
            width={150}
            height={250}
            alt="uploaded-image"
          />
        )}
      </div>
    </div>
  );
}
