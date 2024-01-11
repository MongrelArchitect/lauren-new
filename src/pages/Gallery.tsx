import { useContext, useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { collection, onSnapshot, query, where } from "firebase/firestore";

import { database } from "@util/firebase";

import { CollectionsContext } from "@contexts/collections";

import ArtDetail from "@components/ArtDetail";
import ArtThumb from "@components/ArtThumb";
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
        const data = docu.data();
        const artInfo: Art = {
          added: data.added.toDate(),
          collection: data.collection,
          imagePath: data.imagePath,
          imageURL: data.imageURL,
          medium: data.medium,
          size: data.size,
          sold: data.sold,
          thumbPath: data.thumbPath,
          thumbURL: data.thumbURL,
          title: data.title,
        };
        artwork[docu.id] = artInfo;
      });
      setArt(artwork);
      setLoading(false);
    });
    return () => {
      unsubscribe();
    };
  }, [collectionId]);


  const [artDetail, setArtDetail] = useState<null | Art>(null);
  const [editingArt, setEditingArt] = useState(false);

  const displayThumbs = () => {
    if (art) {
      const artIds = Object.keys(art).sort((a, b) => {
        // sort by added timestamp
        return (
          art[b].added.getTime() - art[a].added.getTime()
        );
      });
      console.log(art);
      if (artIds.length) {
        return artIds.map((artId) => {
          const currentArt = art[artId];
          return (
            <ArtThumb
              art={currentArt}
              inDashboard={inDashboard}
              key={artId}
              setArtDetail={setArtDetail}
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
  };

  if (loading) {
    return (
      <Loading />
    );
  }

  if (currentCollection) {
    return (
      <div>
        {currentCollection.name.toUpperCase()}
        {inDashboard ? 
          <NewArt
            collectionId={collectionId}
          />
        : null}
        <ArtDetail
          artDetail={artDetail}
          editingArt={editingArt}
          closeArtDetail={closeArtDetail}
        />
        <div className="flex flex-wrap gap-4">{displayThumbs()}</div>
      </div>
    );
  }
  return <div>Invalid collection</div>;
}
