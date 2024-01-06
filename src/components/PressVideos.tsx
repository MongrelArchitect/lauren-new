import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { collection, onSnapshot, query } from "firebase/firestore";
import { database } from "@util/firebase";

import PressVideo from "@customTypes/pressVideos";

import Loading from "./Loading";
import NewVideo from "./NewVideo";
import PressVideoItem from "./PressVideoItem";

interface PressVideos {
  [key: string]: PressVideo;
}

export default function PressVideos() {
  const { pathname } = useLocation();
  const inDashboard = pathname.includes("dashboard");

  const [loading, setLoading] = useState(true);
  const [videos, setVideos] = useState<null | PressVideos>(null);

  useEffect(() => {
    const videosQuery = query(collection(database, "press-videos"));
    const unsubVideos = onSnapshot(videosQuery, (querySnapshot) => {
      setLoading(true);
      const videosFromDB: PressVideos = {};
      querySnapshot.forEach((docu) => {
        const videoInfo: PressVideo = {
          added: docu.data().added.toDate(),
          url: docu.data().url,
        }
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
    const videoIds = Object.keys(videos).sort((a, b) => {
      return videos[b].added.getTime() - videos[a].added.getTime();
    });
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
      <h2>Videos</h2>
      {inDashboard ? <NewVideo /> : null}
      {displayVideos()}
    </div>
  );
}
