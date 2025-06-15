import { useState, useCallback } from "react";
import { Camera, Upload, X, FileImage, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

type UploadedImage = {
  id: string;
  file: File;
  preview: string;
  status: "uploading" | "success" | "error";
  progress?: number;
};

type ImageUploadProps = {
  maxFiles?: number;
  maxSizeMB?: number;
  acceptedTypes?: string[];
  onImagesChange: (images: File[]) => void;
  disabled?: boolean;
};

export function ImageUpload({
  maxFiles = 3,
  maxSizeMB = 10,
  acceptedTypes = ["image/jpeg", "image/png", "image/webp"],
  onImagesChange,
  disabled = false,
}: ImageUploadProps) {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = useCallback(
    (file: File): string | null => {
      if (!acceptedTypes.includes(file.type)) {
        return "지원되지 않는 파일 형식입니다. JPG, PNG, WebP 파일만 업로드 가능합니다.";
      }

      if (file.size > maxSizeMB * 1024 * 1024) {
        return `파일 크기가 ${maxSizeMB}MB를 초과합니다.`;
      }

      return null;
    },
    [acceptedTypes, maxSizeMB],
  );

  const addImages = useCallback(
    (files: File[]) => {
      setError(null);

      const validFiles: File[] = [];

      for (const file of files) {
        if (images.length + validFiles.length >= maxFiles) {
          setError(`최대 ${maxFiles}개의 이미지만 업로드할 수 있습니다.`);
          break;
        }

        const validationError = validateFile(file);
        if (validationError) {
          setError(validationError);
          continue;
        }

        validFiles.push(file);
      }

      if (validFiles.length === 0) return;

      const newImages: UploadedImage[] = validFiles.map((file) => ({
        id: Math.random().toString(36).substr(2, 9),
        file,
        preview: URL.createObjectURL(file),
        status: "uploading",
        progress: 0,
      }));

      setImages((prev) => [...prev, ...newImages]);

      // 업로드 시뮬레이션
      newImages.forEach((image, index) => {
        setTimeout(
          () => {
            setImages((prev) =>
              prev.map((img) =>
                img.id === image.id
                  ? { ...img, status: "success" as const, progress: 100 }
                  : img,
              ),
            );
          },
          1000 + index * 500,
        );
      });

      onImagesChange([...images.map((img) => img.file), ...validFiles]);
    },
    [images, maxFiles, validateFile, onImagesChange],
  );

  const removeImage = (id: string) => {
    setImages((prev) => {
      const updated = prev.filter((img) => img.id !== id);
      const imageToRemove = prev.find((img) => img.id === id);

      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.preview);
      }

      onImagesChange(updated.map((img) => img.file));
      return updated;
    });
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (disabled) return;

    const files = Array.from(e.dataTransfer.files);
    addImages(files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      addImages(files);
    }
  };

  return (
    <div className="space-y-4">
      {/* 업로드 영역 */}
      <div
        className={`relative rounded-lg border-2 border-dashed p-6 text-center transition-colors ${
          dragActive
            ? "border-primary-500 bg-primary-50"
            : "border-neutral-300 hover:border-neutral-400"
        } ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"} `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          multiple
          accept={acceptedTypes.join(",")}
          onChange={handleFileInput}
          disabled={disabled || images.length >= maxFiles}
          className="absolute inset-0 cursor-pointer opacity-0"
        />

        <div className="space-y-3">
          <div className="flex justify-center">
            {dragActive ? (
              <Upload className="h-8 w-8 text-primary-600" />
            ) : (
              <Camera className="h-8 w-8 text-neutral-400" />
            )}
          </div>

          <div>
            <p className="text-sm font-medium text-neutral-700">
              제품 이미지를 업로드하세요
            </p>
            <p className="mt-1 text-xs text-neutral-500">
              드래그 앤 드롭하거나 클릭하여 선택
            </p>
          </div>

          <div className="text-xs text-neutral-400">
            <p>
              최대 {maxFiles}개 파일, 각각 {maxSizeMB}MB 이하
            </p>
            <p>JPG, PNG, WebP 형식 지원</p>
          </div>
        </div>
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-danger-200 bg-danger-50 p-3">
          <AlertCircle size={16} className="flex-shrink-0 text-danger-600" />
          <p className="text-sm text-danger-700">{error}</p>
        </div>
      )}

      {/* 업로드된 이미지들 */}
      {images.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-neutral-700">
            업로드된 이미지 ({images.length}/{maxFiles})
          </h4>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {images.map((image) => (
              <ImagePreview
                key={image.id}
                image={image}
                onRemove={() => removeImage(image.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* 도움말 */}
      <div className="rounded-lg bg-neutral-50 p-3 text-xs text-neutral-600">
        💡 <strong>팁:</strong> 제품의 전체 모습, 라벨, 포장재를 포함한 이미지를
        업로드하면 더 정확한 HS Code 분석이 가능합니다.
      </div>
    </div>
  );
}

function ImagePreview({
  image,
  onRemove,
}: {
  image: UploadedImage;
  onRemove: () => void;
}) {
  return (
    <div className="group relative">
      <div className="aspect-square overflow-hidden rounded-lg border bg-neutral-100">
        <img
          src={image.preview}
          alt="업로드된 이미지"
          className="h-full w-full object-cover"
        />

        {/* 상태 오버레이 */}
        {image.status === "uploading" && (
          <div className="bg-opacity-50 absolute inset-0 flex items-center justify-center bg-black">
            <div className="text-xs text-white">
              업로드 중... {image.progress || 0}%
            </div>
          </div>
        )}

        {image.status === "error" && (
          <div className="bg-opacity-50 absolute inset-0 flex items-center justify-center bg-danger-500">
            <AlertCircle className="text-white" size={20} />
          </div>
        )}
      </div>

      {/* 삭제 버튼 */}
      <Button
        variant="destructive"
        size="sm"
        className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 opacity-0 transition-opacity group-hover:opacity-100"
        onClick={onRemove}
      >
        <X size={12} />
      </Button>

      {/* 파일 정보 */}
      <div className="mt-1 truncate text-xs text-neutral-500">
        <FileImage size={12} className="mr-1 inline" />
        {image.file.name}
      </div>
    </div>
  );
}
