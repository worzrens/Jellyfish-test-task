import React from 'react';
import ReactDOM from 'react-dom';
import { checkForUpdates, sendMessage } from './socket';

import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';


class Messages extends React.Component {
    constructor(props) {
        super(props);

        checkForUpdates((err, message) =>
            this.setState({new_messages: this.state.new_messages.concat(message)}));

        this.state = {
            new_messages: [],
            my_message: "",
        };

        this.changeMyMessage = this.changeMyMessage.bind(this);
        this.sendOnClick = this.sendOnClick.bind(this);
    }

    changeMyMessage(e) {
        this.setState({ my_message: e.target.value });
    }

    sendOnClick(event) {
		sendMessage(this.state.my_message, this.props.current_username);
        this.setState({
                my_message : ""
            });
    }

    getMessageHistory() {
        return this.props.messages.map( (message) =>
            <li>
                Message: {message.message},
                Author: {message.username},
                Time: {message.time}
            </li>
        )
    }

    getNewMessages() {
        return this.state.new_messages.map( (message) =>
            <li>
                Message: {message.message},
                Author: {message.username},
                Time: {message.time}
            </li>
        )
    }

    render() {
        return [
            <ul>
                {this.getMessageHistory()}
                {this.getNewMessages()}
            </ul>,
                <InputGroup>
                    <FormControl
                      placeholder="Write a message"
                      aria-label="Write a message"
                      value={this.state.my_message}
                      onChange={this.changeMyMessage}
                    />
                    <InputGroup.Append>
                      <Button variant="outline-primary" onClick={this.sendOnClick}>Send</Button>
                    </InputGroup.Append>
                  </InputGroup>
        ];
    }
};

var root = document.getElementById('root');

ReactDOM.render(<Messages messages={msgs} current_username={username} />, root);
