import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { doc, onSnapshot } from "firebase/firestore";
import { database } from "@util/firebase";
import HomeImageItem from "@customTypes/homeImage";

import EditHomeImage from "./EditHomeImage";
import Loading from "./Loading";

export default function HomeImage() {
  const { pathname } = useLocation();
  const inDashboard = pathname.includes("dashboard");

  const [image, setImage] = useState<null | HomeImageItem>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubImage = onSnapshot(
      doc(database, "homepage", "image"),
      (docu) => {
        setLoading(true);
        if (docu.data()) {
          const data = docu.data() as HomeImageItem;
          setImage(data);
        } else {
          setImage(null);
        }
        setLoading(false);
      },
    );
    return () => {
      unsubImage();
    };
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (image) {
    return (
      <div>
        {inDashboard ? <EditHomeImage imageURL={image.imageURL} /> : null}
        <img alt="" className="w-full max-w-[900px]" src={image.imageURL} />
      </div>
    );
  }
  return null;
}
