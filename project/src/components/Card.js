import {useState, useEffect} from "react";
import {getComments} from "../helpers/get-comments-by-article";
import styles from "./Card.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

export default function Card({post}) {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.currentLikes);

  const [comments, setComments] = useState([]);
  const [commentsOpen, setCommentsOpen] = useState(false);

  const [authorInput, setAuthorInput] = useState("");
  const [textInput, setTextInput] = useState("");

  const [editTitleOpen, setEditTitleOpen] = useState(false);
  const [editTextOpen, setEditTextOpen] = useState(false);
  const [titleValue, setTitleValue] = useState(post.title);
  const [textValue, setTextValue] = useState(post.text);

  const [editIndex, setEditIndex] = useState(null);
  const [editCommentText, setEditCommentText] = useState("");

  const toggleLike = () => {
    setLiked((prev) => !prev);
    setLikesCount((c) => (liked ? c - 1 : c + 1));
  };

  const toggleComments = () => {
    setCommentsOpen((prev) => !prev);
  };

  useEffect(() => {
    if (!commentsOpen) return;

    getComments(post.articleId).then((data) =>
      setComments(
        data.map((c) => ({
          ...c,
          isLiked: false,
          createdAt: c.createdAt || new Date().toISOString(),
          likes: typeof c.likes === "number" ? c.likes : 0,
        }))
      )
    );
  }, [commentsOpen, post.articleId]);

  const addComment = () => {
    const author = authorInput.trim();
    const text = textInput.trim();
    if (!author || !text) return;

    const newComment = {
      author,
      text,
      articleId: post.articleId,
      createdAt: new Date().toISOString(),
      likes: 0,
      isLiked: false,
    };

    setComments((prev) => [...prev, newComment]);
    post.commentsCount += 1;

    setAuthorInput("");
    setTextInput("");
  };

  const likeComment = (idx) => {
    setComments((prev) =>
      prev.map((item, i) =>
        i === idx
          ? {
              ...item,
              likes: item.isLiked ? item.likes - 1 : item.likes + 1,
              isLiked: !item.isLiked,
            }
          : item
      )
    );
  };

  const deleteComment = (idx) => {
    post.commentsCount -= 1;
    setComments((prev) => prev.filter((_, i) => i !== idx));
    if (editIndex === idx) {
      setEditIndex(null);
      setEditCommentText("");
    }
  };

  const saveEditedComment = (idx) => {
    const text = editCommentText.trim();
    if (!text) return;

    setComments((prev) =>
      prev.map((c, i) => (i === idx ? {...c, text} : c))
    );

    setEditIndex(null);
    setEditCommentText("");
  };

  const sortCommentsByDate = () => {
    setComments((prev) =>
      [...prev].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      )
    );
  };

  const sortCommentsByLikes = () => {
    setComments((prev) => [...prev].sort((a, b) => b.likes - a.likes));
  };

  const commentsCount = commentsOpen ? comments.length : post.commentsCount;

  const articleDate = post.createdAt ? new Date(post.createdAt) : null;
  const articleDateText =
    articleDate && !Number.isNaN(articleDate.getTime())
      ? articleDate.toLocaleString()
      : "Unknown date";

  return (
    <div className={styles.card}>
      {editTitleOpen ? (
        <div className={styles.editRow}>
          <input
            className={styles.editInput}
            value={titleValue}
            onChange={(e) => setTitleValue(e.target.value)}
          />
          <button
            className={styles.editBtn}
            onClick={() => setEditTitleOpen(false)}
          >
            Save
          </button>
        </div>
      ) : (
        <div className={styles.headerRow}>
          <h2>{titleValue}</h2>
          <button
            className={styles.editBtn}
            onClick={() => setEditTitleOpen(true)}
          >
            Edit title
          </button>
        </div>
      )}

      <p className={styles.articleMeta}>Created: {articleDateText}</p>

      {editTextOpen ? (
        <div className={styles.editRow}>
          <input
            className={styles.editInput}
            value={textValue}
            onChange={(e) => setTextValue(e.target.value)}
          />
          <button
            className={styles.editBtn}
            onClick={() => setEditTextOpen(false)}
          >
            Save
          </button>
        </div>
      ) : (
        <div className={styles.textRow}>
          <p>{textValue}</p>
          <button
            className={styles.editBtn}
            onClick={() => setEditTextOpen(true)}
          >
            Edit text
          </button>
        </div>
      )}

      <div className={styles.likeInfo}>
        <button
          className={cx({
            likedBtn: liked,
            noLikedBtn: !liked,
          })}
          onClick={toggleLike}
        >
          Like
        </button>
        <span>Likes: {likesCount}</span>
        <span>Comments: {commentsCount}</span>
      </div>

      <div className={styles.commentsSection}>
        <button
          className={cx({
            commentsBtn: !commentsOpen,
            commentsBtnOpen: commentsOpen,
          })}
          onClick={toggleComments}
        >
          {commentsOpen ? "Hide comments" : "Open comments"}
        </button>

        {commentsOpen && (
          <div className={styles.commentsList}>
            <div className={styles.sortButtons}>
              <button onClick={sortCommentsByDate}>Sort by date</button>
              <button onClick={sortCommentsByLikes}>Sort by likes</button>
            </div>

            {comments.length === 0 ? (
              <p>No comments</p>
            ) : (
              comments.map((item, i) => (
                <div key={i} className={styles.commentItem}>
                  <div className={styles.commentMain}>
                    {editIndex === i ? (
                      <div className={styles.editRow}>
                        <input
                          className={styles.editInput}
                          value={editCommentText}
                          onChange={(e) =>
                            setEditCommentText(e.target.value)
                          }
                        />
                        <button
                          className={styles.editBtn}
                          onClick={() => saveEditedComment(i)}
                        >
                          Save
                        </button>
                        <button
                          className={styles.editCancelBtn}
                          onClick={() => {
                            setEditIndex(null);
                            setEditCommentText("");
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <>
                        <p>
                          <b>{item.author}:</b> {item.text}
                        </p>
                        <p className={styles.commentMeta}>
                          Created:{" "}
                          {new Date(item.createdAt).toLocaleString()}
                        </p>
                      </>
                    )}
                  </div>

                  <div className={styles.commentActions}>
                    <span>Likes: {item.likes}</span>
                    <button
                      onClick={() => likeComment(i)}
                      className={cx({
                        commentLikeBtn: true,
                        likedCommentBtn: item.isLiked,
                      })}
                    >
                      Like
                    </button>
                    <button
                      className={styles.editBtn}
                      onClick={() => {
                        setEditIndex(i);
                        setEditCommentText(item.text);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => deleteComment(i)}
                    >
                      Delete
                    </button>
                  </div>
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