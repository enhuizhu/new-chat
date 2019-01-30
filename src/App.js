import React, { Component } from 'react';
import './App.css';
import IoService from './services/ioService';
import ApiService from './services/apiService';
import DbService from './services/dbService';

class App extends Component {
  constructor() {
    super();
    this.sendMessage = this.sendMessage.bind(this);
    
    IoService.onMessage(this.messageHandler.bind(this));
    
    this.state = {
      messages: []
    };
  }

  componentDidMount() {
    ApiService.getUserData().then(res => {
      this.userInfo = res.data;
    });

    this.initMessages();

  }

  initMessages() {
    try {
      DbService.fetchMessages((messages) => {
        console.log('messages from db', messages);
        this.setState({
          messages: messages
        });
      });
    } catch(e) {
      setTimeout(() => {this.initMessages();}, 100);
    }
  }

  messageHandler(msg) {
    const msgObj = JSON.parse(msg);
    
    DbService.createMsg(msgObj.user_id, msgObj.message, (res) => {
      console.log('db message', res);
    });

    this.setState({
      messages: this.state.messages.concat([msgObj])
    });
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
