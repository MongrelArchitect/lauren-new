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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubImage = onSnapshot(
      doc(database, "homepage", "image"),
      (docu) => {
        if (docu.data()) {
          const data = docu.data() as HomeImageItem;
          setImage(data);
        } else {
          setImage(null);
        }
      },
    );
    return () => {
      unsubImage();
    };
  }, []);
  if (image) {
    return (
      <div className="min-h-[200px]">
        {loading ? <Loading overlay /> : null}
        {inDashboard ? <EditHomeImage imageURL={image.imageURL} /> : null}
        <img
          alt=""
          className="w-full border-[1px] border-brand-red p-2"
          onLoad={() => {
            setLoading(false);
          }}
          src={image.imageURL}
        />
      </div>
    );
  }
  return null;
}
