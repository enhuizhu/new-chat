import React, { Component } from 'react';
import './App.css';
import IoService from './services/ioService';
import ApiService from './services/apiService';

class App extends Component {
  constructor() {
    super();
    this.sendMessage = this.sendMessage.bind(this);
    
    IoService.onMessage(this.messageHandler.bind(this));
    window.IoService = IoService;
    
    this.state = {
      messages: []
    };
  }

  componentDidMount() {
    ApiService.getUserData().then(res => {
      this.userInfo = res.data;
    });
  }

  messageHandler(msg) {
    this.setState({
      messages: this.state.messages.concat([JSON.parse(msg)])
    })
  }

  sendMessage() {
    const message = this.inputField.value;

    if (message === '') {
      return ;
    }

    this.inputField.value = '';
    
    IoService.sendMessage(
      {
        user_id: this.userInfo.id,
        message: message
      }
    );
  }

  render() {
    return (
      <div>
        <div className="messages">
          {
            this.state.messages.map((msg, index) => {
              return (<div className="item" key={index}>
                {msg.user_id}: {msg.message}
              </div>);
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
