import * as React from 'react';
import './css/gifwrap.css';
import './css/winstrap.min.css';
import './App.css';
import 'jquery';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import { AppState } from './appState';
import Img from 'react-image';
import * as HtmlToReactParser from 'html-to-react';
import { lightlogo, darklogo } from './images';

@observer
class App extends React.Component {

  parser: HtmlToReactParser.Parser = new HtmlToReactParser.Parser();
  @observable appState = new AppState();
  isDebug: boolean;
  nativeForumCommand: any;

  constructor(props) {
    super(props);
    this.appState.urlBase = document.getElementsByTagName("BODY")[0].getAttribute("data-base");
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

  renderUser(user: any) {
    let roles = user.Roles == 'author' ? '' : 'user-info-roles ' + user.Roles;
    return <div className="user-container">
      <Img className="user-avatar" src={user.AvatarLink} />
      <div>
        <span className={`user-info ${this.appState.themeClass}`}>
          <div className={roles}>{user.Username}</div>
          <small>{new Date(user.DateJoined).toLocaleDateString()}</small>
        </span>
      </div>
    </div>
  }

  renderPostHtml(post: any) {
    let test = this.parser.parse(post.PostHtml);
    return <div className="post-body">
      {test}
    </div>
  }

  showEditPage(post: any) {
    let json = JSON.parse(JSON.stringify(post));
    console.log(json);
    this.nativeForumCommand({ Type: "edit", Command: json });
  }

  showQuotePage(post: any) {
    let json = JSON.parse(JSON.stringify(post));
    console.log(json);
    this.nativeForumCommand({ Type: "quote", Command: json });
  }

  showAllPostsButton() {
    console.log("touched");
    this.appState.showAllPosts = true;
  }

  renderPostFooter(post: any) {
    if (!this.appState.forumThreadPosts.IsLoggedIn) return <div />
    let editButton = post.User.IsCurrentUserPost ? <button className={`btn btn-default ${this.appState.themeClass}`} onClick={() => this.showEditPage(post)} style={{ marginRight: "5px" }} >Edit</button> : <div />
    return <div className="post-footer">
      {editButton}
      <button className={`btn btn-default ${this.appState.themeClass}`} onClick={() => this.showQuotePage(post)}
      >Quote</button>
    </div>
  }

  renderShowAllPostsButton() {
    return <button className={`btn btn-default ${this.appState.themeClass}`} style={{ marginTop: 0, width: "100%" }} onClick={() => this.showAllPostsButton()}>Show Previous Posts</button>
  }

  renderPost(post: any) {
    if (!this.appState.showAllPosts && post.HasSeen) return <div />;
    let postContainerClass = post.HasSeen ? "post-container has-seen" : "post-container";
    return <div className={postContainerClass}>
      {this.renderUser(post.User)}
      {this.renderPostHtml(post)}
      {this.renderPostFooter(post)}
    </div>
  }

  renderLoading() {
    return <div className="progress-ring center-block progress-large">
      <div className="progress-circle"></div>
      <div className="progress-circle"></div>
      <div className="progress-circle"></div>
      <div className="progress-circle"></div>
      <div className="progress-circle"></div>
    </div>
  }

  renderNoPostsScreen() {
    let isLight = this.appState.themeClass.indexOf("theme-alt") > -1;
    return <div className="loader">
      <div className="center-block-loader">
        <img className="center-block-loader img-responsive-loader" src={isLight ? lightlogo : darklogo} />
      </div>
    </div>
  }

  public render() {
    let debug = this.isDebug ? <div>DEBUG</div> : <div />
    let isLight = this.appState.themeClass.indexOf("theme-alt") > -1;
    let { CurrentPage, TotalPages, } = this.appState.forumThreadPosts;
    console.log(this.appState.showAllPosts);
    let previousPostsButton = this.appState.forumThreadPosts.Posts.length > 0
      && !this.appState.showAllPosts ? this.renderShowAllPostsButton() : <div />;
    return this.appState.forumThreadPosts.Posts.length > 0 ? <div className={`thread-posts ${this.appState.themeClass}`}>
      {debug}
      {previousPostsButton}
      {this.appState.forumThreadPosts.Posts.length > 0 ? this.appState.forumThreadPosts.Posts.map(u => this.renderPost(u)) : <div />}
    </div> : this.renderNoPostsScreen();
  }
}

export default App;
