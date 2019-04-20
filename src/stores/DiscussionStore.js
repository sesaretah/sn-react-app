import { EventEmitter } from "events";

import dispatcher from "../dispatcher";

class DiscussionStore extends EventEmitter {
  constructor() {
    super()
    this.discussions = [];
    this.comments = [];
  }

  showDiscussions(data){
    this.discussions = [];
    for (var i = 0, len = data.discussions.length; i < len; ++i) {
      this.discussions.push(data.discussions[i]);
    }

    this.emit("show_discussions");
  }

  showDiscussion(data){
    console.log(data);
    this.comments = [];
    for (var i = 0, len = data.comments.length; i < len; ++i) {
      this.comments.push(data.comments[i]);
    }
    this.discussions.push(data.discussion);
    this.emit("show_discussion");
  }



  getAll() {
    return this.discussions
  }

  getComments() {
    return this.comments
  }

  handleActions(action) {
    switch(action.type) {
      case "SHOW_DISCUSSIONS": {
        this.showDiscussions(action.data);
        break;
      }
      case "SHOW_DISCUSSION": {
        this.showDiscussion(action.data);
        break;
      }
    }
  }
}


const discussionStore = new DiscussionStore;
dispatcher.register(discussionStore.handleActions.bind(discussionStore));

export default discussionStore;
