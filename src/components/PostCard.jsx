import "./PostCard.scss";
export default function PostCard({ post }) {
  return (
    <figure className="post-card">
        <div className="post-card__pfp"></div>
      <figcaption className="post-card__content">
        <h3 className="post-card__content__username">{post.username}</h3>
        <p className="post-card__content__text">{post.content}</p>
      </figcaption>
    </figure>
  );
}
