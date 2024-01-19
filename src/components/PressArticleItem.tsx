import { Link } from "react-router-dom";
import PressArticle from "@customTypes/pressArticles";
import EditArticle from "./EditArticle";

interface Props {
  article: PressArticle;
  articleId: string;
  articleIndex: number;
  inDashboard: boolean;
}

export default function PressArticleItem({
  article,
  articleId,
  articleIndex,
  inDashboard,
}: Props) {
  return (
    <>
      <li className="flex items-center gap-4">
        {inDashboard ? (
          <EditArticle article={article} articleId={articleId} />
        ) : null}
        <div
          className={`${
            articleIndex % 2 === 0 ? "bg-brand-white" : "bg-brand-gray"
          } flex w-full flex-wrap gap-3 p-2`}
        >
          <b>{article.year}</b>
          <span>{article.publication}</span>

          <i>
            <Link
              className="text-brand-red underline"
              target="_blank"
              to={article.url}
            >
              {article.title}
            </Link>
          </i>
        </div>
      </li>
    </>
  );
}
