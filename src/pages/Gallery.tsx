import { useContext, useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { collection, onSnapshot, query, where } from "firebase/firestore";

import { database } from "@util/firebase";

import { CollectionsContext } from "@contexts/collections";

import ArtDetail from "@components/ArtDetail";
import ArtThumb from "@components/ArtThumb";
import DeleteCollection from "@components/DeleteCollection";
import Loading from "@components/Loading";
import NewArt from "@components/NewArt";

import AdjacentArt from "@customTypes/adjacent";
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
    document.title = `Lauren Mendelsohn-Bass | ${
      currentCollection ? currentCollection.name : "Gallery"
    }`;
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
          artId: data.artId,
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

  const [adjacent, setAdjacent] = useState<AdjacentArt>({
    next: null,
    prev: null,
  });
  const [artDetail, setArtDetail] = useState<null | Art>(null);
  const [editingArt, setEditingArt] = useState(false);

  const artIds = art
    ? Object.keys(art).sort((a, b) => {
        // sort by added timestamp
        return art[b].added.getTime() - art[a].added.getTime();
      })
    : null;

  const setAdjacentArt = (index: number) => {
    if (art && artIds && artIds.length) {
      switch (artIds.length) {
        case 1:
          // only one = no adjacent
          setAdjacent({
            next: null,
            prev: null,
          });
          break;
        case 2:
          // only two = next or prev based on index
          if (index === 0) {
            setAdjacent({
              next: art[artIds[1]],
              prev: null,
            });
          } else {
            setAdjacent({
              next: null,
              prev: art[artIds[0]],
            });
          }
          break;
        default:
          // 3 or more = determine based on sort order
          if (index === 0) {
            // first art
            setAdjacent({
              next: art[artIds[1]],
              prev: null,
            });
          } else if (index === artIds.length - 1) {
            // last art
            setAdjacent({
              next: null,
              prev: art[artIds[artIds.length - 2]],
            });
          } else {
            // somewhere in the middle
            setAdjacent({
              next: art[artIds[index + 1]],
              prev: art[artIds[index - 1]],
            });
          }
          break;
      }
    } else {
      setAdjacent({
        next: null,
        prev: null,
      });
    }
  };

  // whenver the chosen artwork changes, update the adjacent art
  useEffect(() => {
    if (artDetail && artDetail.artId && artIds) {
      setAdjacentArt(artIds.indexOf(artDetail.artId));
    }
  }, [artDetail]);

  const displayThumbs = () => {
    if (art) {
      if (artIds && artIds.length) {
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
    return <Loading />;
  }

  if (currentCollection) {
    return (
      <div className="flex w-full flex-col gap-2">
        <h1 className="bg-brand-red p-2 text-3xl text-brand-white">
          {currentCollection.name.toUpperCase()}
        </h1>
        {inDashboard ? (
          <div className="flex gap-2 flex-wrap">
            <NewArt collectionId={collectionId} />
            <DeleteCollection
              art={art}
              artCount={artIds ? artIds.length : 0}
              collection={currentCollection}
            />
          </div>
        ) : null}
        <ArtDetail
          adjacent={adjacent}
          artDetail={artDetail}
          editingArt={editingArt}
          closeArtDetail={closeArtDetail}
          setArtDetail={setArtDetail}
        />
        <div className="grid grid-cols-gallery justify-items-center gap-4">
          {displayThumbs()}
        </div>
      </div>
    );
  }
  return <div>Invalid collection</div>;
}
