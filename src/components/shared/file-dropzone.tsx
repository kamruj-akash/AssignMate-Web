"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FileText, UploadCloud, X } from "lucide-react";
import { useId, useState } from "react";

interface FileDropzoneProps {
  value: File[];
  onChange: (files: File[]) => void;
  onBlur?: () => void;
  accept?: string;
  multiple?: boolean;
  hint?: string;
  invalid?: boolean;
  id?: string;
}

export function FileDropzone({
  value,
  onChange,
  onBlur,
  accept,
  multiple = true,
  hint,
  invalid,
  id,
}: FileDropzoneProps) {
  const fallbackId = useId();
  const inputId = id ?? fallbackId;
  const [isDragging, setIsDragging] = useState(false);

  const addFiles = (list: FileList | null) => {
    const picked = Array.from(list ?? []);
    if (!picked.length) return;
    onChange(multiple ? [...value, ...picked] : picked.slice(0, 1));
  };

  return (
    <div className="space-y-2">
      <label
        htmlFor={inputId}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          addFiles(e.dataTransfer.files);
          onBlur?.();
        }}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-input px-4 py-6 text-center transition-colors hover:bg-muted/50 has-focus-visible:ring-3 has-focus-visible:ring-ring/50",
          isDragging && "border-primary bg-primary/5",
          invalid && "border-destructive",
        )}
      >
        <UploadCloud className="size-6 text-muted-foreground" />
        <p className="text-sm">
          <span className="font-medium text-primary">Click to upload</span> or
          drag and drop
        </p>
        {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
        <input
          id={inputId}
          type="file"
          className="sr-only"
          accept={accept}
          multiple={multiple}
          onBlur={onBlur}
          onChange={(e) => {
            addFiles(e.target.files);
            // reset so selecting the same file again still fires onChange
            e.target.value = "";
          }}
        />
      </label>

      {value.length > 0 && (
        <ul className="space-y-1.5">
          {value.map((file, index) => (
            <li
              key={`${file.name}-${file.lastModified}-${index}`}
              className="flex items-center justify-between gap-2 rounded-md border px-3 py-2 text-sm"
            >
              <span className="flex min-w-0 items-center gap-2">
                <FileText className="size-4 shrink-0 text-muted-foreground" />
                <span className="truncate">{file.name}</span>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </span>
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label={`Remove ${file.name}`}
                onClick={() => onChange(value.filter((_, i) => i !== index))}
              >
                <X />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
