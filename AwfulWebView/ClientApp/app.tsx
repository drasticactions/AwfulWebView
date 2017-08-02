import * as React from "react";
import { inject, observer } from "mobx-react";
import { AppState } from './state'

@inject('appState') @observer
export class App extends React.Component<{ appState?: AppState }, {}> {
    render() {
        return(<div>Test</div>);
    }
}