import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import classNames from "classnames/bind";

import { getComments } from "../helpers/get-comments-by-article";
import { ActionTypes } from "../store/constants";
import styles from "./Card.module.scss";

const cx = classNames.bind(styles);

export default function Card({ post, compact = false }) {
  const dispatch = useDispatch();

  const articleFromStore = useSelector((state) =>
    state.articles.list.find((item) => item.articleId === post.articleId)
  );

  const likesCount = articleFromStore?.currentLikes ?? post.currentLikes;
  const commentsBaseCount =
    articleFromStore?.commentsCount ?? post.commentsCount ?? 0;

  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentsOpen, setCommentsOpen] = useState(false);

  const [titleValue, setTitleValue] = useState(post.title);
  const [textValue, setTextValue] = useState(post.text);

  const [editTitle, setEditTitle] = useState(false);
  const [editText, setEditText] = useState(false);

  const [authorInput, setAuthorInput] = useState("");
  const [textInput, setTextInput] = useState("");

  const [editIndex, setEditIndex] = useState(null);
  const [editCommentText, setEditCommentText] = useState("");

  const toggleLike = () => {
    dispatch({
      type: ActionTypes.LIKE_ARTICLE,
      payload: { articleId: post.articleId, delta: liked ? -1 : 1 },
    });

    setLiked((p) => !p);
  };

  const toggleComments = () => {
    setCommentsOpen((p) => !p);
  };

  useEffect(() => {
    if (compact) return;
    if (!commentsOpen) return;

    getComments(post.articleId).then((data) =>
      setComments(
        data.map((c) => ({
          ...c,
          isLiked: false,
          likes: c.likes || 0,
          createdAt: c.createdAt || new Date().toISOString(),
        }))
      )
    );
  }, [compact, commentsOpen, post.articleId]);

  const updateCount = (n) => {
    dispatch({
      type: ActionTypes.SET_COMMENTS_COUNT,
      payload: { articleId: post.articleId, count: n },
    });
  };

  const addComment = () => {
    if (!authorInput.trim() || !textInput.trim()) return;

    const newComment = {
      author: authorInput.trim(),
      text: textInput.trim(),
      createdAt: new Date().toISOString(),
      likes: 0,
      isLiked: false,
    };

    setComments((prev) => {
      const next = [...prev, newComment];
      updateCount(next.length);
      return next;
    });

    setAuthorInput("");
    setTextInput("");
  };

  const likeComment = (idx) => {
    setComments((prev) =>
      prev.map((c, i) =>
        i === idx
          ? {
              ...c,
              likes: c.isLiked ? c.likes - 1 : c.likes + 1,
              isLiked: !c.isLiked,
            }
          : c
      )
    );
  };

  const deleteComment = (idx) => {
    setComments((prev) => {
      const next = prev.filter((_, i) => i !== idx);
      updateCount(next.length);
      return next;
    });

    if (idx === editIndex) {
      setEditIndex(null);
      setEditCommentText("");
    }
  };

  const saveEdited = (idx) => {
    if (!editCommentText.trim()) return;

    setComments((prev) =>
      prev.map((c, i) => (i === idx ? { ...c, text: editCommentText } : c))
    );

    setEditIndex(null);
    setEditCommentText("");
  };

  const sortByDate = () =>
    setComments((prev) =>
      [...prev].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      )
    );

  const sortByLikes = () =>
    setComments((prev) => [...prev].sort((a, b) => b.likes - a.likes));

  const commentsCount = commentsOpen ? comments.length : commentsBaseCount;

  const articleDate = new Date(post.createdAt).toLocaleString();

  return (
    <div className={styles.card}>
      {editTitle ? (
        <div className={styles.editRow}>
          <input
            className={styles.editInput}
            value={titleValue}
            onChange={(e) => setTitleValue(e.target.value)}
          />
          <button className={styles.editBtn} onClick={() => setEditTitle(false)}>
            Save
          </button>
        </div>
      ) : (
        <div className={styles.headerRow}>
          <h2>{titleValue}</h2>
          {!compact && (
            <button className={styles.editBtn} onClick={() => setEditTitle(true)}>
              Edit title
            </button>
          )}
        </div>
      )}

      <p className={styles.articleMeta}>Created: {articleDate}</p>

      {editText ? (
        <div className={styles.editRow}>
          <input
            className={styles.editInput}
            value={textValue}
            onChange={(e) => setTextValue(e.target.value)}
          />
          <button className={styles.editBtn} onClick={() => setEditText(false)}>
            Save
          </button>
        </div>
      ) : (
        <div className={styles.textRow}>
          <p>{textValue}</p>
          {!compact && (
            <button className={styles.editBtn} onClick={() => setEditText(true)}>
              Edit text
            </button>
          )}
        </div>
      )}

      {compact && (
        <Link className={styles.readMore} to={`/articles/${post.articleId}`}>
          Open article →
        </Link>
      )}

      <div className={styles.likeInfo}>
        <button
          className={cx({ likedBtn: liked, noLikedBtn: !liked })}
          onClick={toggleLike}
        >
          Like
        </button>
        <span>Likes: {likesCount}</span>
        <span>Comments: {commentsCount}</span>
      </div>

      {!compact && (
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
                <button className={styles.sortBtn} onClick={sortByDate}>
                  Sort by date
                </button>
                <button className={styles.sortBtn} onClick={sortByLikes}>
                  Sort by likes
                </button>
              </div>

              {comments.length === 0 ? (
                <p>No comments</p>
              ) : (
                comments.map((c, i) => (
                  <div key={i} className={styles.commentItem}>
                    {editIndex === i ? (
                      <div className={styles.editRow}>
                        <input
                          className={styles.editInput}
                          value={editCommentText}
                          onChange={(e) => setEditCommentText(e.target.value)}
                        />
                        <button
                          className={styles.editBtn}
                          onClick={() => saveEdited(i)}
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
                          <b>{c.author}:</b> {c.text}
                        </p>
                        <p className={styles.commentMeta}>
                          {new Date(c.createdAt).toLocaleString()}
                        </p>
                      </>
                    )}

                    <div className={styles.commentActions}>
                      <span>Likes: {c.likes}</span>
                      <button
                        className={cx({
                          commentLikeBtn: true,
                          likedCommentBtn: c.isLiked,
                        })}
                        onClick={() => likeComment(i)}
                      >
                        Like
                      </button>
                      <button
                        className={styles.editBtn}
                        onClick={() => {
                          setEditIndex(i);
                          setEditCommentText(c.text);
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
                  value={authorInput}
                  onChange={(e) => setAuthorInput(e.target.value)}
                  placeholder="Author"
                />
                <input
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Comment text"
                />
                <button className={styles.addBtn} onClick={addComment}>
                  Add
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}