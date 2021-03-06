import { observable } from 'mobx';
import { TestPost } from './testpost';
import { some, every, findIndex } from 'lodash';

export class AppState {
    urlBase: string = "";
    @observable showAllPosts: boolean = false;
    @observable forumThreadPosts: ForumThread = new ForumThread();
    @observable forumThreadOptions: ForumThreadOptions = new ForumThreadOptions();
    @observable themeClass: string = '';
    cssBase: string = "";
    forumCommand(command: ForumCommand) {
        switch (command.Type) {
            case "setupWebview":
                this.forumThreadOptions = command.Command;
                this.setupTheme();
                break;
            case "changeTheme":
                this.themeClass = command.Command;
                break;
            case "addTestPosts":
                this.addTestPosts();
                break;
            case "addTestPosts2":
                this.addTestPosts2();
                break;
            case "addTestPosts3":
                this.addTestPosts3();
                break;
            case "addPosts":
                this.addPosts(command.Command);
                break;
            case "reset":
                this.showAllPosts = false;
                this.forumThreadPosts = new ForumThread();
                break;
            case "showIgnoredPost":
                let post = command.Command as Post;
                let id = findIndex(this.forumThreadPosts.Posts, { PostId: post.PostId });
                this.forumThreadPosts.Posts.splice(id, 1, post);
                break;
        }
    }

    setupTheme() {
        switch(this.forumThreadOptions.Theme) {
            case Themes.Light:
                this.themeClass = "";
                break;
            case Themes.Dark:
                this.themeClass = "theme-alt";
                break;
            case Themes.YOSPOS:
                this.themeClass = "theme-alt yospos";
                break;
            case Themes.YOSPOSAmber:
                this.themeClass = "theme-alt yospos-amber";
                break;
        }
        document.getElementsByTagName("BODY")[0].className = this.themeClass;
    }

    addPosts(forumThreadPosts: ForumThread) {
        this.showAllPosts = every(forumThreadPosts.Posts, (u) => u.HasSeen) || every(forumThreadPosts.Posts, (u) => !u.HasSeen);
        this.forumThreadPosts = forumThreadPosts;
    }

    addTestPosts() {
        var testPost = new TestPost();
        this.forumThreadOptions.Theme = Themes.YOSPOSAmber;
        this.setupTheme();
        this.forumThreadPosts = testPost.testPostOne.ForumThread;
        this.showAllPosts = !some(testPost.testPostTwo.Posts, (u) => u.HasSeen);
        this.forumThreadPosts.Posts = testPost.testPostTwo.Posts;
    }

    addTestPosts2() {
        var testPost = new TestPost();
        this.forumThreadOptions.Theme = Themes.Light;
        this.setupTheme();
        this.forumThreadPosts = testPost.testPostOne.ForumThread;
        this.showAllPosts = !some(testPost.testPostOne.Posts, (u) => u.HasSeen);
        this.forumThreadPosts.Posts = testPost.testPostOne.Posts;
    }

    addTestPosts3() {
        var testPost = new TestPost();
        this.forumThreadOptions.Theme = Themes.Light;
        this.setupTheme();
        this.forumThreadPosts = testPost.testPostThree;
        this.showAllPosts = !some(testPost.testPostThree.Posts, (u) => u.HasSeen);
        this.forumThreadPosts.Posts = testPost.testPostThree.Posts;
    }
}

export enum Themes {
    Light,
    Dark,
    YOSPOS,
    YOSPOSAmber
}

export class ForumCommand {
    Type: string;
    Command: any;
}

export class ForumThreadOptions {
    InfinitePageScrolling: boolean = false;
    ShowEmbeddedGifv: boolean = false;
    ShowEmbeddedTweets: boolean = false;
    ShowEmbeddedVideo: boolean = false;
    AutoplayGif: boolean = false;
    @observable Theme: Themes = Themes.Light;
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
    @observable Posts: Post[] = [];
}

export class Post {
    User: User;
    PostDate: string;
    PostHtml: string;
    PostId: number;
    PostIndex: number;
    HasSeen: boolean;
    IsQuoting: boolean;
    IsIgnored: boolean;
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