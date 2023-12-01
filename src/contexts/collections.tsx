import { createContext, useEffect, useState } from "react";
import { collection, onSnapshot, query } from "firebase/firestore";
import { database } from "@util/firebase";
import Collection from "@customTypes/collections";

interface ContextProps {
  children: React.ReactNode;
}

interface AllCollections {
  [key: string]: Collection;
}

export const CollectionsContext = createContext<null | AllCollections>(null);

export default function CollectionsContextProvider({ children }: ContextProps) {
  const [collections, setCollections] = useState<null | AllCollections>(null);

  useEffect(() => {
    const collectionsQuery = query(collection(database, "collections"));
    const unsubscribe = onSnapshot(collectionsQuery, (querySnapshot) => {
      const allCollections: AllCollections = {};
      querySnapshot.forEach((docu) => {
        const data = docu.data() as Collection;
        allCollections[docu.id] = data;
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
