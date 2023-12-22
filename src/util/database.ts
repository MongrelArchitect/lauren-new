import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import {
  getDownloadURL,
  ref,
  uploadBytes,
  uploadString,
} from "firebase/storage";
import { database, storage } from "./firebase";
import resizeImage, { generateThumbnail } from "./images";
import Art, { ArtFormInfo } from "@customTypes/art";
import { Exhibition } from "@customTypes/exhibitions";

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

    const newArtRef = await addDoc(collection(database, "art"), newArt);

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
    await uploadString(thumbRef, thumbData, "data_url");
    const thumbURL = await getDownloadURL(thumbRef);

    await updateDoc(newArtRef, {
      imagePath,
      imageURL,
      thumbPath,
      thumbURL,
      uid: newArtRef.id,
    });
  }
}

export async function addNewExhibition(
  year: number,
  title: string,
  gallery: string,
  galleryLocation: string,
) {
  const newExhibition: Exhibition = {
    added: new Date(),
    gallery,
    location: galleryLocation,
    title,
    year,
  };

  const docRef = await addDoc(
    collection(database, "exhibitions"),
    newExhibition,
  );
  const exhibitionRef = doc(database, "exhibitions", docRef.id);
  await updateDoc(exhibitionRef, {
    exhibitionId: docRef.id,
  });
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

export async function updateArt(
  artId: string | unknown,
  formInfo: ArtFormInfo,
) {
  if (!artId || typeof artId !== "string") {
    throw new Error("Invalid or absent artId");
  } else {
    const artRef = doc(database, "art", artId);
    await updateDoc(artRef, {
      title: formInfo.title,
      medium: formInfo.medium,
      size: formInfo.size,
      sold: formInfo.sold,
    });
  }
}

export async function updateBio(newBio: string) {
  const bioRef = doc(database, "profile", "bio");
  await updateDoc(bioRef, {
    info: newBio,
  });
}

export async function updateExhibition(newExhibition: Exhibition) {
  const id = newExhibition.exhibitionId;
  if (!id) {
    throw new Error('Invalid exhibition ID');
  }
  const exhibitionRef = doc(database, "exhibitions", id);
  await updateDoc(exhibitionRef, {
    gallery: newExhibition.gallery,
    location: newExhibition.location,
    title: newExhibition.title,
    year: newExhibition.year,
  });
}
