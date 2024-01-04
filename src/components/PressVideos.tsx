import { useEffect, useState } from "react";
import { collection, onSnapshot, query } from "firebase/firestore";
import { database } from "@util/firebase";

import PressVideo from "@customTypes/pressVideos";
import PressVideoItem from "./PressVideoItem";

import Loading from "./Loading";

interface PressVideos {
  [key: string]: PressVideo;
}

export default function PressVideos() {
  const [loading, setLoading] = useState(true);
  const [videos, setVideos] = useState<null | PressVideos>(null);

  useEffect(() => {
    const videosQuery = query(collection(database, "press-videos"));
    const unsubVideos = onSnapshot(videosQuery, (querySnapshot) => {
      setLoading(true);
      const videosFromDB: PressVideos = {};
      querySnapshot.forEach((docu) => {
        const videoInfo: PressVideo = docu.data() as PressVideo;
        videosFromDB[docu.id] = videoInfo;
      });
      // only set to the temp object if there's any videos from the db
      if (Object.keys(videosFromDB).length) {
        setVideos(videosFromDB);
      }
      setLoading(false);
    });
    return () => {
      unsubVideos();
    };
  }, []);

  const displayVideos = () => {
    if (!videos) {
      return <div>No videos available</div>;
    }
    const videoIds = Object.keys(videos);
    return (
      <div>
        {videoIds.map((videoId) => {
          return (
            <PressVideoItem key={videoId} videoURL={videos[videoId].url} />
          );
        })}
      </div>
    );
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <h1>Press</h1>
      <h2>Videos</h2>
      {displayVideos()}
    </div>
  );
}
