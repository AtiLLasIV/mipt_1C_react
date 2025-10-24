import {useEffect, useState} from "react";
import {getArticles} from "./helpers/get-articles";
import Card from "./components/Card";
import "./App.css";

function App() {
  const [articles, setArticles] = useState(null);

  useEffect(() => {
    getArticles().then(setArticles);
  }, []);

  return (
    <div className="box">
      {articles.map((post, id) => (
        <Card key={id} post={post}/>
      ))}
    </div>
  );
}

export default App;
