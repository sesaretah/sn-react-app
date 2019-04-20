import React, { Component } from 'react';
import { Page, Navbar, Block, Link, Toolbar, Swiper, SwiperSlide, NavTitle, BlockTitle, List, ListItem, Segmented, Button, ListButton} from 'framework7-react';

import * as MyActions from "../../actions/MyActions";
import StreamStore from "../../stores/StreamStore";
import { dict} from '../Dict';
import logo from  "../../images/logo.png";
import Moment from 'react-moment';
import 'moment-timezone';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default class Tour extends Component {
  constructor() {
    super();
    this.getStream = this.getStream.bind(this);
    if (window.cordova){
      var uuid = window.device.uuid
    } else {
      var uuid = ''
    }
    this.state = {
      token: window.localStorage.getItem('token'),
      streams: [],
      shares: [],
    };
  }


  componentWillMount() {
    StreamStore.on("show_stream", this.getStream);
  }

  componentWillUnmount() {
    StreamStore.removeListener("show_stream", this.getStream);
  }



  componentDidMount(){
    MyActions.getStream(this.$f7route.params['streamId'], this.state.token);
  }


  getStream() {
    var streams = StreamStore.getAll();
    var shares = StreamStore.getShares();
    this.setState({
      streams: streams[0],
      shares: shares
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
