import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { collection, onSnapshot, query } from "firebase/firestore";
import { database } from "@util/firebase";

import PressVideo from "@customTypes/pressVideos";

import Loading from "./Loading";
import NewVideo from "./NewVideo";
import PressVideoItem from "./PressVideoItem";

import downIcon from "@assets/icons/down.svg";

interface PressVideos {
  [key: string]: PressVideo;
}

export default function PressVideos() {
  const { pathname } = useLocation();
  const inDashboard = pathname.includes("dashboard");

  const [loading, setLoading] = useState(true);
  const [videos, setVideos] = useState<null | PressVideos>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const videosQuery = query(collection(database, "press-videos"));
    const unsubVideos = onSnapshot(videosQuery, (querySnapshot) => {
      setLoading(true);
      const videosFromDB: PressVideos = {};
      if (!querySnapshot.empty) {
        querySnapshot.forEach((docu) => {
          const videoInfo: PressVideo = {
            added: docu.data().added.toDate(),
            url: docu.data().url,
          };
          videosFromDB[docu.id] = videoInfo;
        });
      } else {
        setVideos(null);
      }
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
      return <li>No videos available</li>;
    }
    const videoIds = Object.keys(videos).sort((a, b) => {
      return videos[b].added.getTime() - videos[a].added.getTime();
    });
    return videoIds.map((videoId) => {
      return (
        <PressVideoItem
          inDashboard={inDashboard}
          key={videoId}
          videoId={videoId}
          videoURL={videos[videoId].url}
        />
      );
    });
  };

  if (loading) {
    return <Loading />;
  }

  if (!videos) {
    return <div>{inDashboard ? <NewVideo /> : null}</div>;
  }

  const toggleVisible = () => {
    setVisible(!visible);
  };

  return (
    <div>
      {inDashboard ? <NewVideo /> : null}
      <button
        className={`${
          visible
            ? "bg-brand-red text-brand-white"
            : "bg-brand-gray text-brand-black"
        } flex w-full items-center justify-between gap-3 p-2`}
        onClick={toggleVisible}
        title={`${visible ? "hide" : "show"} videos`}
        type="button"
      >
        <h2 className="text-2xl">Videos</h2>
        <img
          alt=""
          className={`${
            visible ? "rotate-180 invert" : ""
          } h-[12px] transition-transform`}
          src={downIcon}
        />
      </button>
      <ul
        className={`${
          visible ? "max-h-[10000px]" : "max-h-0 overflow-hidden opacity-0"
        } flex flex-col p-2 gap-2 border-2 border-t-0 border-brand-red bg-brand-white font-sans text-xl transition-all`}
      >
        {displayVideos()}
      </ul>
    </div>
  );
}
