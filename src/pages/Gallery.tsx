import { useContext, useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { collection, onSnapshot, query, where } from "firebase/firestore";

import { database } from "@util/firebase";

import { CollectionsContext } from "@contexts/collections";
import { UserContext } from "@contexts/users";

import Blur from "@components/Blur";
import NewArt from "@components/NewArt";
import ShowArt from "@components/Art";

import Art from "@customTypes/art";

interface Artwork {
  [key: string]: Art;
}

export default function Gallery() {
  const { collectionId } = useParams();
  const allCollections = useContext(CollectionsContext);
  const currentCollection =
    allCollections && collectionId ? allCollections[collectionId] : null;

  const { pathname } = useLocation();
  const user = useContext(UserContext);
  const inDashboard = pathname.includes("dashboard");
  let editing = false;

  if (user && inDashboard) {
    editing = true;
  }

  const [modalVisible, setModalVisible] = useState(false);

  const toggleModalVisible = () => {
    setModalVisible(!modalVisible);
  };

  const [art, setArt] = useState<null | Artwork>(null);

  useEffect(() => {
    const collectionsQuery = query(collection(database, "art"), where('collection', '==', collectionId));
    const unsubscribe = onSnapshot(collectionsQuery, (querySnapshot) => {
      const artwork: Artwork = {};
      querySnapshot.forEach((docu) => {
        const data = docu.data() as Art;
        artwork[docu.id] = data;
      });
      setArt(artwork);
    });
    return () => {
      unsubscribe();
    };
  }, [collectionId]);

  const addArtButton = (
    <div>
      <button
        className="mt-4 rounded border-2 border-gray-800 bg-purple-300 p-1"
        onClick={toggleModalVisible}
        type="button"
      >
        + add art
      </button>
    </div>
  );

  const displayArt = () => {
    if (art) {
      const artIds = Object.keys(art);
      if (artIds.length) {
        return artIds.map((artId) => {
          const currentArt = art[artId];
          return (
            <ShowArt art={currentArt} key={artId}/>
          );
        });
      }
      return (
        <div>No art in this collection.</div>
      );
    }
    return null;
  };

  if (currentCollection) {
    return (
      <div>
        {modalVisible ? <Blur /> : null}
        <NewArt
          collectionId={collectionId}
          modalVisible={modalVisible}
          toggleModalVisible={toggleModalVisible}
        />
        {currentCollection.name.toUpperCase()}
        {editing ? addArtButton : null}
        <div className="flex flex-wrap gap-4">
          {displayArt()}
        </div>
      </div>
    );
  }
  return <div>Invalid collection</div>;
}
