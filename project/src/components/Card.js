import { useState } from "react";
import './Card.css';

export default function Card({ post }) {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.currentLikes);

  const toggleLike = () => {
    if (liked) {
      setLikesCount(likesCount - 1);
    } else {
      setLikesCount(likesCount + 1);
    }
    setLiked(!liked);
  };

  return (
    <div className="card" >
      <h2>{post.title}</h2>
      <p>{post.text}</p>

      <div className="like-info">
        <button
          className={liked ? "liked-btn" : "no-liked-btn"}
          onClick={toggleLike} >
          Like
        </button>
        <span>Likes: {likesCount}</span>
      </div>
    </div>
  );


}
