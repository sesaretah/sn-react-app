import React, { Component } from 'react';
import { Page, Navbar, Block, Link, Toolbar, Swiper, SwiperSlide, NavTitle, BlockTitle, List, ListItem, Segmented, Button, ListButton} from 'framework7-react';

import * as MyActions from "../../actions/MyActions";
import ArticleStore from "../../stores/ArticleStore";
import { dict} from '../Dict';
import logo from  "../../images/logo.png";
import Moment from 'react-moment';
import 'moment-timezone';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default class Tour extends Component {
  constructor() {
    super();
    this.getArticle = this.getArticle.bind(this);
    if (window.cordova){
      var uuid = window.device.uuid
    } else {
      var uuid = ''
    }
    this.state = {
      token: window.localStorage.getItem('token'),
      articles: [],
    };
  }


  componentWillMount() {
    ArticleStore.on("show_article", this.getArticle);
  }

  componentWillUnmount() {
    ArticleStore.removeListener("show_article", this.getArticle);
  }



  componentDidMount(){
    MyActions.getArticle(this.$f7route.params['articleId'], this.state.token);
  }


  getArticle() {
    var articles = ArticleStore.getAll();
    console.log(articles);
    this.setState({
      articles: articles[0][0]
    });
  }

  articleWorkflow(){
    if (this.state.articles) {
      return(
        <React.Fragment>
          <div class="block-title">{dict.workflow}</div>
          <Block strong>{this.state.articles.workflow} > {this.state.articles.workflow_state}</Block>
        </React.Fragment>
      )
    }
  }

  articleTitle(){
    if (this.state.articles) {
      return(
        <React.Fragment>
          <div class="block-title">{dict.title}</div>
          <Block strong>{this.state.articles.title}</Block>
        </React.Fragment>
      )
    }
  }

  articleAbstract(){
    if (this.state.articles) {
      return(
        <React.Fragment>
          <div class="block-title">{dict.abstract}</div>
          <Block strong>{this.state.articles.abstract}</Block>
        </React.Fragment>
      )
    }
  }

  articleContent(){
    if (this.state.articles) {
      return(
        <React.Fragment>
          <div class="block-title">{dict.content}</div>
          <Block strong>
            <div dangerouslySetInnerHTML={{__html: this.state.articles.content}}></div>
          </Block>
        </React.Fragment>
      )
    }
  }

  articleDatings(){
    if (this.state.articles) {
      return(
        <React.Fragment>
          <div class="block-title">{dict.datings}</div>
          <Block strong>{this.state.articles.datings}</Block>
        </React.Fragment>
      )
    }
  }

  articleTypings(){
    if (this.state.articles) {
      return(
        <React.Fragment>
          <div class="block-title">{dict.typings}</div>
          <Block strong>{this.state.articles.typings}</Block>
        </React.Fragment>
      )
    }
  }

  articleSpeakings(){
    if (this.state.articles) {
      return(
        <React.Fragment>
          <div class="block-title">{dict.speakings}</div>
          <Block strong>{this.state.articles.speakings}</Block>
        </React.Fragment>
      )
    }
  }

  articleFormatings(){
    if (this.state.articles) {
      return(
        <React.Fragment>
          <div class="block-title">{dict.formatings}</div>
          <Block strong>{this.state.articles.formatings}</Block>
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

  articleUploads(){
    if (this.state.articles) {
      var uploads = this.state.articles.uploads
      var items = []
      for (var u in uploads) {
        items.push(
          <React.Fragment>
            <BlockTitle>{this.state.articles.uploads[u].title}</BlockTitle>
            <List>{this.uploadItems(this.state.articles.uploads[u])}</List>
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
            <div class='custom-category color-white'>{dict.back}</div>
          </Link>
          <NavTitle>
            <img src={logo} alt="Logo" className="logo" />
          </NavTitle>
        </Navbar>

        {this.articleWorkflow()}
        {this.articleTitle()}
        {this.articleAbstract()}
        {this.articleContent()}
        {this.articleUploads()}
        {this.articleDatings()}
        {this.articleTypings()}
        {this.articleSpeakings()}
        {this.articleFormatings()}

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
