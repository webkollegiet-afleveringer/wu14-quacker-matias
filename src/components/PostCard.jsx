import "./PostCard.scss";

function getHoursAgo(createdAt) {
  if (!createdAt) {
    return "0h";
  }

  let createdDate;

  if (typeof createdAt?.toDate === "function") {
    createdDate = createdAt.toDate();
  } else if (typeof createdAt === "number") {
    createdDate = new Date(createdAt);
  } else if (
    typeof createdAt === "object" &&
    typeof createdAt?.seconds === "number"
  ) {
    createdDate = new Date(createdAt.seconds * 1000);
  } else {
    createdDate = new Date(createdAt);
  }

  if (Number.isNaN(createdDate.getTime())) {
    return "0h";
  }

  const diffMs = Date.now() - createdDate.getTime();
  const hours = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60)));

  if (hours >= 24) {
    return `${Math.floor(hours / 24)}d`;
  }

  return `${hours}h`;
}

export default function PostCard({ post }) {
  return (
    <figure className="post-card">
        <div className="post-card__pfp"></div>
      <figcaption className="post-card__content">
        <h3 className="post-card__content__username">{post.username} <span className="post-card__content__username__time">{getHoursAgo(post.createdAt)}</span></h3>
        <p className="post-card__content__text">{post.content}</p>
      </figcaption>
    </figure>
  );
}
