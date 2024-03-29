//import { hot } from 'react-hot-loader/root';
import React from 'react';
import { render } from 'react-dom';
import { useSelector, useDispatch } from 'react-redux';
import 'chrome-extension-async';
import { registerTabUpdateListener } from 'aNotion/services/notionListeners';
import logger from 'redux-logger';

import Debug from 'debug';
import { Sidebar } from 'aSidebar/Sidebar';
export const debug = Debug('NS');

const renderApp = (Component: React.FC) =>
   render(<Component />, window.document.querySelector('#app-container'));
renderApp(Sidebar);
console.log('App loaded!');

registerTabUpdateListener();
