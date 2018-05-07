import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react';
import DevTools from 'mobx-react-devtools';
import { TestPost } from '../testpost';
import Img from 'react-image';
import * as HtmlToReactParser from 'html-to-react';
import { DefaultButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';
import { AppState, ForumCommand } from '../appState';
import Waypoint = require('react-waypoint');
import LazyRender from 'react-lazily-render';
import { CustomCss } from './CustomCss';

@inject("appState") @observer 
export class Home extends React.Component<{ appState: AppState }, {}> {

    parser: HtmlToReactParser.Parser = new HtmlToReactParser.Parser();
    isDebug: boolean;
   
    nativeForumCommand: any;
    constructor(props) {
        super(props);
        let internalWindow = window as any;
        this.isDebug = internalWindow.ToCSharp == null;
        if (!this.isDebug) {
            this.nativeForumCommand = internalWindow.ToCSharp;
        }
    }

    componentDidMount() {
        try {
            (window as any).ForumTemplate();
            (window as any).timg.scan("body");
        } catch (e) {

        }
    }

    componentDidUpdate() {
        try {
            console.log("Update!");
            (window as any).ForumTemplate();
            (window as any).timg.scan("body");
        } catch (e) {

        }
    }

    loadMoreItems() {
        let { CurrentPage, TotalPages, } = this.props.appState.forumThreadPosts.ForumThread;
        if (CurrentPage >= TotalPages) return;
        this.nativeForumCommand({ Type: "streaming" });
    }

    renderUser(user: any) {
        let roles = user.Roles == 'author' ? '' : 'user-info-roles ' + user.Roles;
        return <div className="user-container">
            <Img className="user-avatar" src={user.AvatarLink} />
            <div>
                <span className="user-info">
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
        this.props.appState.showAllPosts = true;
    }

    renderPostFooter(post: any) {
        //if (!this.props.appState.forumThreadPosts.ForumThread.IsLoggedIn) return <div />
        let editButton = post.User.IsCurrentUserPost ? <DefaultButton text='Edit' onClick={() => this.showEditPage(post)} style={{ marginRight: "5px"}} /> : <div/>
        return <div className="post-footer">
            {editButton}
            <DefaultButton onClick={() => this.showQuotePage(post)}
                text='Quote'
            />
        </div>
    }

    renderPost(post: any) {
        if (!this.props.appState.showAllPosts && post.HasSeen) return <div />;
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

    renderWaypoint() {
        return <Waypoint onEnter={(args) => this.loadMoreItems()}>
            {this.renderLoading()}
        </Waypoint>
    }

    renderShowAllPostsButton() {
        return <DefaultButton style={{width: "100%"}} onClick={() => this.showAllPostsButton()}
            text='Show Previous Posts'
        />
    }

    render() {
        let debug = this.isDebug ? <div>DEBUG</div> : <div />
        let { CurrentPage, TotalPages, } = this.props.appState.forumThreadPosts.ForumThread;
        let previousPostsButton = this.props.appState.forumThreadPosts.Posts.length > 0
            && !this.props.appState.showAllPosts ? this.renderShowAllPostsButton() : <div />;
        return (
            <div className="thread-posts">
                {debug}
                {<CustomCss appState={this.props.appState}></CustomCss>}
                {previousPostsButton}
                {this.props.appState.forumThreadPosts.Posts.length > 0 ? this.props.appState.forumThreadPosts.Posts.map(u => this.renderPost(u)) : <div />}
                {this.props.appState.forumThreadOptions.InfinitePageScrolling
                    && this.props.appState.forumThreadPosts.Posts.length > 0
                    && CurrentPage < TotalPages ? this.renderWaypoint() : <div />}
            </div>
        );
    }
}
