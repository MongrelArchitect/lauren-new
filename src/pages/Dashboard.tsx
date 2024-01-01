import { useContext, useEffect } from "react";
import { useNavigate, Link, Outlet } from "react-router-dom";

import { CollectionsContext } from "@contexts/collections";
import { UserContext } from "@contexts/users";

import Blur from "@components/Blur";
import NewCollection from "@components/NewCollection";

export default function Dashboard() {

  const user = useContext(UserContext);

  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

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
              <li key={collectionId}>
                <Link to={`/dashboard/art/${collectionId}`}>
                  {currentCollection.name.toUpperCase()}
                </Link>
              </li>
            );
          })}
        </ul>
      );
    }
    return <div>No collections. Add some!</div>;
  };

  return (
    <main className="grid grid-rows-[auto_1fr] gap-4 bg-green-200 sm:grid-cols-[auto_1fr]">
      <div className="flex flex-col">
        <h2>Welcome {user ? user.name : null}!</h2>
        <h2>Menu</h2>
        <h3>Collections</h3>
        {displayCollections()}
        <NewCollection />
        <Link to="/dashboard/profile">Profile</Link>
      </div>
      <Outlet />
    </main>
  );
}
