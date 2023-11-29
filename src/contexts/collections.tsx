import { createContext, useEffect, useState } from "react";
import { collection, onSnapshot, query } from "firebase/firestore";
import { database } from "@util/firebase";
import Collection from "@customTypes/collections";

interface ContextProps {
  children: React.ReactNode;
}

export const CollectionsContext = createContext<null | Collection[]>(null);

export default function CollectionsContextProvider({ children }: ContextProps) {
  const [collections, setCollections] = useState<null | Collection[]>(null);

  useEffect(() => {
    const collectionsQuery = query(collection(database, "collections"));
    const allCollections: Collection[] = [];
    const unsubscribe = onSnapshot(collectionsQuery, (querySnapshot) => {
      querySnapshot.forEach((docu) => {
        const data = docu.data() as Collection;
        allCollections.push(data);
      });
      allCollections.sort((a, b) => {
        return a.name.localeCompare(b.name);
      });
      setCollections(allCollections);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <CollectionsContext.Provider value={collections}>
      {children}
    </CollectionsContext.Provider>
  );
}
