import Resizer from "react-image-file-resizer";

const resizeFile = (file: File, maxSize: number) => {
  return new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      maxSize,
      maxSize,
      "JPEG",
      80,
      0,
      (uri) => {
        resolve(uri);
      },
      "file",
    );
  });
};

export default async function resizeImage(image: File) {
  const resizedImage = await resizeFile(image, 800);
  return resizedImage as File;
}

export async function resizeProfileImage(image: File) {
  const resizedImage = await resizeFile(image, 1200);
  return resizedImage as File;
}

export async function generateThumbnail(image: File) {
  const shrunkImage = await resizeImage(image);

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  let result: null | string = null;

  const bitmap = await createImageBitmap(shrunkImage);

  if (!ctx) {
    throw new Error("Error generating thumbnail");
  }

  canvas.width = 240;
  canvas.height = 240;

  ctx.fillStyle = "#fdfdfd";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.drawImage(
    bitmap,
    Math.floor(bitmap.width / 2) - 120,
    Math.floor(bitmap.height / 2) - 120,
    240,
    240,
    0,
    0,
    240,
    240,
  );
  result = canvas.toDataURL("image/jpeg", 0.9);
  return result;
}
