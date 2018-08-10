import { observable } from 'mobx';
import { TestPost } from './testpost';
import { some, every } from 'lodash';

export class AppState {
    @observable showAllPosts: boolean = false;
    @observable probatedUsersList: ProbatedUsersList = new ProbatedUsersList();
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
                this.probatedUsersList = new ProbatedUsersList();
                break;
        }
    }

    addPosts(forumThreadPosts: ProbatedUsersList) {
        console.log(this.probatedUsersList.Bans.length);
        this.probatedUsersList.BannedPage = forumThreadPosts.BannedPage;
        this.probatedUsersList.Bans = this.probatedUsersList.Bans.concat(forumThreadPosts.Bans);
    }

    addTestPosts() {
        var testPost = new TestPost();
        this.forumThreadOptions.Theme = 1;
        this.probatedUsersList.Bans = this.probatedUsersList.Bans.concat(testPost.testPostOne.Bans);
    }
}

export class ForumCommand {
    Type: string;
    Command: any;
}

export class ProbatedUsersList {
    @observable BannedPage: BannedPage = new BannedPage();
    @observable Bans: Ban[] = [];
}

export class ForumThreadOptions {
    InfinitePageScrolling: boolean = false;
    ShowEmbeddedGifv: boolean = false;
    ShowEmbeddedTweets: boolean = false;
    ShowEmbeddedVideo: boolean = false;
    AutoplayGif: boolean = false;
    @observable Theme: any;
}

export class BannedPage {
    TotalPages: number = 0;
    CurrentPage: number = 0;
}

export class Ban {
    Type: string;
    PostId: number;
    Date: Date;
    HorribleJerk: string;
    HorribleJerkId: number;
    PunishmentReason: string;
    RequestedBy: string;
    RequestedById: number;
    ApprovedBy: string;
    ApprovedById: number;
}