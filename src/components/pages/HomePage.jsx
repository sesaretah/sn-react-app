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
import ArticleStore from "../../stores/ArticleStore";
import UserStore from "../../stores/UserStore";
import { dict} from '../Dict';
import logo from  "../../images/logo.png";
import Moment from 'react-moment';
import 'moment-timezone';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


export default class HomePage extends React.Component {

  constructor() {
    super();
    this.getArticles = this.getArticles.bind(this);
    this.getRoles = this.getRoles.bind(this);
    this.changedRole = this.changedRole.bind(this);
    this.changeRole = this.changeRole.bind(this);

    if (window.cordova){
      var uuid = window.device.uuid
    } else {
      var uuid = ''
    }
    this.state = {
      articles: [],
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
    ArticleStore.on("show_articles", this.getArticles);
    UserStore.on("got_roles", this.getRoles);
    UserStore.on("changed_role", this.changedRole);
  }

  componentWillUnmount() {
    UserStore.removeListener("changed_role", this.changedRole);
    UserStore.removeListener("got_roles", this.getRoles);
    ArticleStore.removeListener("show_articles", this.getArticles);
    ArticleStore.removeListener("load", this.getArticles);
  }

  componentDidMount(){
    MyActions.getArticles(this.state);
    MyActions.getRoles(this.state);
    if (window.cordova){
      MyActions.updateFCM(this.state.token, this.state.uuid);
    }

  }


  getArticles() {
    var articles = ArticleStore.getAll()

    if (articles.length > 0){
      var joined = this.state.articles.concat(articles);
      this.setState({ articles: joined, showPreloader: false,allowInfinite: true })
    } else {
      this.setState({ articles: [],showPreloader: false,allowInfinite: false })
    }
  }

  getRoles(){
    var roles = UserStore.getRoles();
    var current_role_id = UserStore.getCurrentRole();
    this.setState({ roles: roles, current_role_id: current_role_id })
  }

  reloadAdvertisements(event, done) {
    this.setState({page: 1},  function() {
      MyActions.getArticles(this.state);
      done();
    });

  }

  loadMore() {
    if (this.state.allowInfinite){
      this.setState({ allowInfinite: false });
      this.setState({ page: this.state.page + 1 });
      this.setState({ showPreloader: true });
      MyActions.getArticles(this.state);
    }
  }

  searchads() {
    this.setState({query: this.search.value},  function() {
      //  MyActions.searchAdvertisements(this.state);
    });
  }

  createItem(){
    var length = this.state.articles.length;
    let items = []
    for (let i = 0; i < length; i++) {
      items.push(<ListItem
        link={'/articles/' + this.state.articles[i].id}
        title={this.state.articles[i].title}
        after=""
        subtitle=""
        text={this.state.articles[i].abstract}
        >
        <span class="price text-muted nowrp light-blue">{this.state.articles[i].workflow} > {this.state.articles[i].workflow_state}</span>
      </ListItem>);
    }
    return items
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
    this.setState({current_role_id: current_role_id, articles: []}, function () {
      MyActions.getArticles(this.state);
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
          <Link href="/"><i class="f7-icons">book</i></Link>
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
