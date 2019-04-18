import React from 'react';
import { Page, Navbar, Block, NavTitle, Link, Toolbar } from 'framework7-react';
import { dict} from '../Dict';
import logo from  "../../images/logo.png";
import Moment from 'react-moment';
import 'moment-timezone';

export default class NotFoundPage extends React.Component {
  constructor() {
    super();
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
          <Link href="/categories/0"><i class="f7-icons">data</i></Link>
          <Link href="/new_cam_advert/"><i class="f7-icons">add_round</i></Link>
          <Link href="/"><i class="f7-icons">home</i></Link>
          <Link href="/login/">
            <i class="icon f7-icons ios-only">
              person_round
              <span class="badge color-red"></span>
            </i>
          </Link>
        </Toolbar>
      </Page>
    );
  }
}
