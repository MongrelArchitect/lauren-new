import EditBio from "./EditBio";

interface Props {
  bio: null | string;
  inDashboard: boolean;
}

export default function Bio({ bio, inDashboard }: Props) {
  if (bio) {
    return (
      <>
        {inDashboard ? <EditBio bio={bio} /> : null}
        <pre className="whitespace-pre-wrap font-sans">{bio}</pre>
      </>
    );
  }

  return null;
}
