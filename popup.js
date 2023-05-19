/*chrome.runtime.onInstalled.addListener(() => {
  let store = sessionStorage.getItem("state");
  console.log(store);
});*/

document.getElementById('start').addEventListener('click', function () {
  chrome.runtime.sendMessage({ command: 'start' });
  //document.getElementById('start').style.visibility = 'hidden';
  //document.getElementById('stop').style.visibility = 'visible';
});

document.getElementById('stop').addEventListener('click', function () {
  chrome.runtime.sendMessage({ command: 'stop' });
  //document.getElementById('stop').style.visibility = 'hidden';
  //document.getElementById('start').style.visibility = 'visible';
});
