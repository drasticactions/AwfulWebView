import { createElement } from 'react';
import { render } from 'react-dom';
import { WebView, AppState } from './components/webview';

const content = document.getElementById('app');
const appState = new AppState();

export class MainApp {
	public startApp(forumObject: any) {
		appState.forumObject = forumObject;
		render(createElement(WebView, { appState: appState }), content);
	}
}