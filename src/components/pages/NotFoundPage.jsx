import React from 'react';
import { Page, Navbar, Block, NavTitle, Link, Toolbar } from 'framework7-react';
import { dict} from '../Dict';
import logo from  "../../images/logo.png";
import Moment from 'react-moment';
import 'moment-timezone';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default class NotFoundPage extends React.Component {
  constructor() {
    super();
    this.state = {
      shares: [],
      token: window.localStorage.getItem('token'),
      unseens: 0,
      query: '',
      roles: []
    };
  }

  render() {
      console.log(this.$f7route);
    return(
      <Page>
        <Navbar>
          <NavTitle>
            <img src={logo} alt="Logo" className="logo" />
          </NavTitle>
          <Link onClick={() => this.$f7router.back()}>Go Back</Link>
        </Navbar>
        <Block strong>
          <p>Sorry</p>
          <p>Requested content not found.</p>
        </Block>
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
