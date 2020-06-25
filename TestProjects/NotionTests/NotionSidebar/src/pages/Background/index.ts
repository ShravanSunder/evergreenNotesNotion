import '../../assets/img/icon-34.png';
import '../../assets/img/icon-128.png';

console.log('This is the background page.');
console.log('Put the background scripts here.');

let sidebarOpen = true; // open -> true  |  close -> false
let sidebarScrollPosition = {
   scrollPositionX: 0,
   scrollPositionY: 0,
};

const toggleSidebar = () => {
   if (sidebarOpen == true) {
      sidebarOpen = true;
   } else {
      sidebarOpen = false;
   }

   // let sidebarOpenCopy = sidebarOpen;
   // chrome.tabs.query(
   //   {
   //     currentWindow: true,
   //   },
   //   function (tabs) {
   //     tabs.forEach((tab) => {
   //       chrome.tabs.sendMessage(tab.id, {
   //         from: 'background',
   //         msg: 'TOGGLE_SIDEBAR',
   //         toStatus: sidebarOpenCopy,
   //       });
   //     });
   //   }
   //);
};
