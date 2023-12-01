import { useContext, useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";

import { CollectionsContext } from "@contexts/collections";
import { UserContext } from "@contexts/users";

import Blur from "@components/Blur";
import NewCollection from "@components/NewCollection";

export default function Dashboard() {
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const user = useContext(UserContext);

  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const toggleNewCollection = () => {
    setModalVisible(!modalVisible);
  };

  const allCollections = useContext(CollectionsContext);

  const displayCollections = () => {
    if (allCollections) {
      const collectionIds = Object.keys(allCollections).sort((a, b) => {
        return allCollections[a].name.localeCompare(allCollections[b].name);
      });
      return (
        <ul>
          {collectionIds.map((collectionId) => {
            const currentCollection = allCollections[collectionId];
            return (
              <li key={collectionId}>{currentCollection.name.toUpperCase()}</li>
            );
          })}
        </ul>
      );
    }
    return <div>No collections. Add some!</div>;
  };

  return (
    <main className="grid grid-cols-[auto_1fr] gap-4 bg-green-200">
      {modalVisible ? <Blur /> : null}
      <NewCollection
        modalVisible={modalVisible}
        toggleNewCollection={toggleNewCollection}
      />
      <div>
        <h2>Menu</h2>
        {displayCollections()}
        <button
          className="mt-4 rounded border-2 border-gray-800 bg-purple-300 p-1"
          onClick={toggleNewCollection}
          type="button"
        >
          + New Collection
        </button>
      </div>
      <Outlet />
    </main>
  );
}
