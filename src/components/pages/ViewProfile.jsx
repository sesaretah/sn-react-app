import React, { Component } from 'react';
import { Page, Navbar, Block, Link, Toolbar, Swiper, SwiperSlide, NavTitle, BlockTitle, List, ListItem, Segmented, Button, ListButton, Row, Col} from 'framework7-react';

import * as MyActions from "../../actions/MyActions";
import ProfileStore from "../../stores/ProfileStore";
import StreamStore from "../../stores/StreamStore";
import SocialStore from "../../stores/SocialStore";
import { dict} from '../Dict';
import logo from  "../../images/logo.png";
import Moment from 'react-moment';
import 'moment-timezone';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default class Tour extends Component {
  constructor() {
    super();
    this.getProfile = this.getProfile.bind(this);
    this.getUserStreams = this.getUserStreams.bind(this);

    if (window.cordova){
      var uuid = window.device.uuid
    } else {
      var uuid = ''
    }
    this.state = {
      token: window.localStorage.getItem('token'),
      profiles: [],
      shares: [],
      userStreams: [],
      selectedStream: '',
      shareActive: false
    };
  }

componentWillMount() {
    ProfileStore.on("show_profile", this.getProfile);
    StreamStore.on("show_user_streams", this.getUserStreams);
    SocialStore.on("social_event", this.getSocial);
  }

  componentWillUnmount() {
    ProfileStore.removeListener("show_profile", this.getProfile);
    StreamStore.removeListener("show_user_streams", this.getUserStreams);
    SocialStore.removeListener("social_event", this.getSocial);
  }



  componentDidMount(){
    MyActions.getProfile(this.$f7route.params['profileId'], this.state.token);
    MyActions.getUserStreams(this.state.token);
  }


  getProfile() {
    var profiles = ProfileStore.getAll();
    this.setState({
      profiles: profiles[0]
    });
  }


  getUserStreams() {
    var streams = StreamStore.getUserStreams();
    console.log('streams', streams);
    this.setState({
      userStreams: streams
    });
  }


  profileTitle(){
    if (this.state.profiles) {
      return(
        <List mediaList>
        <ListItem
          title={this.state.profiles.title}
          after=""
          subtitle=""

          text={this.state.profiles.content}
          >
          <img slot="media" src={this.state.profiles.cover} width="100" />
        </ListItem>
        </List>
      )
    }
  }


  getSocial(){
    var social = SocialStore.getSocial()
    if (this.state.profiles.id == social['uuid'] ){
      switch(social['action']) {
        case 'Like':
        this.state.profiles.liked = social['liked']
        this.state.profiles.likes = social['likes']
        this.forceUpdate()
        break;
        case 'Bookmark':
        this.state.profiles.bookmarked = social['bookmarked']
        this.state.profiles.bookmarks = social['bookmarks']
        this.forceUpdate()
        break;
        case 'Follow':
        this.state.profiles.followed = social['followed']
        this.state.profiles.follows = social['follows']
        this.forceUpdate()
        break;
      }
    }
  }

  like(id, type){
    MyActions.like(id, type, this.state.token);
  }

  bookmark(id, type){
    MyActions.bookmark(id, type, this.state.token);
  }

  follow(id, type){
    MyActions.follow(id, type, this.state.token);
  }

  userStreamsItems(){
    var length = this.state.userStreams.length;
    let items = []
    for (let i = 0; i < length; i++) {
      items.push(<option value={this.state.userStreams[i].id}>{this.state.userStreams[i].title}</option>);
    }
    return items
  }

  share(id, type){
    this.setState({
      shareActive: true
    });
  }

  shareToProfile() {
    MyActions.share(this.state.profiles.id, 'Profile', this.state.selectedProfile, this.state.token);
  }


  likebt(liked) {
    if (liked) {
      return(<FontAwesomeIcon icon="heart" size="2x" color="#bf4141"/>)
    } else {
      return(<FontAwesomeIcon icon="heart" size="2x" color="#eee"/>)
    }
  }

  bookmarkbt(bookmarked) {
    if (bookmarked) {
      return(<FontAwesomeIcon icon="bookmark" size="2x" color="#a241bf"/>)
    } else {
      return(<FontAwesomeIcon icon="bookmark" size="2x" color="#eee"/>)
    }
  }

  followbt(followed) {
    if (followed) {
      return(<FontAwesomeIcon icon="link" size="2x" color="#30b749"/>)
    } else {
      return(<FontAwesomeIcon icon="link" size="2x" color="#eee"/>)
    }
  }

  sharebt(shared) {
    if (shared) {
      return(<FontAwesomeIcon icon="retweet" size="2x" color="#467fcf"/>)
    } else {
      return(<FontAwesomeIcon icon="retweet" size="2x" color="#eee"/>)
    }
  }

  createItem(){
    if (this.state.shares) {
      var length = this.state.shares.length;
      let items = []
      for (let i = 0; i < length; i++) {
        console.log(this.state.shares[i]);
        items.push(<ListItem
          link={'/shares/' + this.state.shares[i].id}
          title={this.state.shares[i].title}
          after=""
          subtitle=""

          text={this.state.shares[i].content}
          >
          <img slot="media" src={this.state.shares[i].cover} width="80" />
            <span class="price text-muted nowrp light-blue">
              {this.followbt(this.state.shares[i].followed)}
              <span class='mr-1 ml-1'>{this.state.shares[i].follows}</span>
              {this.sharebt(this.state.shares[i].shared)}
              <span class='mr-1 ml-1'>{this.state.shares[i].shares}</span>
              {this.likebt(this.state.shares[i].liked)}
              <span class='mr-1 ml-1'>{this.state.shares[i].likes}</span>
              {this.bookmarkbt(this.state.shares[i].bookmarked)}
              <span class='mr-1 ml-1'>{this.state.shares[i].bookmarks}</span>
            </span>
        </ListItem>);
      }
      return items
    }
  }

  changeStream(event){
    console.log(event.target.value);
         this.setState({selectedStream: event.target.value});
     }



  socialItem(){
    if (this.state.profiles) {
      return(<Block strong className='mh-9 pb-6'>
      <Block  className={this.state.shareActive ? 'show' : 'hidden'}>
        <Row>
          <Col>
            <select name="streamSelect" onChange={this.changeStream} className='custom-select custom-form'>
              {this.userStreamsItems()}
            </select>
          </Col>
          <Col>
            <Button fill onClick={() => this.shareToProfile()}>{dict.submit}</Button>
          </Col>
        </Row>
      </Block>

      <span class="price text-muted nowrp light-blue">
        <Link onClick={() => {this.follow(this.state.profiles.id, 'Profile')}}>
          {this.followbt(this.state.profiles.followed)}
        </Link>
        <span class='mr-1 ml-1'>{this.state.profiles.follows}</span>
        <Link onClick={() => {this.share(this.state.profiles.id, 'Profile')}}>
          {this.sharebt(this.state.profiles.shared)}
        </Link>
        <span class='mr-1 ml-1'>{this.state.profiles.shares}</span>
        <Link onClick={() => {this.like(this.state.profiles.id, 'Profile')}}>
          {this.likebt(this.state.profiles.liked)}
        </Link>
        <span class='mr-1 ml-1'>{this.state.profiles.likes}</span>
        <Link onClick={() => {this.bookmark(this.state.profiles.id, 'Profile')}}>
          {this.bookmarkbt(this.state.profiles.bookmarked)}
        </Link>
        <span class='mr-1 ml-1'>{this.state.profiles.bookmarks}</span>
      </span>
    </Block>);
  }
}



render() {
  return (
    <Page colorTheme="blue" className="gray">
      <Navbar>
      <Link onClick={() => this.$f7router.back()}>
          <i class="f7-icons color-white">chevron_right</i>
          <div class='custom-category teal-text'>{dict.back}</div>
        </Link>
        <NavTitle>
          <img src={logo} alt="Logo" className="logo" />
        </NavTitle>
      </Navbar>



      {this.socialItem()}
      {this.profileTitle()}

      <List mediaList>
        {this.createItem()}
      </List>

      <List >
      <ListItem
        link={'/profiles/profile_educations/'+this.$f7route.params['profileId']}
        title={dict.educations}
        after=""
        subtitle=""
        >
      </ListItem>
      <ListItem
        link={'/'}
        title={dict.bookmarks}
        after=""
        subtitle=""
        >
      </ListItem>
      <ListItem
        link={'/'}
        title={dict.shares}
        after=""
        subtitle=""
        >
      </ListItem>
    </List>

      <Toolbar tabbar labels color="blue" bottomMd={true}>
        <Link href="/profiles/"><FontAwesomeIcon icon="water" size="lg" color="#3DB39E"/></Link>
        <Link href="/"><i class="icon f7-icons">world</i></Link>
        <Link href="/login/">
          <i class="icon f7-icons ios-only">
            person_round
            <span class="badge color-red">{this.state.unseens}</span>
          </i>
        </Link>
      </Toolbar>
    </Page>
  );
}
}
