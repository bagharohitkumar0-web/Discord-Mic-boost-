// Create a relay script to inject the actual page script
const script = document.createElement('script');
script.src = chrome.runtime.getURL('inject.js');
(document.head || document.documentElement).appendChild(script);
