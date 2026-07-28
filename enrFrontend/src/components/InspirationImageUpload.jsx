import { useRef, useState, useCallback } from 'react';
import { useImagePaste } from '../hooks/useImagePaste';
import { uploadMultipleImages } from '../api/uploadApi';

/**
 * Inspiration / design reference field for the Add Order form.
 * Supports: selecting file(s) from disk, or pasting an image (Ctrl+V / Cmd+V).
 * No camera capture - these are references (Pinterest screenshots, saved photos), not photos taken on the spot.
 *
 * @param {string[]} value - current list of uploaded inspiration image URLs
 * @param {(urls: string[]) => void} onChange - called with the updated list
 */
export default function InspirationImageUpload({ value = [], onChange }) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFiles = useCallback(
    async (files) => {
      if (files.length === 0) return;

      setError('');
      setIsUploading(true);
      try {
        const urls = await uploadMultipleImages(files);
        onChange([...value, ...urls]);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsUploading(false);
      }
    },
    [value, onChange]
  );

  const pasteRef = useImagePaste(handleFiles);

  function removeImage(indexToRemove) {
    onChange(value.filter((_, i) => i !== indexToRemove));
  }

  return (
    <div
      ref={pasteRef}
      tabIndex={0}
      style={styles.container}
      aria-label="Inspiration images upload - click to select files, or paste an image"
    >
      <div style={styles.header}>
        <span style={styles.label}>Inspiration / design references</span>
        <span style={styles.hint}>Paste an image, or</span>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          style={styles.button}
        >
          {isUploading ? 'Uploading…' : '📁 Select files'}
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => handleFiles(Array.from(e.target.files))}
        style={styles.hiddenInput}
      />

      {error && <p style={styles.error}>{error}</p>}

      {value.length > 0 && (
        <div style={styles.thumbGrid}>
          {value.map((url, i) => (
            <div key={url} style={styles.thumbWrap}>
              <img src={url} alt={`Inspiration ${i + 1}`} style={styles.thumb} />
              <button
                type="button"
                onClick={() => removeImage(i)}
                style={styles.removeBtn}
                aria-label="Remove image"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    border: '1px solid #d8d4cc',
    borderRadius: 10,
    padding: 14,
    background: '#fafaf8',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    flexWrap: 'wrap',
  },
  label: {
    fontWeight: 600,
    fontSize: 14,
    color: '#2a2a28',
  },
  hint: {
    fontSize: 13,
    color: '#7a776e',
    marginLeft: 'auto',
  },
  button: {
    padding: '6px 12px',
    borderRadius: 8,
    border: '1px solid #c9c4b8',
    background: '#fff',
    fontSize: 13,
    cursor: 'pointer',
  },
  hiddenInput: {
    display: 'none',
  },
  error: {
    color: '#b3413d',
    fontSize: 13,
    marginTop: 8,
  },
  thumbGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  thumbWrap: {
    position: 'relative',
    width: 72,
    height: 72,
  },
  thumb: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: 8,
    border: '1px solid #e2ded3',
  },
  removeBtn: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 20,
    height: 20,
    borderRadius: '50%',
    border: 'none',
    background: '#2a2a28',
    color: '#fff',
    fontSize: 13,
    lineHeight: '20px',
    cursor: 'pointer',
  },
};