import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { collection, onSnapshot, query } from "firebase/firestore";
import { database } from "@util/firebase";

import Bio from "@components/Bio";
import ExhibitionsList from "@components/Exhibitions";
import Loading from "@components/Loading";
import ProfileImage from "@components/ProfileImage";

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
        const data: Exhibition = {
          added: docu.data().added.toDate(),
          exhibitionId: docu.data().exhibitionId,
          gallery: docu.data().gallery,
          location: docu.data().location,
          title: docu.data().title,
          year: docu.data().year,
        };
        rawExhibitions[docu.id] = data;
      });
      setExhibitions(rawExhibitions);
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
      return <ProfileImage image={image} inDashboard={inDashboard} />;
    }
    return null;
  };

  const displayExhibitions = () => {
    if (exhibitions) {
      return (
        <ExhibitionsList exhibitions={exhibitions} inDashboard={inDashboard} />
      );
    }
    return null;
  };

  return (
    <div className="flex w-full flex-col gap-2">
      <h1 className="text-3xl">Profile</h1>
      {displayImage()}
      <Bio bio={bio} inDashboard={inDashboard} />
      {displayExhibitions()}
    </div>
  );
}
