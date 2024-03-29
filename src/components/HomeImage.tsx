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
      <div className="flex min-h-[200px] flex-col items-start gap-2">
        {inDashboard ? <EditHomeImage imageURL={image.imageURL} /> : null}
        <div className="relative w-full min-h-[320px]">
          {loading ? <Loading overlay /> : null}
          <img
            alt=""
            className="w-full border-2 border-brand-red p-2"
            onLoad={() => {
              setLoading(false);
            }}
            src={image.imageURL}
          />
        </div>
      </div>
    );
  }
  return null;
}
