import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Routes, Route, Link, Navigate } from "react-router-dom";

import { getArticles } from "./helpers/get-articles";
import { ActionTypes } from "./store/constants";

import HomePage from "./pages/home.page";
import ArticlesPage from "./pages/articles.page";
import ArticlePage from "./pages/article.page";
import NotFoundPage from "./pages/notfound.page";

import styles from "./App.module.scss";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    getArticles().then((data) => {
      dispatch({
        type: ActionTypes.SET_ARTICLES,
        payload: data,
      });
    });
  }, [dispatch]);

  return (
      <div className={styles.wrapper}>
        <nav className={styles.nav}>
          <Link to="/" className={styles.navLink}>
            Home
          </Link>
          <Link to="/articles" className={styles.navLink}>
            Articles
          </Link>
        </nav>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/articles" element={<ArticlesPage />} />
          <Route path="/articles/:articleId" element={<ArticlePage />} />
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </div>
  );
}

export default App;