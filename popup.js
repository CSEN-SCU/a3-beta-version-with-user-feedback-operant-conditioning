document.getElementById('start').addEventListener('click', function() {
  chrome.runtime.sendMessage({command: 'start'});
});

document.getElementById('stop').addEventListener('click', function() {
  chrome.runtime.sendMessage({command: 'stop'});
});