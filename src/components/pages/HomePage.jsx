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
import ShareStore from "../../stores/ShareStore";
import UserStore from "../../stores/UserStore";
import SocialStore from "../../stores/SocialStore";
import { dict} from '../Dict';
import logo from  "../../images/logo.png";
import Moment from 'react-moment';
import 'moment-timezone';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


export default class HomePage extends React.Component {

  constructor() {
    super();
    this.getShares = this.getShares.bind(this);
    this.getRoles = this.getRoles.bind(this);
    this.changedRole = this.changedRole.bind(this);
    this.changeRole = this.changeRole.bind(this);

    if (window.cordova){
      var uuid = window.device.uuid
    } else {
      var uuid = ''
    }
    this.state = {
      shares: [],
      token: window.localStorage.getItem('token'),
      unseens: 0,
      query: '',
      roles: [],
      uuid: uuid,
      allowInfinite: true,
      showPreloader: true,
      noResult: false,
      current_role_id: 0,
      page: 1
    };
  }

  componentWillMount() {
    ShareStore.on("show_shares", this.getShares);
    UserStore.on("got_roles", this.getRoles);
    UserStore.on("changed_role", this.changedRole);
  }

  componentWillUnmount() {
    UserStore.removeListener("changed_role", this.changedRole);
    UserStore.removeListener("got_roles", this.getRoles);
    ShareStore.removeListener("show_shares", this.getShares);
    ShareStore.removeListener("load", this.getShares);
  }

  componentDidMount(){
    MyActions.getShares(this.state);
    MyActions.getRoles(this.state);
    if (window.cordova){
      MyActions.updateFCM(this.state.token, this.state.uuid);
    }

  }


  getShares() {
    var shares = ShareStore.getAll()

    if (shares.length > 0){
      var joined = this.state.shares.concat(shares);
      this.setState({ shares: joined, showPreloader: false,allowInfinite: true })
    } else {
      this.setState({showPreloader: false,allowInfinite: false })
    }
  }

  getRoles(){
    var roles = UserStore.getRoles();
    var current_role_id = UserStore.getCurrentRole();
    this.setState({ roles: roles, current_role_id: current_role_id })
  }

  reloadAdvertisements(event, done) {
    this.setState({page: 1},  function() {
      MyActions.getShares(this.state);
      done();
    });

  }

  loadMore() {

    console.log('loadMore', this.state.page, this.state.allowInfinite );
    if (this.state.allowInfinite){
      this.setState({ allowInfinite: false });
      this.setState({ page: this.state.page + 1 });
      this.setState({ showPreloader: true });
      MyActions.getShares(this.state);
    }
  }

  searchads() {
    this.setState({query: this.search.value},  function() {
      //  MyActions.searchAdvertisements(this.state);
    });
  }

  createItem(){
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



  roles(){
    var length = this.state.roles.length;
    let items = []
    for (let i = 0; i < length; i++) {
      items.push(<option value={this.state.roles[i].id} >{this.state.roles[i].title}</option>);
    }
    return items
  }

  changeRole(e){
    this.setState({current_role_id: e.target.value}, function () {
    MyActions.changeRole(this.state);
  });
  }

  changedRole(){
    var current_role_id = UserStore.getCurrentRole();
    this.setState({current_role_id: current_role_id, shares: []}, function () {
      MyActions.getShares(this.state);
  });
  }

  render() {

    return(
      <Page colorTheme="blue" className="gray" ptr onPtrRefresh={this.reloadAdvertisements.bind(this)}
        infinite
        infiniteDistance={10}
        infinitePreloader={this.state.showPreloader}
        onInfinite={this.loadMore.bind(this)}
        >
        <Navbar>
          <Link href='/'>
            <div class='custom-category teal-text'>{dict.shoa}</div>
          </Link>
          <NavTitle>
            <img src={logo} alt="Logo" className="logo" />
          </NavTitle>
        </Navbar>

        <Block>

        </Block>

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
