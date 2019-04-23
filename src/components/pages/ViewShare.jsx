import React, { Component } from 'react';
import { Page, Navbar, Block, Link, Toolbar, Swiper, SwiperSlide, NavTitle, BlockTitle, List, ListItem, Segmented, Button, ListButton, Row, Col} from 'framework7-react';

import * as MyActions from "../../actions/MyActions";
import ShareStore from "../../stores/ShareStore";
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
    this.getShare = this.getShare.bind(this);
    this.getUserStreams = this.getUserStreams.bind(this);
    this.getSocial = this.getSocial.bind(this);
    this.userStreamsItems = this.userStreamsItems.bind(this);
    this.changeStream = this.changeStream.bind(this);
    this.shareToStream = this.shareToStream.bind(this);

    if (window.cordova){
      var uuid = window.device.uuid
    } else {
      var uuid = ''
    }
    this.state = {
      token: window.localStorage.getItem('token'),
      shares: [],
      discussions: [],
      userStreams: [],
      selectedStream: '',
      shareActive: false
    };
  }

  componentWillMount() {
    ShareStore.on("show_share", this.getShare);
    StreamStore.on("show_user_streams", this.getUserStreams);
    SocialStore.on("social_event", this.getSocial);
  }

  componentWillUnmount() {
    ShareStore.removeListener("show_share", this.getShare);
    StreamStore.removeListener("show_user_streams", this.getUserStreams);
    SocialStore.removeListener("social_event", this.getSocial);
  }

  componentDidMount(){
    MyActions.getShare(this.$f7route.params['shareId'], this.state.token);
    MyActions.getUserStreams(this.state.token);
  }


  getShare() {
    var shares = ShareStore.getAll();
    var discussions = ShareStore.getDiscussions();
    console.log('shares', shares);
    this.setState({
      shares: shares[0],
      discussions: discussions
    });
  }

  getUserStreams() {
    var streams = StreamStore.getUserStreams();
    console.log('streams', streams);
    this.setState({
      userStreams: streams
    });
  }

  getSocial(){
    var social = SocialStore.getSocial()
    console.log('social', social);
    if (this.state.shares.id == social['uuid'] ){
      switch(social['action']) {
        case 'Like':
        this.state.shares.liked = social['liked']
        this.state.shares.likes = social['likes']
        this.forceUpdate()
        break;
        case 'Bookmark':
        this.state.shares.bookmarked = social['bookmarked']
        this.state.shares.bookmarks = social['bookmarks']
        this.forceUpdate()
        break;
        case 'Follow':
        this.state.shares.followed = social['followed']
        this.state.shares.follows = social['follows']
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

  shareToStream() {
    MyActions.share(this.state.streams.id, 'Stream', this.state.selectedStream, this.state.token);
  }

  likebt(liked) {
    if (liked) {
      return(<FontAwesomeIcon icon="heart" size="lg" color="#bf4141"/>)
    } else {
      return(<FontAwesomeIcon icon="heart" size="lg" color="#eee"/>)
    }
  }

  bookmarkbt(bookmarked) {
    if (bookmarked) {
      return(<FontAwesomeIcon icon="bookmark" size="lg" color="#a241bf"/>)
    } else {
      return(<FontAwesomeIcon icon="bookmark" size="lg" color="#eee"/>)
    }
  }

  followbt(followed) {
    if (followed) {
      return(<FontAwesomeIcon icon="link" size="lg" color="#30b749"/>)
    } else {
      return(<FontAwesomeIcon icon="link" size="lg" color="#eee"/>)
    }
  }

  sharebt(shared) {
    if (shared) {
      return(<FontAwesomeIcon icon="retweet" size="lg" color="#467fcf"/>)
    } else {
      return(<FontAwesomeIcon icon="retweet" size="lg" color="#eee"/>)
    }
  }


  shareTitle(){
    if (this.state.shares) {
      return(
        <React.Fragment>
          <div class="block-title">{dict.title}</div>
          <Block strong>{this.state.shares.title}</Block>
        </React.Fragment>
      )
    }
  }

  shareContent(){
    if (this.state.shares) {
      return(
        <React.Fragment>
          <div class="block-title">{dict.content}</div>
          <Block strong>
            <div dangerouslySetInnerHTML={{__html: this.state.shares.content}}></div>
          </Block>
        </React.Fragment>
      )
    }
  }

  createItem(){
    if (this.state.discussions) {
      var length = this.state.discussions.length;
      let items = []
      for (let i = 0; i < length; i++) {
        items.push(<ListItem
          link={'/discussions/' + this.state.discussions[i].id}
          title={this.state.discussions[i].title}
          after=""
          subtitle=""

          text={this.state.discussions[i].content}
          >
          <img slot="media" src={this.state.discussions[i].cover} width="80" />
          <span class="price text-muted nowrp light-blue">{this.state.discussions[i].workflow} > {this.state.discussions[i].workflow_state}</span>
        </ListItem>);
      }
      return items
    }
  }

  changeStream(event){
    this.setState({selectedStream: event.target.value});
  }



  socialItem(){
    if (this.state.shares) {
      return(<Block strong className='mh-9 pb-6'>
      <Block  className={this.state.shareActive ? 'show' : 'hidden'}>
        <Row>
          <Col>
            <select name="streamSelect" onChange={this.changeStream} className='custom-select custom-form'>
              {this.userStreamsItems()}
            </select>
          </Col>
          <Col>
            <Button fill onClick={() => this.shareToStream()}>{dict.submit}</Button>
          </Col>
          <Col></Col>
          <Col></Col>
        </Row>
      </Block>

      <span class="price text-muted nowrp light-blue">
        <Link onClick={() => {this.follow(this.state.shares.id, 'Post')}}>
          {this.followbt(this.state.shares.followed)}
        </Link>
        <span class='mr-1 ml-1'>{this.state.shares.follows}</span>
        <Link onClick={() => {this.share(this.state.shares.id, 'Post')}}>
          {this.sharebt(this.state.shares.shared)}
        </Link>
        <span class='mr-1 ml-1'>{this.state.shares.shares}</span>
        <Link onClick={() => {this.like(this.state.shares.id, 'Post')}}>
          {this.likebt(this.state.shares.liked)}
        </Link>
        <span class='mr-1 ml-1'>{this.state.shares.likes}</span>
        <Link onClick={() => {this.bookmark(this.state.shares.id, 'Post')}}>
          {this.bookmarkbt(this.state.shares.bookmarked)}
        </Link>
        <span class='mr-1 ml-1'>{this.state.shares.bookmarks}</span>
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
      {this.shareTitle()}
      {this.shareContent()}


      <List mediaList>
        {this.createItem()}
      </List>


      <Toolbar tabbar labels color="blue" bottomMd={true}>
        <Link href="/streams/"><FontAwesomeIcon icon="water" size="lg" color="#3DB39E"/></Link>
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
