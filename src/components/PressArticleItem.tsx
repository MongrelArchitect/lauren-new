import { Link } from "react-router-dom";
import PressArticle from "@customTypes/pressArticles";
import EditArticle from "./EditArticle";

interface Props {
  article: PressArticle;
  articleId: string;
  inDashboard: boolean;
}

export default function PressArticleItem({ article, articleId, inDashboard }: Props) {
  return (
    <>
      <li className="flex items-center gap-4">
        {inDashboard ? <EditArticle article={article} articleId={articleId} /> : null}
        <div className="flex flex-wrap gap-1">
          <div>{`${article.year} - ${article.publication}`}</div>
          <Link
            className="text-brand-red underline"
            target="_blank"
            to={article.url}
          >
            {`"${article.title}"`}
          </Link>
        </div>
      </li>
    </>
  );
}
