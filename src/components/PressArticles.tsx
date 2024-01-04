import { useEffect, useState } from "react";
import { collection, onSnapshot, query } from "firebase/firestore";
import { database } from "@util/firebase";

import PressArticle from "@customTypes/pressArticles";
import PressArticleItem from "./PressArticleItem";

import Loading from "./Loading";

interface PressArticles {
  [key: string]: PressArticle;
}

export default function PressArticles() {
  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState<null | PressArticles>(null);

  useEffect(() => {
    const articlesQuery = query(collection(database, "press-articles"));
    const unsubArticles = onSnapshot(articlesQuery, (querySnapshot) => {
      setLoading(true);
      const articlesFromDB: PressArticles = {};
      querySnapshot.forEach((docu) => {
        const articleInfo: PressArticle = docu.data() as PressArticle;
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
    const articleIds = Object.keys(articles);
    return (
      <div>
        {articleIds.map((articleId) => {
          return (
            <PressArticleItem key={articleId} article={articles[articleId]} />
          );
        })}
      </div>
    );
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <h2>Articles</h2>
      {displayArticles()}
    </div>
  );
}
