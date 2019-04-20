import React, { Component } from 'react';
import { Page, Navbar, Block, Link, Toolbar, Swiper, SwiperSlide, NavTitle, BlockTitle, List, ListItem, Segmented, Button, ListButton} from 'framework7-react';

import * as MyActions from "../../actions/MyActions";
import DiscussionStore from "../../stores/DiscussionStore";
import { dict} from '../Dict';
import logo from  "../../images/logo.png";
import Moment from 'react-moment';
import 'moment-timezone';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default class Tour extends Component {
  constructor() {
    super();
    this.getDiscussion = this.getDiscussion.bind(this);
    if (window.cordova){
      var uuid = window.device.uuid
    } else {
      var uuid = ''
    }
    this.state = {
      token: window.localStorage.getItem('token'),
      discussions: [],
      comments: []
    };
  }


  componentWillMount() {
    DiscussionStore.on("show_discussion", this.getDiscussion);
  }

  componentWillUnmount() {
    DiscussionStore.removeListener("show_discussion", this.getDiscussion);
  }



  componentDidMount(){
    MyActions.getDiscussion(this.$f7route.params['discussionId'], this.state.token);
  }


  getDiscussion() {
    var discussions = DiscussionStore.getAll();
    var comments = DiscussionStore.getComments();
    console.log(discussions);
    this.setState({
      discussions: discussions[0],
      comments: comments
    });
  }


  discussionTitle(){
    if (this.state.discussions) {
      return(
        <React.Fragment>
          <div class="block-title">{dict.title}</div>
          <Block strong>{this.state.discussions.title}</Block>
        </React.Fragment>
      )
    }
  }


  createItem(){
    console.log(this.state.comments[1]);
    if (this.state.comments) {
      var length = this.state.comments.length;
      let items = []
      for (let i = 0; i < length; i++) {
        items.push(<ListItem
          title={this.state.comments[i].title}
          after=""
          subtitle=""
          text={this.state.comments[i].content}
          >
          <img slot="media" src={this.state.comments[i].cover} width="80" />
          </ListItem>);
      }
      return items
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

        {this.discussionTitle()}



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
