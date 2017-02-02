import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { observable } from 'mobx';
import { observer } from 'mobx-react';

export class AppState {
	@observable forumObject;
}

@observer
export class WebView extends React.Component<{ appState: AppState }, {}> {

    render() {
		return (
			<div>
            {this.props.appState.forumObject.post_stream.posts.map((p: any, idx: number) => (
                <div className="post" dangerouslySetInnerHTML={{__html: p.cooked}}>
                </div>
            ))}
			</div>
		);
	}
};