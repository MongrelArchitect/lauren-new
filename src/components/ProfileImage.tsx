import ImageInfo from "@customTypes/profile";
import EditProfileImage from "./EditProfileImage";

interface Props {
  image: ImageInfo;
  inDashboard: boolean;
}

export default function ProfileImage({ image, inDashboard }: Props) {
  return (
    <>
      {inDashboard ? <EditProfileImage imageURL={image.imageURL} /> : null}
      <img
        alt={image.description}
        className="max-h-[600px]"
        src={image.imageURL}
      />
    </>
  );
}
