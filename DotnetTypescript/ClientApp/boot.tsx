import './css/site.css';
import 'bootstrap';
import { AppState } from './appState';
import { Provider } from 'mobx-react';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { Route } from 'react-router-dom'
import { Router } from 'react-router'
import * as RoutesModule from './routes';
import { initializeIcons } from '@uifabric/icons';
import navigationStore from './navigationStore';
import { TestPost } from './testpost';
import { Home } from './components/Home';

let routes = RoutesModule.routes;
const cssBaseView = (document.getElementById('cssBase') as HTMLInputElement).value;
declare var module: any;
const appState = new AppState();

const stores = {
    appState: appState,
};

initializeIcons();

function renderApp() {
    // This code starts up the React app when it runs in a browser. It sets up the routing
    // configuration and injects the app into a DOM element.
    let windowblah = window as any;
    appState.cssBase = cssBaseView;
    ReactDOM.render(
        <AppContainer>
            <Home ref={(element) => { windowblah.app = element }} appState={stores.appState}></Home>
        </AppContainer>,
        document.getElementById('react-app')
    );
}

renderApp();

// Allow Hot Module Replacement
if (module.hot) {
    module.hot.accept('./routes', () => {
        routes = require<typeof RoutesModule>('./routes').routes;
        renderApp();
    });
}
