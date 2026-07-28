import { useEffect, useRef } from 'react';

/**
 * Listens for paste events (Ctrl+V / Cmd+V) on the given container and
 * extracts any image files from the clipboard.
 *
 * @param {(files: File[]) => void} onPasteImages - called with the pasted image file(s)
 * @returns {React.RefObject} attach this ref to the container that should be "paste-active"
 */
export function useImagePaste(onPasteImages) {
  const containerRef = useRef(null);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    function handlePaste(e) {
      const items = e.clipboardData?.items;
      if (!items) return;

      const imageFiles = [];
      for (const item of items) {
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile();
          if (file) imageFiles.push(file);
        }
      }

      if (imageFiles.length > 0) {
        e.preventDefault();
        onPasteImages(imageFiles);
      }
    }

    node.addEventListener('paste', handlePaste);
    return () => node.removeEventListener('paste', handlePaste);
  }, [onPasteImages]);

  return containerRef;
}