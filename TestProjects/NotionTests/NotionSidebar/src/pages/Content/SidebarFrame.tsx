import React from 'react';
import ReactDOM from 'react-dom';

export const mountSidebar = (
   sidebar: HTMLElement,
   newRoot: HTMLElement,
   notionApp: HTMLElement
) => {
   console.log('render');
   newRoot.append(notionApp);
   newRoot.append(sidebar);

   ReactDOM.render(<Sidebar />, sidebar);
};

export const Sidebar = ({}) => {
   return <div>adjfldjfdklsfjsdjfsjdfkl</div>;
};
