import Resizer from "react-image-file-resizer";

const resizeFile = (file: File) => {
  return new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      800,
      800,
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

const resizeForCrop = (file: File) => {
  return new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      200,
      200,
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

async function shrinkForCrop(image: File) {
  const resizedImage = await resizeForCrop(image);
  return resizedImage as File;
}

export async function generateThumbnail(image: File) {
  const shrunkImage = await shrinkForCrop(image);

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  let result: null | string = null;

  const bitmap = await createImageBitmap(shrunkImage);

  if (!ctx) {
    throw new Error('Error generating thumbnail');
  }

  canvas.width = 200;
  canvas.height = 200;

  ctx.drawImage(bitmap, 32, 32, 176, 176, 0, 0, 352, 352);
  result = canvas.toDataURL("image/jpeg", 0.9);
  return result;
}
