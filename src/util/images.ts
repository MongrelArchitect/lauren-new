import Resizer from "react-image-file-resizer";

const resizeFile = (file: File) => {
  return new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      600,
      600,
      "JPEG",
      100,
      0,
      (uri) => {
        resolve(uri);
      },
      "file",
    );
  });
};

export default async function resizeImage(image: File) {
  const resizedImage = await resizeFile(image);
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

  canvas.width = 200;
  canvas.height = 200;

  ctx.drawImage(
    bitmap,
    Math.floor(bitmap.width / 2) - 100,
    Math.floor(bitmap.height / 2) - 100,
    200,
    200,
    0,
    0,
    200,
    200,
  );
  result = canvas.toDataURL("image/jpeg", 0.9);
  return result;
}
