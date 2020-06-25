import React, { Component } from 'react';
// import UpdateNotice from '../Content/modules/UpdateNotice/UpdateNotice';

import './Sidebar.css';

class Sidebar extends Component {
  state = {
    tabOrders: [],
    activeTab: {},
    tabsDict: {},

    displayTabInFull: true,
  };

  constructor(props) {
    super(props);

    this.tabCreatedHandler = this.handleTabCreated.bind(this);
    this.tabRemovedHandler = this.handleTabRemoved.bind(this);
    this.tabUpdatedHandler = this.handleTabUpdated.bind(this);
    this.tabMovedHandler = this.handleTabMoved.bind(this);
    this.tabActivatedHandler = this.handleTabActivated.bind(this);
    this.tabHighlightedHandler = this.handleTabHighlighted.bind(this);

    chrome.tabs.onCreated.addListener(this.tabCreatedHandler);
    chrome.tabs.onRemoved.addListener(this.tabRemovedHandler);
    chrome.tabs.onUpdated.addListener(this.tabUpdatedHandler);
    chrome.tabs.onMoved.addListener(this.tabMovedHandler);
    chrome.tabs.onActivated.addListener(this.tabActivatedHandler);
    chrome.tabs.onHighlighted.addListener(this.tabHighlightedHandler);
  }

  componentDidMount() {
    // sync scroll positions
    window.addEventListener('scroll', this.handleScroll, false);
    chrome.runtime.sendMessage(
      {
        from: 'sidebar',
        msg: 'REQUEST_SIDEBAR_SCROLL_POSITION',
      },
      (response) => {
        window.scroll(response.scrollPositionX, response.scrollPositionY);
      }
    );
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (
        request.from === 'background' &&
        request.msg === 'UPDATE_SIDEBAR_SCROLL_POSITION'
      ) {
        window.scroll(request.scrollPositionX, request.scrollPositionY);
      }
    });
  }

  componentWillUnmount() {
    chrome.tabs.onCreated.removeListener(this.tabCreatedHandler);
    chrome.tabs.onRemoved.removeListener(this.tabRemovedHandler);
    chrome.tabs.onUpdated.removeListener(this.tabUpdatedHandler);
    chrome.tabs.onMoved.removeListener(this.tabMovedHandler);
    chrome.tabs.onActivated.removeListener(this.tabActivatedHandler);
    chrome.tabs.onHighlighted.removeListener(this.tabHighlightedHandler);

    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll = (event) => {
    // https://gomakethings.com/detecting-when-a-visitor-has-stopped-scrolling-with-vanilla-javascript/
    // Clear our timeout throughout the scroll
    window.clearTimeout(this.isScrolling);

    // Set a timeout to run after scrolling ends
    this.isScrolling = setTimeout(function() {
      chrome.runtime.sendMessage({
        from: 'sidebar',
        msg: 'SIDEBAR_SCROLL_POSITION_CHANGED',
        scrollPositionX: window.pageXOffset,
        scrollPositionY: window.pageYOffset,
      });
    }, 66);
  };

  render() {
    return <div>shravan</div>;
  }
}

export default Sidebar;
