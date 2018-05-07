import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react';
import { AppState, ForumCommand } from '../appState';

@inject("appState") @observer
export class CustomCss extends React.Component<{ appState: AppState }, {}> {

    constructor(props) {
        super(props);
    }

    render() {
        let customCssPath = "";
        console.log(`Theme: ${this.props.appState.forumThreadOptions.Theme}`);
        switch (this.props.appState.forumThreadOptions.Theme) {
            case 0:
                customCssPath = "/css/light.css";
                break;
            case 1:
                customCssPath = "/css/dark.css";
                break;
            case 2:
                customCssPath = "/css/yospos.css";
                break;
        }
        if (customCssPath == "") return <div />;
        customCssPath = this.props.appState.cssBase + customCssPath;
        return <link rel="stylesheet" type="text/css" href={customCssPath} />;
    }
}