import {useEffect, useState} from "react";
import {getArticles} from "./helpers/get-articles";
import Card from "./components/Card";
import styles from "./App.module.scss";

function App() {
  const [articles, setArticles] = useState([]);
  const [activeSort, setActiveSort] = useState(null);

  useEffect(() => {
    getArticles().then(setArticles);
  }, []);

  const sortByDate = () => {
    setArticles(prev =>
      [...prev].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      )
    );
    setActiveSort("date");
  };

  const sortByLikes = () => {
    setArticles(prev =>
      [...prev].sort((a, b) => b.currentLikes - a.currentLikes)
    );
    setActiveSort("likes");
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.sortPanel}>
        <button
          onClick={sortByDate}
          className={`${styles.sortBtn} ${
            activeSort === "date" ? styles.sortBtnActive : ""
          }`}>
          Sort by date
        </button>

        <button
          onClick={sortByLikes}
          className={`${styles.sortBtn} ${
            activeSort === "likes" ? styles.sortBtnActive : ""
          }`}>
          Sort by likes
        </button>
      </div>

      {articles.map(post => (
        <Card key={post.articleId} post={post} />
      ))}
    </div>
  );
}

export default App;