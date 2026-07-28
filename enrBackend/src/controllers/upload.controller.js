// POST /api/uploads/image - single image (e.g. fabric photo taken via camera or pasted)
export function uploadImage(req, res) {
  if (!req.file) {
    return res.status(400).json({ message: 'No image file received' });
  }
  res.status(201).json({ url: `/uploads/${req.file.filename}` });
}

// POST /api/uploads/images - multiple images (e.g. inspiration mood board)
export function uploadImages(req, res) {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: 'No image files received' });
  }
  const urls = req.files.map((file) => `/uploads/${file.filename}`);
  res.status(201).json({ urls });
}