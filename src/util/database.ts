import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref,  uploadBytes, uploadString } from "firebase/storage";
import { database, storage } from "./firebase";
import resizeImage, {generateThumbnail} from "./images";
import Art, { ArtFormInfo } from "@customTypes/art";

export async function addNewArt(
  formInfo: ArtFormInfo,
  collectionId: string | undefined,
) {
  if (!collectionId) {
    throw new Error("No collection id provided");
  } else if (!formInfo.image) {
    throw new Error("No image provided");
  } else {
    // upload the art info (sans image)
    const newArt: Art = {
      added: new Date(),
      collection: collectionId,
      imagePath: null,
      imageURL: null,
      medium: formInfo.medium,
      size: formInfo.size,
      sold: formInfo.sold,
      thumbPath: null,
      thumbURL: null,
      title: formInfo.title,
    };

    // deal with the image
    const { image } = formInfo;
    await generateThumbnail(image);

    const newArtRef = await addDoc(collection(database, 'art'), newArt);

    const resizedImage = await resizeImage(image);
    const imagePath = `art/${newArtRef.id}.JPEG`;
    const imageRef = ref(storage, imagePath);
    await uploadBytes(imageRef, resizedImage);
    const imageURL = await getDownloadURL(imageRef);

    const thumbData = await generateThumbnail(image);
    if (!thumbData) {
      throw new Error("Error generating thumbnail");
    }
    const thumbPath = `thumbs/${newArtRef.id}.JPEG`;
    const thumbRef = ref(storage, thumbPath);
    await uploadString(thumbRef, thumbData, 'data_url');
    const thumbURL = await getDownloadURL(thumbRef);

    await updateDoc(newArtRef, {
      imagePath,
      imageURL,
      thumbPath,
      thumbURL,
    });
  }
}

export async function addNewCollection(name: string) {
  const docRef = await addDoc(collection(database, "collections"), {
    art: null,
    name,
  });
  const collectionRef = doc(database, "collections", docRef.id);
  await updateDoc(collectionRef, {
    id: docRef.id,
  });
  return docRef.id;
}
