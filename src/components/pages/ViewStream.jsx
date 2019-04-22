import React, { Component } from 'react';
import { Page, Navbar, Block, Link, Toolbar, Swiper, SwiperSlide, NavTitle, BlockTitle, List, ListItem, Segmented, Button, ListButton} from 'framework7-react';

import * as MyActions from "../../actions/MyActions";
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
    this.getStream = this.getStream.bind(this);
    this.getUserStreams = this.getUserStreams.bind(this);
    this.getSocial = this.getSocial.bind(this);
    if (window.cordova){
      var uuid = window.device.uuid
    } else {
      var uuid = ''
    }
    this.state = {
      token: window.localStorage.getItem('token'),
      streams: [],
      userStreams: [],
      shares: [],
    };
  }


  componentWillMount() {
    StreamStore.on("show_stream", this.getStream);
    StreamStore.on("show_user_streams", this.getUserStreams);
    SocialStore.on("social_event", this.getSocial);
  }

  componentWillUnmount() {
    StreamStore.removeListener("show_stream", this.getStream);
    StreamStore.removeListener("show_user_streams", this.getUserStreams);
    SocialStore.removeListener("social_event", this.getSocial);
  }



  componentDidMount(){
    MyActions.getStream(this.$f7route.params['streamId'], this.state.token);
    MyActions.getUserStreams(this.state.token);
  }


  getStream() {
    var streams = StreamStore.getAll();
    var shares = StreamStore.getShares();
    this.setState({
      streams: streams[0],
      shares: shares
    });
  }

  getUserStreams() {
    var streams = StreamStore.getUserStreams();
    console.log(streams);
    this.setState({
      userStreams: streams
    });
  }


  streamTitle(){
    if (this.state.streams) {
      return(
        <React.Fragment>
          <div class="block-title">{dict.title}</div>
          <Block strong>{this.state.streams.title}</Block>
        </React.Fragment>
      )
    }
  }

  streamContent(){
    if (this.state.streams) {
      return(
        <React.Fragment>
          <div class="block-title">{dict.content}</div>
          <Block strong>
            <div dangerouslySetInnerHTML={{__html: this.state.streams.content}}></div>
          </Block>
        </React.Fragment>
      )
    }
  }

  getSocial(){
    var social = SocialStore.getSocial()
    if (this.state.streams.id == social['uuid'] ){
      switch(social['action']) {
        case 'Like':
        this.state.streams.liked = social['liked']
        this.state.streams.likes = social['likes']
        this.forceUpdate()
        break;
        case 'Bookmark':
        this.state.streams.bookmarked = social['bookmarked']
        this.state.streams.bookmarks = social['bookmarks']
        this.forceUpdate()
        break;
        case 'Follow':
        this.state.streams.followed = social['followed']
        this.state.streams.follows = social['follows']
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

  share(id, type){
    const self = this;
    const app = self.$f7;
    console.log(id);
    var dynamicSheet = app.sheet.create({
      content: '<div class="sheet-modal">'+
      '<div class="toolbar">'+
      '<div class="toolbar-inner">'+
      '<div class="left"></div>'+
      '<div class="right">'+
      '<a class="link sheet-close">'+dict.done+'</a>'+
      '</div>'+
      '</div>'+
      '</div>'+
      '<div class="sheet-modal-inner">'+
      '<div class="block">'+
      '<p>Sheet created dynamically.</p>'+
      '<p><a href="#" class="link sheet-close">Close me</a></p>'+
      '</div>'+
      '</div>'+
      '</div>',
      // Events
      on: {
        open: function (sheet) {
          console.log('Sheet open');
        },
        opened: function (sheet) {
          console.log('Sheet opened');
        },
      }
    });
    dynamicSheet.open();
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

  createItem(){
    console.log(this.state.shares[1]);
    if (this.state.shares) {
      var length = this.state.shares.length;
      let items = []
      for (let i = 0; i < length; i++) {
        items.push(<ListItem
          link={'/shares/' + this.state.shares[i].id}
          title={this.state.shares[i].title}
          after=""
          subtitle=""

          text={this.state.shares[i].content}
          >
          <img slot="media" src={this.state.shares[i].cover} width="80" />
          <span class="price text-muted nowrp light-blue">{this.state.shares[i].workflow} > {this.state.shares[i].workflow_state}</span>
        </ListItem>);
      }
      return items
    }
  }



  socialItem(){
    console.log(this.state.streams);
    if (this.state.streams) {
      return(<Block strong className='mh-9'>
      <span class="price text-muted nowrp light-blue">
        <Link onClick={() => {this.follow(this.state.streams.id, 'Stream')}}>
          {this.followbt(this.state.streams.followed)}
        </Link>
        <span class='mr-1 ml-1'>{this.state.streams.follows}</span>
        <Link onClick={() => {this.share(this.state.streams.id, 'Stream')}}>
          {this.sharebt(this.state.streams.followed)}
        </Link>
        <span class='mr-1 ml-1'>{this.state.streams.follows}</span>
        <Link onClick={() => {this.like(this.state.streams.id, 'Stream')}}>
          {this.likebt(this.state.streams.liked)}
        </Link>
        <span class='mr-1 ml-1'>{this.state.streams.likes}</span>
        <Link onClick={() => {this.bookmark(this.state.streams.id, 'Stream')}}>
          {this.bookmarkbt(this.state.streams.bookmarked)}
        </Link>
        <span class='mr-1 ml-1'>{this.state.streams.bookmarks}</span>
      </span>
    </Block>);
  }
}



render() {
  return (
    <Page colorTheme="blue" className="gray">
      <Navbar>
        <Link href='/streams/'>
          <i class="f7-icons color-white">chevron_right</i>
          <div class='custom-category teal-text'>{dict.back}</div>
        </Link>
        <NavTitle>
          <img src={logo} alt="Logo" className="logo" />
        </NavTitle>
      </Navbar>

      <div class="sheet-modal my-sheet">
        <div class="toolbar">
          <div class="toolbar-inner">
            <div class="left"></div>
            <div class="right"><a class="link sheet-close" href="#">Done</a></div>
          </div>
        </div>
        <div class="sheet-modal-inner">
          <div class="block">
            <h4>Info</h4>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque ac diam ac quam euismod porta vel a nunc. Quisque sodales scelerisque est, at porta justo cursus ac.</p>
          </div>
        </div>
      </div>


      {this.socialItem()}
      {this.streamTitle()}
      {this.streamContent()}

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
