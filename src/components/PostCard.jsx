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
  const displayName = post.displayName || post.username || "Anonymous";
  const username = post.username || "";

  const avatarSrc = post.photoURL || "";

  return (
    <figure className="post-card">
      {avatarSrc ? (
        <img className="post-card__pfp" src={avatarSrc} alt="Profile" />
      ) : (
        <div
          className="post-card__pfp post-card__pfp--fallback"
          aria-hidden="true"
        />
      )}
      <figcaption className="post-card__content">
        <h3 className="post-card__content__username">
          {displayName}
          <span className="post-card__content__username__handle">
            @{username}
          </span>
          <span className="post-card__content__username__time">
            {getHoursAgo(post.createdAt)}
          </span>
        </h3>
        <p className="post-card__content__text">{post.content}</p>
      </figcaption>
    </figure>
  );
}
