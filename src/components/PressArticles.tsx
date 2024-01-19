import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { collection, onSnapshot, query } from "firebase/firestore";
import { database } from "@util/firebase";

import PressArticle from "@customTypes/pressArticles";

import Loading from "./Loading";
import NewPressArticle from "./NewPressArticle";
import PressArticleItem from "./PressArticleItem";

import downIcon from "@assets/icons/down.svg";

interface PressArticles {
  [key: string]: PressArticle;
}

export default function PressArticles() {
  const { pathname } = useLocation();
  const inDashboard = pathname.includes("dashboard");

  const [articles, setArticles] = useState<null | PressArticles>(null);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(true);

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
      <ul 
        className={`${
          visible ? "max-h-[10000px]" : "max-h-0 overflow-hidden opacity-0"
        } flex flex-col gap-2 border-2 border-t-0 border-brand-red bg-brand-white font-sans text-xl transition-all`}
      >
        {articleIds.map((articleId, index) => {
          return (
            <PressArticleItem
              key={articleId}
              articleId={articleId}
              articleIndex={index}
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

  const toggleVisible = () => {
    setVisible(!visible);
  };

  return (
    <div>
      {inDashboard ? <NewPressArticle /> : null}
      <button
        className={`${
          visible ? "bg-brand-red text-brand-white" : "bg-brand-gray text-brand-black"
        } flex w-full items-center justify-between gap-3 p-2`}
        onClick={toggleVisible}
        title={`${visible ? "hide" : "show"} articles`}
        type="button"
      >
        <h2 className="text-2xl">Articles</h2>
        <img
          alt="view / hide biographical info"
          className={`${
            visible ? "rotate-180 invert" : ""
          } h-[12px] transition-transform`}
          title="view / hide biographical info"
          src={downIcon}
        />
      </button>

      {displayArticles()}

    </div>
  );
}
