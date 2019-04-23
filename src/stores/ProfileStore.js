import { EventEmitter } from "events";

import dispatcher from "../dispatcher";

class ProfileStore extends EventEmitter {
  constructor() {
    super()
    this.profiles = [];
    this.educations = []
  }

  showProfiles(data){
    this.profiles = [];
    for (var i = 0, len = data.profiles.length; i < len; ++i) {
      this.profiles.push(data.profiles[i]);
    }

    this.emit("show_profiles");
  }

  showProfile(data){
    console.log(data);
    this.profiles = [];
    this.profiles.push(data.profile);
    this.emit("show_profile");
  }

  showEducations(data){
    this.educations = [];
    for (var i = 0, len = data.educations.length; i < len; ++i) {
      this.educations.push(data.educations[i]);
    }
    this.emit("show_educations");
  }



  getAll() {
    return this.profiles
  }

  getEducations() {
    return this.educations
  }


  handleActions(action) {
    switch(action.type) {
      case "SHOW_PROFILES": {
        this.showProfiles(action.data);
        break;
      }
      case "SHOW_PROFILE": {
        this.showProfile(action.data);
        break;
      }
      case "SHOW_EDUCATIONS": {
        this.showEducations(action.data);
        break;
      }
    }
  }
}


const profileStore = new ProfileStore;
dispatcher.register(profileStore.handleActions.bind(profileStore));

export default profileStore;
