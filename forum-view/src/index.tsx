import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

declare var module: any;

const render = Component => {
  let windowblah = window as any;
  ReactDOM.render(
    <App ref={(element) => { windowblah.app = element }} />,
    document.getElementById('root') as HTMLElement
  );
}

registerServiceWorker();

render(App);

if (module.hot) {
    module.hot.accept('./App', () => {
        render(App);
    });
}