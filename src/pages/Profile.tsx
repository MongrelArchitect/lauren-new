import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { collection, onSnapshot, query } from "firebase/firestore";
import { database } from "@util/firebase";

import Bio from "@components/Bio";
import Loading from "@components/Loading";

import Exhibitions, { Exhibition } from "@customTypes/exhibitions";
import ImageInfo from "@customTypes/profile";

export default function Profile() {
  const { pathname } = useLocation();
  const inDashboard = pathname.includes("dashboard");

  const [bio, setBio] = useState<null | string>(null);
  const [image, setImage] = useState<null | ImageInfo>(null);
  const [exhibitions, setExhibitions] = useState<null | Exhibitions>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const profileQuery = query(collection(database, "profile"));
    const unsubProfile = onSnapshot(profileQuery, (querySnapshot) => {
      setLoading(true);
      querySnapshot.forEach((docu) => {
        if (docu.id === "bio") {
          const bioInfo: string = docu.data().info;
          setBio(bioInfo);
        }
        if (docu.id === "image") {
          const imageInfo = docu.data() as ImageInfo;
          setImage(imageInfo);
        }
      });
      setLoading(false);
    });
    const exhibitionsQuery = query(collection(database, "exhibitions"));
    const unsubExhibitions = onSnapshot(exhibitionsQuery, (querySnapshot) => {
      setLoading(true);
      const rawExhibitions: Exhibitions = {};
      querySnapshot.forEach((docu) => {
        const data = docu.data() as Exhibition;
        rawExhibitions[docu.id] = data;
        setExhibitions(rawExhibitions);
      });
      setLoading(false);
    });
    return () => {
      unsubProfile();
      unsubExhibitions();
    };
  }, []);

  if (loading) {
    return <Loading />;
  }

  const displayImage = () => {
    if (image) {
      return <img alt={image.description} src={image.imageURL} />;
    }
    return null;
  };

  const displayExhibitions = () => {
    if (exhibitions) {
      const exhibitionIds = Object.keys(exhibitions);
      return (
        <ul>
          <h2>Selected Exhibitions</h2>
          {exhibitionIds.map((exhibitionId) => {
            const current = exhibitions[exhibitionId];
            return (
              <li key={exhibitionId}>
                {`${current.year} - "${current.title}" (${current.gallery}, ${current.location})`}
              </li>
            );
          })}
        </ul>
      );
    }
    return null;
  };

  return (
    <div>
      <h1>PROFILE</h1>
      {displayImage()}
      <Bio bio={bio} inDashboard={inDashboard} />
      {displayExhibitions()}
    </div>
  );
}
