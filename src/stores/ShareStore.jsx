import { EventEmitter } from "events";

import dispatcher from "../dispatcher";

class ShareStore extends EventEmitter {
  constructor() {
    super()
    this.shares = [];

  }

  showShares(data){
    this.shares = [];
    for (var i = 0, len = data.shares.length; i < len; ++i) {
      this.shares.push(data.shares[i]);
    }

    this.emit("show_shares");
  }

  showShare(data){
    this.shares = [];
    this.shares.push(data.share);
    this.emit("show_share");
  }



  getAll() {
    return this.shares
  }

  handleActions(action) {
    switch(action.type) {
      case "SHOW_SHARES": {
        this.showShares(action.data);
        break;
      }
      case "SHOW_SHARE": {
        this.showShare(action.data);
        break;
      }
    }
  }
}


const shareStore = new ShareStore;
dispatcher.register(shareStore.handleActions.bind(shareStore));

export default shareStore;
