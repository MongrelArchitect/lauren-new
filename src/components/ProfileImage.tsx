import { useState } from "react";
import ImageInfo from "@customTypes/profile";
import EditProfileImage from "./EditProfileImage";
import Loading from "./Loading";

interface Props {
  image: ImageInfo;
  inDashboard: boolean;
}

export default function ProfileImage({ image, inDashboard }: Props) {
  const [loading, setLoading] = useState(true);

  return (
    <div className="flex flex-col items-start">
      {inDashboard ? <EditProfileImage imageURL={image.imageURL} /> : null}
      <div className="relative min-h-[200px] min-w-[200px]">
        {loading ? <Loading overlay /> : null}
        <img
          alt={image.description}
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
