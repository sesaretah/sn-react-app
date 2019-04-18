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
import { dict} from '../Dict';
import logo from  "../../images/logo.png";
import Moment from 'react-moment';
import 'moment-timezone';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


export default class HomePage extends React.Component {

  constructor() {
    super();
    this.getArticles = this.getArticles.bind(this);
    if (window.cordova){
      var uuid = window.device.uuid
    } else {
      var uuid = ''
    }
    this.state = {
      articles: '',
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
    ArticleStore.on("show_articles", this.getArticles);
    ArticleStore.on("load", this.getArticles);
  }

  componentWillUnmount() {
    ArticleStore.removeListener("show_articles", this.getArticles);
    ArticleStore.removeListener("load", this.getArticles);
  }

  componentDidMount(){
    MyActions.getArticles(this.state);
  }


  getArticles() {
    var articles = ArticleStore.getAll()
    if (articles.length > 0){
      this.setState({
        articles: articles,
        noResult: false,
        showPreloader: false
      });
    } else {
      this.setState({
        articles: articles,
        noResult: true,
        showPreloader: false
      });
    }

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
        <span class="price text-muted nowrp">{this.state.articles[i].workflow} > {this.state.articles[i].workflow_state}</span>
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
          <NavTitle>
            <img src={logo} alt="Logo" className="logo" />
          </NavTitle>
        </Navbar>

        <List mediaList>
          {this.createItem()}
        </List>

        <Toolbar tabbar labels color="blue" bottomMd={true}>
          <Link href="/articles/"><i class="f7-icons">book</i></Link>
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
