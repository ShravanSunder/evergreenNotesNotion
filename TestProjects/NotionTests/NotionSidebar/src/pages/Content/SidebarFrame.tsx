import React from 'react';
import ReactDOM from 'react-dom';

export const mountSidebar = (sidebar: HTMLElement) => {
   console.log('render');

   ReactDOM.render(<Sidebar />, sidebar);
};

export const Sidebar = ({}) => {
   return <div>adjfldjfdklsfjsdjfsjdfkl</div>;
};
