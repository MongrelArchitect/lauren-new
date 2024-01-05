import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { collection, onSnapshot, query } from "firebase/firestore";
import { database } from "@util/firebase";

import Loading from "./Loading";
import NewPressArticle from "./NewPressArticle";
import PressArticle from "@customTypes/pressArticles";
import PressArticleItem from "./PressArticleItem";

interface PressArticles {
  [key: string]: PressArticle;
}

export default function PressArticles() {
  const { pathname } = useLocation();
  const inDashboard = pathname.includes("dashboard");

  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState<null | PressArticles>(null);

  useEffect(() => {
    const articlesQuery = query(collection(database, "press-articles"));
    const unsubArticles = onSnapshot(articlesQuery, (querySnapshot) => {
      setLoading(true);
      const articlesFromDB: PressArticles = {};
      querySnapshot.forEach((docu) => {
        const articleInfo: PressArticle = {
          added: docu.data().added.toDate(),
          publication: docu.data().publication,
          title: docu.data().title,
          url: docu.data().url,
          year: docu.data().year,
        };
        articlesFromDB[docu.id] = articleInfo;
      });
      // only set to the temp object if there's any videos from the db
      if (Object.keys(articlesFromDB).length) {
        setArticles(articlesFromDB);
      }
      setLoading(false);
    });
    return () => {
      unsubArticles();
    };
  }, []);

  const displayArticles = () => {
    if (!articles) {
      return <div>No articles available</div>;
    }
    const articleIds = Object.keys(articles).sort((a, b) => {
      // sort by year, then by added timestamp
      return (
        articles[b].year - articles[a].year ||
        articles[b].added.getTime() - articles[a].added.getTime()
      );
    });
    return (
      <ul className="flex flex-col gap-3">
        {articleIds.map((articleId) => {
          return (
            <PressArticleItem
              key={articleId}
              articleId={articleId}
              article={articles[articleId]}
              inDashboard={inDashboard}
            />
          );
        })}
      </ul>
    );
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <h2>Articles</h2>
      {inDashboard ? <NewPressArticle /> : null}
      {displayArticles()}
    </div>
  );
}
