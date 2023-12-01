import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { database } from "./firebase";

export async function addNewCollection(name: string) {
  const docRef = await addDoc(collection(database, 'collections'), {
    art: null,
    name,
  });
  const collectionRef = doc(database, "collections", docRef.id);
  await updateDoc(collectionRef, {
    id: docRef.id
  });
  return docRef.id;
}
