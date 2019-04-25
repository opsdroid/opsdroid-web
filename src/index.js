'use strict';


//////
// Imports
import React from 'react';
import ReactDOM from 'react-dom';
import request from 'request';
import * as settings from 'browser-cookies';
import WebSocket from 'websocket';

import {formatPostUrl, formatSocketUrl, checkForUrl} from './js/utils';

import Conversation from './js/components/Conversation';
import Prompt from './js/components/Prompt';
import ConnectionSettings from './js/components/ConnectionSettings';
import UpdateMessage from './js/components/UpdateMessage';

import './css/index.scss'


//////
// Constants
const DEFAULT_HOST = "localhost";
const DEFAULT_PORT = "8080";
const DEFAULT_SSL_PORT = "8443";
const DEFAULT_SSL_ENABLED = false;
const DEFAULT_COOKIE_CONFIG = {expires: 365};


//////
// Main Class
class ChatClient extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      conversation: [],
      connected: false,
      showConnectionSettings: false,
      host: settings.get("host") || DEFAULT_HOST,
      port: settings.get("port") || DEFAULT_PORT,
      sslEnabled: settings.get("sslEnabled") === 'true' || DEFAULT_SSL_ENABLED,
    };

    this.active_connection = undefined;
    this.client = undefined;
    this.connected = false;
    this.connectionCooldown = 0;
    this.connectionTimeout = undefined;

    //////
    // Event listeners
    this.toggleConnectionSettings = this.toggleConnectionSettings.bind(this);
    this.sendUserMessage = this.sendUserMessage.bind(this);
    this.updateHost = this.updateHost.bind(this);
    this.updatePort = this.updatePort.bind(this);
    this.toggleSSL = this.toggleSSL.bind(this);
    this.connectToWebsocket = this.connectToWebsocket.bind(this);
    this.reconnectToWebSocketImmediately = this.reconnectToWebSocketImmediately.bind(this);

    this.handleSocketConnect = this.handleSocketConnect.bind(this);
    this.handleSocketFailedToConnect = this.handleSocketFailedToConnect.bind(this);
    this.handleSocketError = this.handleSocketError.bind(this);
    this.handleSocketClose = this.handleSocketClose.bind(this);
    this.handleSocketMessage = this.handleSocketMessage.bind(this);
  }

  render() {
    return (
      <div>
        <UpdateMessage />
        <Conversation
          items={this.state.conversation} />
        <Prompt
          connected={this.state.connected}
          toggleConnectionSettings={this.toggleConnectionSettings}
          sendUserMessage={this.sendUserMessage} />
        <ConnectionSettings
          host={this.state.host}
          port={this.state.port}
          sslEnabled={this.state.sslEnabled}
          defaultHost={DEFAULT_HOST}
          defaultPort={DEFAULT_PORT}
          visible={this.state.showConnectionSettings}
          updateHost={this.updateHost}
          updatePort={this.updatePort}
          toggleSSL={this.toggleSSL}
          reconnectToWebSocketImmediately={this.reconnectToWebSocketImmediately} />
      </div>
    );
  }

  componentDidMount() {
    this.connectToWebsocket();
  }

  handleSocketConnect() {
    console.log('WebSocket Client Connected');
    this.active_connection = this.client;
    this.resetCooldown();
    this.hideConnectionSettings();
    this.updateStatusIndicator(true);
    this.addMessage('connected', 'info');

    this.client.onerror = this.handleSocketError;
    this.client.onclose = this.handleSocketClose;
    this.client.onmessage = this.handleSocketMessage;
  }

  handleSocketFailedToConnect(error) {
    console.log('Connect Error: ' + error.toString());
    this.reconnectToWebSocket();
  }

  handleSocketError(error) {
    console.log("Connection Error: " + error.toString());
    this.updateStatusIndicator(false);
    this.addMessage('connection error', 'info');
  }

  handleSocketClose() {
    console.log('echo-protocol Connection Closed');
    this.updateStatusIndicator(false);
    this.reconnectToWebSocket();
    this.addMessage('disconnected', 'info');
  }

  handleSocketMessage(message) {
    if (typeof message.data === 'string') {
        this.addMessage(message.data, "bot");
    }
  }

  addMessage(message, sender) {
    // Add new message to the conversation
    let newMessage = {
      "text": message,
      "user": sender,
      "time": new Date()
    }
    this.setState((prevState, props) => ({
      conversation: prevState.conversation.concat([newMessage])
    }));
    this.expandMessage(newMessage);
  }

  expandMessage(message) {
    let url = checkForUrl(message.text);
    if (url) {
      let req = {
        method: 'GET', headers: new Headers(),
        mode: 'cors', cache: 'default'};
      fetch(new Request(url, req)).then((response) => {
        return response.blob();
      }).then((blob) => {
        if (blob.type == "image/gif" ||
            blob.type == "image/png" ||
            blob.type == "image/jpg" ||
            blob.type == "image/jpeg") {
          this.setState((prevState, props) => {
            let index = prevState.conversation.indexOf(message);
            prevState.conversation[index].image = url;
            return {"conversation": prevState.conversation};
          });
        }
      })
    }
  }

  updateStatusIndicator(status) {
    this.setState({connected: status});
  }

  sendUserMessage(user_message) {
    if (this.client.readyState === this.client.OPEN) {
      if (user_message != "") {
        this.addMessage(user_message, "user");
        this.sendMessageToSocket(user_message);
      }
    }
  }

  connectToWebsocket() {
    request.post(formatPostUrl(this.state.host, this.state.port, this.state.sslEnabled), (error, response, body) => {
      if (error) {
        console.log(error);
        this.addMessage('failed to connect', 'info');
        this.reconnectToWebSocket();
      } else {
        console.log(body)
        var socket = JSON.parse(body)["socket"];
        this.client = new WebSocket.w3cwebsocket(formatSocketUrl(this.state.host, this.state.port, this.state.sslEnabled, socket));
        this.client.onopen = this.handleSocketConnect
      }
    })
  }

  reconnectToWebSocket() {
    if (this.active_connection && this.active_connection.connected) {
      this.active_connection.close();
    }
    if (this.connectionTimeout) {
      clearTimeout(this.connectionTimeout);
    }
    console.log(`Reconnecting in ${this.connectionCooldown} seconds.`);
    this.connectionTimeout = setTimeout(this.connectToWebsocket, this.connectionCooldown * 1000);
    this.backoffCooldown();
  }

  reconnectToWebSocketImmediately() {
    this.addMessage('reconnecting', 'info');
    this.resetCooldown();
    this.reconnectToWebSocket();
  }

  resetCooldown() {
    this.connectionCooldown = 0;
  }

  backoffCooldown() {
      if (this.connectionCooldown <1 ) {
        this.connectionCooldown = 1;
      } else if (this.connectionCooldown < 5) {
        this.connectionCooldown = this.connectionCooldown * 2;
      }
  }

  sendMessageToSocket(message) {
    if (this.client.readyState === this.client.OPEN) {
        console.log("Sending " + message);
        this.client.send(message);
    } else {
        console.log("Unable to send message");
    }
  }

  toggleConnectionSettings() {
    this.setState((prevState, props) => ({
      showConnectionSettings: ! prevState.showConnectionSettings
    }));
  }

  hideConnectionSettings() {
    this.setState({
      showConnectionSettings: false
    });
  }

  updateHost(event) {
    if (event.target.value == '') {
      settings.set("host", DEFAULT_HOST, DEFAULT_COOKIE_CONFIG);
      this.setState({host: DEFAULT_HOST});
    } else {
      settings.set("host", event.target.value, DEFAULT_COOKIE_CONFIG);
      this.setState({host: event.target.value});
    }
    this.reconnectToWebSocketImmediately();
  }

  updatePort(event) {
    if (event.target.value == '') {
      settings.set("port", DEFAULT_PORT, DEFAULT_COOKIE_CONFIG);
      this.setState({port: DEFAULT_PORT});
    } else {
      settings.set("port", event.target.value, DEFAULT_COOKIE_CONFIG);
      this.setState({port: event.target.value});
    }
    this.reconnectToWebSocketImmediately();
  }

  toggleSSL(event) {
    this.setState((prevState, props) => {
      let sslEnabled = !prevState.sslEnabled
      settings.set("sslEnabled", sslEnabled ? "true": "false", DEFAULT_COOKIE_CONFIG);
      return {sslEnabled: !prevState.sslEnabled};
    });

    this.reconnectToWebSocketImmediately();
  }
}

//////
// Start
ReactDOM.render(<ChatClient />,
  document.getElementById("wrapper")
);
