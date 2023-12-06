import { useContext, useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { collection, onSnapshot, query, where } from "firebase/firestore";

import { database } from "@util/firebase";

import { CollectionsContext } from "@contexts/collections";

import ArtDetail from "@components/ArtDetail";
import ArtThumb from "@components/ArtThumb";
import Blur from "@components/Blur";
import Loading from "@components/Loading";
import NewArt from "@components/NewArt";

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
  const inDashboard = pathname.includes("dashboard");

  const [modalVisible, setModalVisible] = useState(false);

  const [art, setArt] = useState<null | Artwork>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const collectionsQuery = query(
      collection(database, "art"),
      where("collection", "==", collectionId),
    );
    const unsubscribe = onSnapshot(collectionsQuery, (querySnapshot) => {
      const artwork: Artwork = {};
      querySnapshot.forEach((docu) => {
        const data = docu.data() as Art;
        artwork[docu.id] = data;
      });
      setArt(artwork);
      setLoading(false);
    });
    return () => {
      unsubscribe();
    };
  }, [collectionId]);

  const [addingArt, setAddingArt] = useState(false);

  const toggleAddingArt = () => {
    setModalVisible(!modalVisible);
    setAddingArt(!addingArt);
  };

  const addArtButton = (
    <div>
      <button
        className="mt-4 rounded border-2 border-gray-800 bg-purple-300 p-1"
        onClick={toggleAddingArt}
        type="button"
      >
        + add art
      </button>
    </div>
  );

  const [artDetail, setArtDetail] = useState<null | Art>(null);
  const [editingArt, setEditingArt] = useState(false);

  const displayThumbs = () => {
    if (art) {
      const artIds = Object.keys(art);
      if (artIds.length) {
        return artIds.map((artId) => {
          const currentArt = art[artId];
          return (
            <ArtThumb
              art={currentArt}
              inDashboard={inDashboard}
              key={artId}
              setArtDetail={setArtDetail}
              setModalVisible={setModalVisible}
              setEditingArt={setEditingArt}
            />
          );
        });
      }
      return <div>No art in this collection.</div>;
    }
    return null;
  };

  const closeArtDetail = () => {
    setArtDetail(null);
    setEditingArt(false);
    setModalVisible(false);
  };

  if (loading) {
    return (
      <Loading />
    );
  }

  if (currentCollection) {
    return (
      <div>
        {modalVisible ? <Blur /> : null}
        <NewArt
          addingArt={addingArt}
          collectionId={collectionId}
          toggleAddingArt={toggleAddingArt}
        />
        <ArtDetail
          artDetail={artDetail}
          editingArt={editingArt}
          closeArtDetail={closeArtDetail}
        />
        {currentCollection.name.toUpperCase()}
        {inDashboard ? addArtButton : null}
        <div className="flex flex-wrap gap-4">{displayThumbs()}</div>
      </div>
    );
  }
  return <div>Invalid collection</div>;
}
