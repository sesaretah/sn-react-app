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
  BlockFooter,
  LoginScreenTitle,
  ListButton,
  Segmented
} from 'framework7-react';

import * as MyActions from "../../actions/MyActions";
import UserStore from "../../stores/UserStore";
import { dict} from '../Dict';
import logo from  "../../images/logo.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.logged_in = this.logged_in.bind(this);
    this.not_logged_in = this.not_logged_in.bind(this);
    this.getAdvertisements = this.getAdvertisements.bind(this);
    this.getUnseens = this.getUnseens.bind(this);
    this.state = {
      advertisements: [],
      token: window.localStorage.getItem('token'),
      unseens: 0,
      username: '',
      password: '',
    };
  }

  componentWillMount() {
    UserStore.on("logged_in", this.logged_in);
    UserStore.on("not_logged_in", this.not_logged_in);
  }

  componentWillUnmount() {
    UserStore.removeListener("logged_in", this.logged_in);
    UserStore.removeListener("not_logged_in", this.not_logged_in);
  }

  componentDidMount(){

  }

  getAdvertisements() {
    this.setState({
      //advertisements: MyStore.getAll(),
    });
  }

  logged_in() {
    const self = this;
    const app = self.$f7;
    const router = self.$f7router;
    console.log(UserStore.getToken());
    window.localStorage.setItem('token', UserStore.getToken());
    router.back();
    window.plugins.toast.showWithOptions({
      message: 'خوش آمدید ',
      duration: "short", // 2000 ms
      position: "bottom",
      styling: {
        opacity: 0.75, // 0.0 (transparent) to 1.0 (opaque). Default 0.8
        textSize: 20.5, // Default is approx. 13.
        cornerRadius: 16, // minimum is 0 (square). iOS default 20, Android default 100
        horizontalPadding: 20, // iOS default 16, Android default 50
        verticalPadding: 16 // iOS default 12, Android default 30
      }
    });
  }

  not_logged_in() {
    var reason = UserStore.getReason();
    const self = this;
    const app = self.$f7;
    const router = self.$f7router;
    app.dialog.alert(reason, dict.error, () => {
      //router.back();
    });
  }

  signIn() {
    MyActions.login(this.state);
  }

  signOut() {
    const self = this;
    const app = self.$f7;
    const router = self.$f7router;
    this.setState({ token: null});
    window.localStorage.removeItem('token');
    if (window.cordova){
      window.cookies.clear(function() {
        console.log('Cookies cleared!');
      });
    }

  }

  LoginContent() {
    return (
      <React.Fragment>

        <List form>
          <ListInput
            label={dict.mobile}
            type="text"
            placeholder=''
            value={this.state.username}
            onInput={(e) => {
              this.setState({ username: e.target.value});
            }}
            />
          <ListInput
            label={dict.password}
            type="password"
            placeholder=''
            value={this.state.password}
            onInput={(e) => {
              this.setState({ password: e.target.value});
            }}
            />
            <li>
              <div class="item-content item-input mh-30">
              </div>
            </li>
        </List>
        <List>
          <Block>
            <Button raised big fill  onClick={this.signIn.bind(this)}>{dict.sign_in}</Button>
          </Block>
          <Block>
          <span> {dict.signed_up_already} </span>
          <Link href="/sign_up/">{dict.sign_up}</Link>
          </Block>
        </List>
      </React.Fragment>
    );
  }

  SignOutContent() {
    return (
      <React.Fragment>
        <List>
          <Block>
            <Button raised big fill color="red" onClick={this.signOut.bind(this)}>{dict.sign_out}</Button>
          </Block>
        </List>

        <List>
          <ListItem title={dict.my_reservations} link="/my_reservations/"  badge={this.state.unseens} badgeColor="red"></ListItem>
        </List>


      </React.Fragment>

    );
  }


  deleteAd(id) {
    //MyActions.deleteAdvertisement(id, this.state.token);
  }

  createItem(){
    var length = this.state.advertisements.length;
    let items = []
    for (let i = 0; i < length; i++) {
      items.push(
        <ListItem title={this.state.advertisements[i].title}>
          <Segmented raised tag="p">
            <Button  href={'/adverts/' + this.state.advertisements[i].id} >{dict.view}</Button>
            <Button  color="gray" href={'/edit_advert/' + this.state.advertisements[i].id} >{dict.edit}</Button>
            <Button color="red"  onClick={() => {if (window.confirm('آیا مطمئن هستید؟ ')) this.deleteAd(this.state.advertisements[i].id)}}>{dict.delete}</Button>
          </Segmented>

        </ListItem>
      );
    }
    return items
  }

  UserContent() {

    if (this.state.token) {
      return (this.SignOutContent());
    } else {
      return (this.LoginContent());
    }

  }

  getUnseens() {
    this.setState({
      //unseens: MessageStore.getUnseens(),
    });
  }


  render() {
    return (
      <Page >
        <Navbar>
            <Link href='/'>
              <i class="f7-icons color-white">chevron_right</i>
              <div class='custom-category color-white'>{dict.back}</div>
            </Link>
          <NavTitle>
            <img src={logo} alt="Logo" className="logo" />
          </NavTitle>
        </Navbar>
        {this.UserContent()}

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
    )
  }

}
