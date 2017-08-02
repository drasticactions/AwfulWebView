import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
import { AppContainer } from 'react-hot-loader';
import { App } from './app'
import { AppState } from './state'

const appState = new AppState();
const stores = {
    appState: appState
};

function renderApp() {
    // This code starts up the React app when it runs in a browser. It sets up the routing
    // configuration and injects the app into a DOM element.
    ReactDOM.render(
        <AppContainer><Provider {...stores}><App /></Provider></AppContainer>,
        document.getElementById('react-app')
    );
}

renderApp();

// Allow Hot Module Replacement
if (module.hot) {
    module.hot.accept(() =>
        {renderApp();}
    );
}