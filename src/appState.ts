import { observable } from 'mobx';
import { TestPost } from './testpost';
import { some, every } from 'lodash';

export class AppState {
    @observable showAllPosts: boolean = false;
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
            case "addTestPosts2":
                this.addTestPosts2();
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
        console.log(this.forumThreadPosts.Posts.length);
        if (this.forumThreadPosts.Posts.length <= 0) {
            this.showAllPosts = every(forumThreadPosts.Posts, (u) => u.HasSeen) || every(forumThreadPosts.Posts, (u) => !u.HasSeen);
        }
        else if (!this.showAllPosts) {
            this.showAllPosts = !some(forumThreadPosts.Posts, (u) => u.HasSeen);
        }
        this.forumThreadPosts.ForumThread = forumThreadPosts.ForumThread;
        this.forumThreadPosts.Posts = this.forumThreadPosts.Posts.concat(forumThreadPosts.Posts);
    }

    addTestPosts() {
        var testPost = new TestPost();
        this.forumThreadOptions.Theme = 1;
        this.forumThreadPosts.ForumThread = testPost.testPostOne.ForumThread;
        if (this.forumThreadPosts.Posts.length <= 0) {
            this.showAllPosts = every(testPost.testPostTwo.Posts, (u) => u.HasSeen) || every(testPost.testPostTwo.Posts, (u) => !u.HasSeen);
        }
        else if (!this.showAllPosts) {
            this.showAllPosts = !some(testPost.testPostTwo.Posts, (u) => u.HasSeen);
        }
        this.forumThreadPosts.Posts = this.forumThreadPosts.Posts.concat(testPost.testPostTwo.Posts);
    }

    addTestPosts2() {
        var testPost = new TestPost();
        this.forumThreadOptions.Theme = 1;
        this.forumThreadPosts.ForumThread = testPost.testPostOne.ForumThread;
        if (this.forumThreadPosts.Posts.length <= 0) {
            this.showAllPosts = every(testPost.testPostOne.Posts, (u) => u.HasSeen) || every(testPost.testPostOne.Posts, (u) => !u.HasSeen);
        }
        else if (!this.showAllPosts) {
            this.showAllPosts = !some(testPost.testPostOne.Posts, (u) => u.HasSeen);
        }
        this.forumThreadPosts.Posts = this.forumThreadPosts.Posts.concat(testPost.testPostOne.Posts);
    }
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
    @observable Theme: any;
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