import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react';
import { AppState, ForumCommand, Themes } from '../appState';

@inject("appState") @observer
export class CustomCss extends React.Component<{ appState: AppState }, {}> {

    constructor(props) {
        super(props);
    }

    render() {
        let customCssPath = "";
        switch (this.props.appState.theme) {
            case Themes.Light:
                customCssPath = "/css/light.css";
                break;
            case Themes.Dark:
                customCssPath = "/css/dark.css";
                break;
            case Themes.YOSPOS:
                customCssPath = "/css/yospos.css";
                break;
        }
        if (customCssPath == "") return <div />;
        customCssPath = this.props.appState.cssBase + customCssPath;
        return <link rel="stylesheet" type="text/css" href={customCssPath} />;
    }
}