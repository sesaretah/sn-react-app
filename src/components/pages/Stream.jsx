import React from 'react';
import {
  Page,
  Navbar,
  NavLeft,
  NavTitle,
  NavRight,
  Link,
  Toolbar,
  Block,
  BlockTitle,
  List,
  ListInput,
  ListItem,
  Row,
  Col,
  Button,
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  Icon,
  F7Icon,
  Searchbar
} from 'framework7-react';

import * as MyActions from "../../actions/MyActions";
import StreamStore from "../../stores/StreamStore";
import SocialStore from "../../stores/SocialStore";
import { dict} from '../Dict';
import logo from  "../../images/logo.png";
import Moment from 'react-moment';
import 'moment-timezone';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


export default class HomePage extends React.Component {

  constructor() {
    super();
    this.getStreams = this.getStreams.bind(this);
    if (window.cordova){
      var uuid = window.device.uuid
    } else {
      var uuid = ''
    }
    this.state = {
      streams: [],
      token: window.localStorage.getItem('token'),
      unseens: 0,
      query: '',
      categories: [],
      uuid: uuid,
      allowInfinite: true,
      showPreloader: true,
      noResult: false,
      page: 1
    };
  }

  componentWillMount() {
    StreamStore.on("show_streams", this.getStreams);
    StreamStore.on("load", this.getStreams);
  }

  componentWillUnmount() {
    StreamStore.removeListener("show_streams", this.getStreams);
    StreamStore.removeListener("load", this.getStreams);
  }

  componentDidMount(){
    MyActions.getStreams(this.state);
  }


  getStreams() {
    var streams = StreamStore.getAll()
    if (streams.length > 0){
      this.setState({
        streams: streams,
        noResult: false,
        showPreloader: false
      });
    } else {
      this.setState({
        streams: streams,
        noResult: true,
        showPreloader: false
      });
    }

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
    var length = this.state.streams.length;
    let items = []
    for (let i = 0; i < length; i++) {
      items.push(<ListItem
        link={'/streams/' + this.state.streams[i].id}
        title={this.state.streams[i].title}
        after=""
        subtitle=""
        text={this.state.streams[i].content}
        >
        <img slot="media" src={this.state.streams[i].cover} width="80" />
        <span class="price text-muted nowrp light-blue">
          {this.followbt(this.state.streams[i].followed)}
          <span class='mr-1 ml-1'>{this.state.streams[i].follows}</span>
          {this.sharebt(this.state.streams[i].shared)}
          <span class='mr-1 ml-1'>{this.state.streams[i].shares}</span>
          {this.likebt(this.state.streams[i].liked)}
          <span class='mr-1 ml-1'>{this.state.streams[i].likes}</span>
          {this.bookmarkbt(this.state.streams[i].bookmarked)}
          <span class='mr-1 ml-1'>{this.state.streams[i].bookmarks}</span>

        </span>
      </ListItem>);
    }
    return items
  }

  getUnseens() {
    this.setState({
      //  unseens: MessageStore.getUnseens(),
    });
  }

  blankResult() {
    if (this.state.noResult){
      return(<Block strong>{dict.no_result}</Block>);
    }
  }

  render() {

    return(
      <Page colorTheme="blue" className="gray" >
        <Navbar>
          <Link href='/'>
            <div class='custom-category teal-text'>{dict.shoa}</div>
          </Link>
          <NavTitle>
            <img src={logo} alt="Logo" className="logo" />
          </NavTitle>
        </Navbar>

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
