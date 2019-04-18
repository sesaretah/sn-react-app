import { EventEmitter } from "events";

import dispatcher from "../dispatcher";

class ArticleStore extends EventEmitter {
  constructor() {
    super()
    this.articles = [];

  }

  showArticles(data){
    this.articles = [];
    for (var i = 0, len = data.articles.length; i < len; ++i) {
      this.articles.push(data.articles[i]);
    }

    this.emit("show_articles");
  }

  showArticle(data){
    this.articles = [];
    this.articles.push(data);
    this.emit("show_article");
  }



  getAll() {
    return this.articles
  }

  handleActions(action) {
    switch(action.type) {
      case "SHOW_ARTICLES": {
        this.showArticles(action.data);
        break;
      }
      case "SHOW_ARTICLE": {
        this.showArticle(action.article);
        break;
      }
    }
  }
}


const articleStore = new ArticleStore;
dispatcher.register(articleStore.handleActions.bind(articleStore));

export default articleStore;
