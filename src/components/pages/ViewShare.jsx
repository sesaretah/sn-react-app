import React, { Component } from 'react';
import { Page, Navbar, Block, Link, Toolbar, Swiper, SwiperSlide, NavTitle, BlockTitle, List, ListItem, Segmented, Button, ListButton} from 'framework7-react';

import * as MyActions from "../../actions/MyActions";
import ShareStore from "../../stores/ShareStore";
import { dict} from '../Dict';
import logo from  "../../images/logo.png";
import Moment from 'react-moment';
import 'moment-timezone';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default class Tour extends Component {
  constructor() {
    super();
    this.getShare = this.getShare.bind(this);
    if (window.cordova){
      var uuid = window.device.uuid
    } else {
      var uuid = ''
    }
    this.state = {
      token: window.localStorage.getItem('token'),
      shares: [],
      discussions: []
    };
  }


  componentWillMount() {
    ShareStore.on("show_share", this.getShare);
  }

  componentWillUnmount() {
    ShareStore.removeListener("show_share", this.getShare);
  }



  componentDidMount(){
    MyActions.getShare(this.$f7route.params['shareId'], this.state.token);
  }


  getShare() {
    var shares = ShareStore.getAll();
    var discussions = ShareStore.getDiscussions();
    console.log(discussions);
    this.setState({
      shares: shares[0],
      discussions: discussions
    });
  }

  shareWorkflow(){
    if (this.state.shares) {
      return(
        <React.Fragment>
          <div class="block-title">{dict.workflow}</div>
          <Block strong>{this.state.shares.workflow} > {this.state.shares.workflow_state}</Block>
        </React.Fragment>
      )
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
    console.log(this.state.discussions[1]);
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