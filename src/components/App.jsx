import React from 'react';
import {
  App,
  Panel,
  View,
  Statusbar,
  Popup,
  Page,
  Navbar,
  NavRight,
  Link,
  Block,
  LoginScreen,
  LoginScreenTitle,
  List,
  ListInput,
  ListItem,
  Label,
  Input,
  ListButton,
  BlockFooter,
  Icon
} from 'framework7-react';

import routes from '../routes';
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWater, faHeart, faBookmark, faLink, faRetweet } from '@fortawesome/free-solid-svg-icons'

library.add(faWater)
library.add(faHeart)
library.add(faBookmark)
library.add(faLink)
library.add(faRetweet)
export default function (props) {

  // Framework7 parameters here
  const f7params = {
    id: 'io.framework7.testapp', // App bundle ID
    name: 'Framework7', // App name
    theme: 'ios',
    // App routes
    touch: {
      disableContextMenu: false
    },
    view: {
      animate : false,
    },
    routes,
  };

  return (
    <App params={f7params}>
      {/* Statusbar */}
      <Statusbar />

      {/* Right Panel */}
      <Panel right reveal colorTheme="green">
        <View url="/panel-right/"/>
      </Panel>


      {/* Main View */}
      <View id="main-view" url="/" iosDynamicNavbar={false} pushState={true} pushStateRoot={document.location.pathname} main className="ios-edges"/>

    </App>
  );
};
