import React, {Component} from "react";

import App from "../app";
import {STRINGS} from "../config";

import Header from "./Header";
import JoinPanel from "./JoinPanel";
import NewsPanel from "./NewsPanel";
import CreatePanel from "./CreatePanel";
import FileUpload from "./FileUpload";
import Version from "./Version";

export default class Lobby extends Component {

  constructor(props) {
    super(props);
    App.register(this);
  }
  render() {
    document.title = STRINGS.BRANDING.SITE_TITLE;
    const { roomInfo, serverVersion } = App.state;

    return (
      <div className="container">
        <div className="lobby">
          <Header/>
          <CreatePanel/>
          <JoinPanel roomInfo={roomInfo}/>
          <FileUpload />
          <NewsPanel motd={STRINGS.PAGE_SECTIONS.MOTD}/>
          {STRINGS.BRANDING.PAYPAL}
          {STRINGS.PAGE_SECTIONS.FOOTER}
          <Version version={serverVersion}/>
        </div>
      </div>
    );
  }
}
