import React, { Component } from 'react';
import './App.css';
import IoService from './services/ioService';
import ApiService from './services/apiService';
import DbService from './services/dbService';

// const customerData = [
//   { ssn: "444-44-4444", name: "Bill", age: 35, email: "bill@company.com" },
//   { ssn: "555-55-5555", name: "Donna", age: 32, email: "donna@home.org" }
// ];


// const dbName = "the_name";

// var request = indexedDB.open(dbName, 2);

// request.onerror = function(event) {
//   // Handle errors.
// };

// request.onsuccess = function(event) {
//   window.db = event.target.result;
// }

// request.onupgradeneeded = function(event) {
//   var db = event.target.result;

//   // Create an objectStore to hold information about our customers. We're
//   // going to use "ssn" as our key path because it's guaranteed to be
//   // unique - or at least that's what I was told during the kickoff meeting.
//   var objectStore = db.createObjectStore("customers", { keyPath: "ssn" });

//   // Create an index to search customers by name. We may have duplicates
//   // so we can't use a unique index.
//   objectStore.createIndex("name", "name", { unique: false });

//   // Create an index to search customers by email. We want to ensure that
//   // no two customers have the same email, so use a unique index.
//   objectStore.createIndex("email", "email", { unique: true });

//   // Use transaction oncomplete to make sure the objectStore creation is 
//   // finished before adding data into it.
//   objectStore.transaction.oncomplete = function(event) {
//     // Store values in the newly created objectStore.
//     var customerObjectStore = db.transaction("customers", "readwrite").objectStore("customers");
//     customerData.forEach(function(customer) {
//       customerObjectStore.add(customer);
//     });
//   };
// };

// window.fetchTodos = function(callback) {
//   var db =  window.db;
//   var transaction = db.transaction(['customers'], 'readwrite');
//   var objStore = transaction.objectStore('customers');

//   var keyRange = IDBKeyRange.lowerBound(0);
//   var cursorRequest = objStore.openCursor(keyRange);

//   var todos = [];

//   transaction.oncomplete = function(e) {
//     // Execute the callback function.
//     callback(todos);
//   };

//   cursorRequest.onsuccess = function(e) {
//     var result = e.target.result;

//     if (!!result == false) {
//       return;
//     }
//     console.log('result value', result.value);
//     todos.push(result.value);

//     result.continue();
//   };

//   cursorRequest.onerror = function(e) {
//     console.log('cursor error', e);
//   }
// };

// window.createTodo = function(text, callback) {
//   // Get a reference to the db.
//   var db = window.db;

//   // Initiate a new transaction.
//   var transaction = db.transaction(['customers'], 'readwrite');

//   // Get the datastore.
//   var objStore = transaction.objectStore('customers');

//   // Create a timestamp for the todo item.
//   var timestamp = new Date().getTime();

//   // Create an object for the todo item.
//   var todo = { ssn: timestamp, name: "Bill", age: 35, email: "bill@company.comfasff" };
  

//   // Create the datastore request.
//   var request = objStore.put(todo);

//   // Handle a successful datastore put.
//   request.onsuccess = function(e) {
//     // Execute the callback function.
//     callback(todo);
//   };

//   // Handle errors.
//   request.onerror = function(e) {
//     console.error(e);
//   };
// };

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
