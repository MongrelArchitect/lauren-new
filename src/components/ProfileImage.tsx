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
      <div className="relative min-h-[200px] min-w-[200px] border-2 border-red-300">
        {loading ? <Loading overlay /> : null}
        <img
          alt={image.description}
          className="max-h-[600px]"
          onLoad={() => {
            setLoading(false);
          }}
          src={image.imageURL}
        />
      </div>
    </div>
  );
}
