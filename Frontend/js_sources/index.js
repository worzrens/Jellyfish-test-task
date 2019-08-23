import React from 'react';
import ReactDOM from 'react-dom';
import { checkForUpdates, sendMessage } from './socket';
import Timestamp from 'react-timestamp';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

import  "./messageBox.css"

function messagePaper(message, username, time) {
  return (
        <Paper className="Paper">
            <Typography color="primary">
                {username}:
            </Typography>
            <Typography variant="h6">
                {message}
            </Typography>
            <Typography variant="caption" color="textSecondary" gutterBottom>
              <Timestamp relative date={time} autoUpdate />
            </Typography>
        </Paper>
  );
}


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
            messagePaper(message.message, message.username, message.time)
        )
    }

    getNewMessages() {
        return this.state.new_messages.map( (message) =>
            messagePaper(message.message, message.username, message.time)
        )
    }

    render() {
        return (
            <Grid container spacing={3}>
                <AppBar bg="primary">
                    <Toolbar>
                        <Grid
                          justify="space-between"
                          container
                          spacing={24}
                        >
                            <Grid item>
                                <Typography variant="h6">
                                    Chat app for Jellyfish
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Button color="inherit" href="/logout">Logout</Button>
                            </Grid>
                        </Grid>
                    </Toolbar>
                </AppBar>
                <Grid item xs></Grid>
                <Grid item xs style={{marginTop:"80px"}}>
                    <Box>{this.getMessageHistory()}</Box>
                    <Box>{this.getNewMessages()}</Box>
                    <Box>
                        <Grid container spacing={3}>
                            <Grid item xs={9}>
                                <TextField
                                    id="standard-dense"
                                    label="Write a message"
                                    margin="dense"
                                    value={this.state.my_message}
                                    onChange={this.changeMyMessage}
                                fullWidth/>
                            </Grid>
                            <Grid item xs={3}>
                                <Button variant="contained" color="primary" size="large" onClick={this.sendOnClick} fullWidth>Send</Button>
                            </Grid>
                        </Grid>
                    </Box>
                </Grid>
                <Grid item xs></Grid>
            </Grid>)
    }
};

var root = document.getElementById('root');

ReactDOM.render(<Messages messages={msgs} current_username={username} />, root);
