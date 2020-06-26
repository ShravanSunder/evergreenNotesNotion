import React from 'react';
import ReactDOM from 'react-dom';

export const mountSidebar = (e: HTMLDivElement) => {
   console.log('render');
   ReactDOM.render(<Sidebar />, e);
};

export const Sidebar = ({}) => {
   return <div style={{ width: 500, height: 500 }}>Sidebar Page</div>;
};
