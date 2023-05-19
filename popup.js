//used https://developer.mozilla.org/en-US/docs/Web/API/Window/load_event for help with syntax
window.addEventListener('load', (event) => {
  chrome.runtime.sendMessage({ command: 'load' });
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.status === 'progress') {
    document.getElementById('start').style.visibility = 'hidden';
    document.getElementById('stop').style.visibility = 'visible';
  }
});

document.getElementById('start').addEventListener('click', function () {
  chrome.runtime.sendMessage({ command: 'start' });
  document.getElementById('start').style.visibility = 'hidden';
  document.getElementById('stop').style.visibility = 'visible';
});

document.getElementById('stop').addEventListener('click', function () {
  chrome.runtime.sendMessage({ command: 'stop' });
  document.getElementById('stop').style.visibility = 'hidden';
  document.getElementById('start').style.visibility = 'visible';
});
