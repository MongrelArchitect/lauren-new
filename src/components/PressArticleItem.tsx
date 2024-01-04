import { Link } from "react-router-dom";
import PressArticle from "@customTypes/pressArticles";

interface Props {
  article: PressArticle;
}

export default function PressArticleItem({ article }: Props) {
  return (
    <div>
      <Link className="text-red-600 underline" target="_blank" to={article.url}>
        {`${article.year} - ${article.publication}, "${article.title}"`}
      </Link>
    </div>
  );
}
