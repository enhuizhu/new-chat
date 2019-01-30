
const dbName = 'chat';
const tableName = 'messages';
const request = indexedDB.open(dbName, 2);
var db;

request.onerror = function(e) {
  // Handle errors.
  console.error(e);
};

request.onsuccess = function(event) {
  db = event.target.result;
}

request.onupgradeneeded = function(event) {
  db = event.target.result;
  const objectStore = db.createObjectStore(tableName, { keyPath: 'timestamp' });

  objectStore.createIndex('user_id', 'user_id', { unique: false });
  objectStore.createIndex('message', 'message', { unique: false });

  objectStore.transaction.oncomplete = function(event) {
    console.log('transaction done!');
  };
}

export default class DbService {
  static fetchMessages(callback) {
    const transaction = db.transaction([tableName], 'readwrite');
    const objStore = transaction.objectStore(tableName);

    const keyRange = IDBKeyRange.lowerBound(0);
    const cursorRequest = objStore.openCursor(keyRange);

    const messages = [];

    transaction.oncomplete = function(e) {
      // Execute the callback function.
      callback(messages);
    };

    cursorRequest.onsuccess = function(e) {
      const result = e.target.result;

      if (!!result === false) {
        return;
      }
      messages.push(result.value);

      result.continue();
    };

    cursorRequest.onerror = function(e) {
      console.log('cursor error', e);
    }
  }

  static createMsg(user_id, message, callback) {
    const transaction = db.transaction([tableName], 'readwrite');

    const objStore = transaction.objectStore(tableName);

    const timestamp = new Date().getTime();
    const msg = {timestamp, user_id, message};
    const request = objStore.put(msg);

    request.onsuccess = function(e) {
      callback(msg);
    };

    request.onerror = function(e) {
      console.error(e);
    };
  }
}