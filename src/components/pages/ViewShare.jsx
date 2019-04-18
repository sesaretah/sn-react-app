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
    console.log(shares);
    this.setState({
      shares: shares[0]
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





  uploadItems(upload){
    console.log(upload);
    let items = []
    for (var item in upload.items) {
      var title = "لینک"
      if (upload.items[item].title) {
        title = upload.items[item].title
      }
      items.push(<ListButton title={title} link={upload.items[item].url} external></ListButton>)
    }
    return items
  }

  shareUploads(){
    if (this.state.shares) {
      var uploads = this.state.shares.uploads
      var items = []
      for (var u in uploads) {
        items.push(
          <React.Fragment>
            <BlockTitle>{this.state.shares.uploads[u].title}</BlockTitle>
            <List>{this.uploadItems(this.state.shares.uploads[u])}</List>
          </React.Fragment>
        )
      }
      return(
        <React.Fragment>
          <div class="block-title">{dict.uploads}</div>
          <Block strong>
            {items}
          </Block>
        </React.Fragment>
      )
    }
  }

  render() {
    return (
      <Page colorTheme="blue" className="gray">
        <Navbar>
          <Link href='/'>
            <i class="f7-icons color-white">chevron_right</i>
            <div class='custom-category teal-text'>{dict.back}</div>
          </Link>
          <NavTitle>
            <img src={logo} alt="Logo" className="logo" />
          </NavTitle>
        </Navbar>

        {this.shareTitle()}
        {this.shareContent()}

        <Toolbar tabbar labels color="blue" bottomMd={true}>
          <Link href="/shares/"><i class="f7-icons">book</i></Link>
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
