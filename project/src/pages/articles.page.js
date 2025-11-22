import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";

import { ActionTypes } from "../store/constants";
import styles from "./ArticlesPage.module.scss";

export default function ArticlesPage() {
  const dispatch = useDispatch();
  const articles = useSelector((state) => state.articles.list);

  const [activeSort, setActiveSort] = useState(null);

  const sortByDate = () => {
    dispatch({
      type: ActionTypes.SET_ARTICLES,
      payload: [...articles].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      ),
    });
    setActiveSort("date");
  };

  const sortByLikes = () => {
    dispatch({
      type: ActionTypes.SET_ARTICLES,
      payload: [...articles].sort(
        (a, b) => b.currentLikes - a.currentLikes
      ),
    });
    setActiveSort("likes");
  };

  const truncate = (text, maxLen = 100) =>
    text.length > maxLen ? text.slice(0, maxLen) + "…" : text;

  return (
    <div className={styles.wrapper}>
      <h1>Articles</h1>

      <div className={styles.sortPanel}>
        <button
          onClick={sortByDate}
          className={`${styles.sortBtn} ${
            activeSort === "date" ? styles.sortBtnActive : ""
          }`}
        >
          Sort by date
        </button>

        <button
          onClick={sortByLikes}
          className={`${styles.sortBtn} ${
            activeSort === "likes" ? styles.sortBtnActive : ""
          }`}
        >
          Sort by likes
        </button>
      </div>

      <div className={styles.list}>
        {articles.map((post) => (
          <div key={post.articleId} className={styles.previewCard}>
            <h2>
              <Link to={`/articles/${post.articleId}`}>{post.title}</Link>
            </h2>
            <p>{truncate(post.text)}</p>
            <p>
              Likes: {post.currentLikes} Comments: {post.commentsCount}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}