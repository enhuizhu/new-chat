import React, { Component } from 'react';
import './App.css';
import IoService from './services/ioService';

class App extends Component {
  constructor() {
    super();
    this.sendMessage = this.sendMessage.bind(this);
    
    IoService.onMessage(this.messageHandler.bind(this));
    window.IoService = IoService;
    
    this.state = {
      messages: []
    }
  }

  messageHandler(msg) {
    console.log('message', msg);
    this.setState({
      messages: this.state.messages.concat([msg])
    })
  }

  sendMessage() {
    const message = this.inputField.value;

    if (message === '') {
      return ;
    }

    this.inputField.value = '';
    IoService.sendMessage(message);
  }

  render() {
    return (
      <div>
        <div className="messages">
          {
            this.state.messages.map((msg, index) => {
              return <div className="item" key={index}>{msg}</div>;
            })
          }
        </div>
        <div>
          <input type="text" placeholder="please type your message here" ref={(ref) => {
            this.inputField = ref;
          }}></input>
        </div>
        <div>
          <button onClick={this.sendMessage}>Send</button>
        </div>
      </div>
    );
  }
}

export default App;
