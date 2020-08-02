//import { hot } from 'react-hot-loader/root';
import React from 'react';
import { render } from 'react-dom';
import { useSelector, useDispatch } from 'react-redux';
import { registerListener as registerCookiesListener } from './appListeners';
import 'chrome-extension-async';
import { registerTabUpdateListener } from 'aNotion/services/notionListeners';
import logger from 'redux-logger';

import Debug from 'debug';
import { SidebarApp } from './SidebarApp';
export const debug = Debug('NS');

const renderApp = (Component: React.FC) =>
   render(<Component />, window.document.querySelector('#app-container'));
renderApp(SidebarApp);
console.log('App loaded!');

registerCookiesListener();
registerTabUpdateListener();
