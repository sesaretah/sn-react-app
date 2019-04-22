import { EventEmitter } from "events";

import dispatcher from "../dispatcher";

class StreamStore extends EventEmitter {
  constructor() {
    super()
    this.streams = [];
    this.user_streams = [];
    this.shares = [];
  }

  showStreams(data){
    this.streams = [];
    for (var i = 0, len = data.streams.length; i < len; ++i) {
      this.streams.push(data.streams[i]);
    }

    this.emit("show_streams");
  }

  showStream(data){
    this.streams = [];
    this.shares = [];
    this.streams.push(data.stream);
    for (var i = 0, len = data.shares.length; i < len; ++i) {
      this.shares.push(data.shares[i]);
    }
    this.emit("show_stream");
  }

  showUserStreams(data){
    console.log(data);
    this.user_streams = [];
    for (var i = 0, len = data.streams.length; i < len; ++i) {
      this.user_streams.push(data.streams[i]);
    }
    this.emit("show_user_streams");
  }



  getAll() {
    return this.streams
  }

  getShares() {
    return this.shares
  }

  getUserStreams() {
    return this.user_streams
  }

  handleActions(action) {
    switch(action.type) {
      case "SHOW_STREAMS": {
        this.showStreams(action.data);
        break;
      }
      case "SHOW_STREAM": {
        this.showStream(action.data);
        break;
      }
      case "SHOW_USER_STREAMS": {
        this.showUserStreams(action.data);
        break;
      }
    }
  }
}


const streamStore = new StreamStore;
dispatcher.register(streamStore.handleActions.bind(streamStore));

export default streamStore;
