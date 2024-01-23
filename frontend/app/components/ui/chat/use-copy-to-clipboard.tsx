"use client";

import { useState } from "react";
import { toast } from "react-toastify";

export interface useCopyToClipboardProps {
  timeout?: number;
}

export function useCopyToClipboard({
  timeout = 2000,
}: useCopyToClipboardProps) {
  const [isCopied, setIsCopied] = useState<Boolean>(false);

  const copyToClipboard = (value: string) => {
    if (typeof window === "undefined" || !navigator.clipboard?.writeText) {
      return;
    }

    if (!value) {
      return;
    }

    const showToastMessage = () => {
      toast.success("Message copied to clipboard!", {
        position: "top-center",
      });
    };

    navigator.clipboard.writeText(value).then(() => {
      setIsCopied(true);
      showToastMessage();

      setTimeout(() => {
        setIsCopied(false);
      }, timeout);
    });
  };

  return { isCopied, copyToClipboard };
}
