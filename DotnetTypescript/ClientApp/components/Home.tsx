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
            <LazyRender offset={1000} content={test} placeholder={<div />} onRender={() => {
                try {
                    (window as any).ForumTemplate();
                    (window as any).timg.scan("body");
                } catch (e) {

                }
            }} />
        </div>
    }

    renderPostFooter(post: any) {
        if (!this.props.appState.forumThreadPosts.ForumThread.IsLoggedIn) return <div />
        let editButton = post.User.IsCurrentUserPost ? <DefaultButton text='Edit' style={{ marginRight: "5px"}} /> : <div/>
        return <div className="post-footer">
            {editButton}
            <DefaultButton
                text='Quote'
            />
        </div>
    }

    renderPost(post: any) {
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

    render() {
        let debug = this.isDebug ? <div>DEBUG</div> : <div />
        let { CurrentPage, TotalPages, } = this.props.appState.forumThreadPosts.ForumThread;
        return (
            <div className="thread-posts">
                {debug}
                {this.props.appState.forumThreadPosts.Posts.length > 0 ? this.props.appState.forumThreadPosts.Posts.map(u => this.renderPost(u)) : <div />}
                {this.props.appState.forumThreadPosts.Posts.length > 0 && CurrentPage < TotalPages ? this.renderWaypoint() : <div/>}
            </div>
        );
    }
}
