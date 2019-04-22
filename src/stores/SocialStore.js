import { EventEmitter } from "events";

import dispatcher from "../dispatcher";

class SocialStore extends EventEmitter {
  constructor() {
    super()
    this.social =  {};
  }


  like(data){
    console.log(data);
    this.social =  {};
    this.social['action'] = 'Like'
    this.social['likes'] = data.likes;
    this.social['liked'] = data.liked;
    this.social['uuid'] = data.uuid;
    this.emit("social_event");
  }

  bookmark(data){
    console.log(data);
    this.social =  {};
    this.social['action'] = 'Bookmark'
    this.social['bookmarks'] = data.bookmarks;
    this.social['bookmarked'] = data.bookmarked;
    this.social['uuid'] = data.uuid;
    this.emit("social_event");
  }

  follow(data){
    console.log(data);
    this.social =  {};
    this.social['action'] = 'Follow'
    this.social['follows'] = data.follows;
    this.social['followed'] = data.followed;
    this.social['uuid'] = data.uuid;
    this.emit("social_event");
  }



  getSocial() {
    return this.social
  }


  handleActions(action) {
    switch(action.type) {
      case "LIKE": {
        this.like(action.data);
        break;
      }
      case "BOOKMARK": {
        this.bookmark(action.data);
        break;
      }
      case "FOLLOW": {
        this.follow(action.data);
        break;
      }
    }
  }
}


const socialStore = new SocialStore;
dispatcher.register(socialStore.handleActions.bind(socialStore));

export default socialStore;
