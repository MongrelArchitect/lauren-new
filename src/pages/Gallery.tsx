import { useContext, useState } from "react";
import { useLocation, useParams } from "react-router-dom";

import { CollectionsContext } from "@contexts/collections";
import { UserContext } from "@contexts/users";

import Blur from "@components/Blur";
import NewArt from "@components/NewArt";

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
      </div>
    );
  }
  return <div>Invalid collection</div>;
}
