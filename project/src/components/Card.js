import {useState, useEffect} from "react";
import {getComments} from "../helpers/get-comments-by-article";
import styles from "./Card.module.scss";

export default function Card({post}) {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.currentLikes);

  const [comments, setComments] = useState([]);
  const [commentsOpen, setCommentsOpen] = useState(false);

  const [authorInput, setAuthorInput] = useState("");
  const [textInput, setTextInput] = useState("");

  const toggleLike = () => {
    if (liked) {
      setLikesCount(likesCount - 1);
    } else {
      setLikesCount(likesCount + 1);
    }
    setLiked(!liked);
  };

  const toggleComments = () => {
    setCommentsOpen(!commentsOpen);
  };


  useEffect(() => {
    if (!commentsOpen) return;
    getComments(post.articleId)
      .then((data) => setComments(data));
  }, [commentsOpen, post.articleId]);


  const addComment = () => {
    const author = authorInput.trim();
    const text = textInput.trim();
    if (!author || !text) return;

    const newComment = {author, text, articleId: post.articleId};
    setComments((prev) => [...prev, newComment]);

    post.commentsCount += 1;
    setAuthorInput("");
    setTextInput("");
  };


  const deleteComment = (idx) => {
    post.commentsCount -= 1;
    setComments((prev) => prev.filter((_, i) => i !== idx));
  };


  const commentsCount = commentsOpen ? comments.length : post.commentsCount;

  return (
    <div className={styles.card}>
      <h2>{post.title}</h2>
      <p>{post.text}</p>

      <div className={styles.likeInfo}>
        <button
          className={liked ? styles.likedBtn : styles.noLikedBtn}
          onClick={toggleLike}>
          Like
        </button>
        <span>Likes: {likesCount}</span>
        <span>Comments: {commentsCount}</span>
      </div>

      <div className={styles.commentsSection}>
        <button className={styles.commentsBtn} onClick={toggleComments}>
          {commentsOpen ? "Hide comments" : "Open comments"}
        </button>

        {commentsOpen && (
          <div className={styles.commentsList}>
            {comments.length === 0 ? (
              <p>No comments</p>
            ) : (
              comments.map((item, i) => (
                <div key={i} className={styles.commentItem}>
                  <p>
                    <b>{item.author}:</b> {item.text}
                  </p>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => deleteComment(i)}
                  >
                    Delete
                  </button>
                </div>
              ))
            )}

            <div className={styles.addComment}>
              <input
                type="text"
                placeholder="Author"
                value={authorInput}
                onChange={(e) => setAuthorInput(e.target.value)}
              />
              <input
                type="text"
                placeholder="Comment text"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
              />
              <button className={styles.addBtn} onClick={addComment}>
                Add
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );


}
