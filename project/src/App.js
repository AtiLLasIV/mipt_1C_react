import {useEffect, useState} from "react";
import {getArticles} from "./helpers/get-articles";
import Card from "./components/Card";
import styles from "./App.module.scss";

function App() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    getArticles().then(setArticles);
  }, []);

  return (
    <div className={styles.wrapper}>
      {articles.map((post, id) => (
        <Card key={id} post={post} />
      ))}
    </div>
  );
}

export default App;
