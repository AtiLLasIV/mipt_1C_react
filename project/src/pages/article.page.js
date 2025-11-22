import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Card from "../components/Card";

export default function ArticlePage() {
  const { articleId } = useParams();

  const article = useSelector((state) =>
    state.articles.list.find(
      (item) => String(item.articleId) === String(articleId)
    )
  );

  if (!article) {
    return (
        <p>Not found</p>
    );
  }

  return (
      <Card post={article} />
  );
}