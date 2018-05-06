import { observable } from 'mobx';
import { TestPost } from './testpost';

export class AppState {
    @observable showAllPosts: boolean = false;
    @observable theme: Themes = Themes.Light;
    @observable forumThreadPosts: ForumThreadPosts = new ForumThreadPosts();
    @observable forumThreadOptions: ForumThreadOptions = new ForumThreadOptions();
    cssBase: string = "";
    forumCommand(command: ForumCommand) {
        switch (command.Type) {
            case "setupWebview":
                this.forumThreadOptions = command.Command;
                break;
            case "addTestPosts":
                this.addTestPosts();
                break;
            case "addPosts":
                this.addPosts(command.Command);
                break;
            case "reset":
                this.showAllPosts = false;
                this.forumThreadPosts = new ForumThreadPosts();
                break;
        }
    }
    addPosts(forumThreadPosts: ForumThreadPosts) {
        this.forumThreadPosts.ForumThread = forumThreadPosts.ForumThread;
        this.forumThreadPosts.Posts = this.forumThreadPosts.Posts.concat(forumThreadPosts.Posts);
    }
    addTestPosts() {
        var testPost = new TestPost();
        this.forumThreadPosts.ForumThread = testPost.testPostOne.ForumThread;
        this.forumThreadPosts.Posts = this.forumThreadPosts.Posts.concat(testPost.testPostTwo.Posts);
    }
}

export enum Themes {
    Light,
    Dark,
    YOSPOS
}

export class ForumCommand {
    Type: string;
    Command: any;
}

export class ForumThreadPosts {
    @observable ForumThread: ForumThread = new ForumThread();
    @observable Posts: Post[] = [];
}

export class ForumThreadOptions {
    InfinitePageScrolling: boolean = false;
    ShowEmbeddedGifv: boolean = false;
    ShowEmbeddedTweets: boolean = false;
    ShowEmbeddedVideo: boolean = false;
    AutoplayGif: boolean = false;
}

export class ForumThread {
    Name: string;
    RepliesSinceLastOpened: number;
    TotalPages: number = 0;
    CurrentPage: number = 0;
    ScrollToPost: number;
    ScrollToPostString: null;
    LoggedInUserName: string;
    ThreadId: number;
    IsPrivateMessage: boolean;
    IsLoggedIn: boolean;
    OrderNumber: number;
}

export class Post {
    User: User;
    PostDate: string;
    PostHtml: string;
    PostId: number;
    PostIndex: number;
    HasSeen: boolean;
    IsQuoting: boolean;
}

export class User {
    Username: string;
    AvatarLink: string;
    AvatarTitle: string;
    AvatarHtml: string;
    DateJoined: string;
    IsMod: boolean;
    IsAdmin: boolean;
    Roles: string;
    IsCurrentUserPost: boolean;
    Id: number;
}