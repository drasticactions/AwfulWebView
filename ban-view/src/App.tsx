import * as React from 'react';
import './css/gifwrap.css';
import './css/winstrap.min.css';
import './App.css';
import 'jquery';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import { AppState, Ban } from './appState';
import Img from 'react-image';
import * as HtmlToReactParser from 'html-to-react';

import logo from './logo.svg';

@observer
class App extends React.Component {

  parser: HtmlToReactParser.Parser = new HtmlToReactParser.Parser();
  @observable appState = new AppState();
  isDebug: boolean;
  nativeForumCommand: any;
  @observable themeClass: string = '';

  constructor(props) {
    super(props);
    let internalWindow = window as any;
    this.isDebug = internalWindow.ToCSharp == null;
    this.nativeForumCommand = internalWindow.ToCSharp;
  }

  componentDidMount() {
    try {
      console.log("Launch!");
      (window as any).ForumTemplate();
      (window as any).timg.scan("body");
      (window as any).GifWrap();
    } catch (e) {

    }
  }

  componentDidUpdate() {
    try {
      console.log("Update!");
      (window as any).ForumTemplate();
      (window as any).timg.scan("body");
      (window as any).GifWrap();
    } catch (e) {

    }
  }

  renderBanHtml(post: Ban) {
    let test = this.parser.parse(post.PunishmentReason);
    return <td data-title="Punishment Reason">
      <div className="post-body">
        {test}
      </div>
    </td>
  }

  renderBanRow(ban: Ban) {
    return <tr>
      <td data-title="Type"><b>{ban.Type}</b></td>
      <td data-title="Date">{new Date(ban.Date).toLocaleDateString()}</td>
      <td data-title="Horrible Jerk">{ban.HorribleJerk}</td>
      {this.renderBanHtml(ban)}
      <td data-title="Requested By">{ban.RequestedBy}</td>
      <td data-title="Approved By">{ban.ApprovedBy}</td>
    </tr>
  }

  public render() {
    let { CurrentPage, TotalPages, } = this.appState.probatedUsersList.BannedPage;
    let noPostsScreen = <img src={logo} className="img-responsive logo-center" alt="logo" />;
    return this.appState.probatedUsersList.Bans.length > 0 ? <table id="no-more-tables" className={`table-bordered table-striped table-condensed cf ${this.themeClass}`}>
      <thead>
        <tr>
          <th>Type</th>
          <th>Date</th>
          <th>Horrible Jerk</th>
          <th>Punishment Reason</th>
          <th>Requested By</th>
          <th>Approved By</th>
        </tr>
      </thead>
      <tbody>
        {this.appState.probatedUsersList.Bans.length > 0 ? this.appState.probatedUsersList.Bans.map(u => this.renderBanRow(u)) : <tr />}
      </tbody>
    </table> : noPostsScreen;
  }
}

export default App;
