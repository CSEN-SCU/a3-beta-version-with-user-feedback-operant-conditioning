chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message) {
      let notification = document.createElement('div');
      notification.style.position = 'fixed';
      notification.style.bottom = '10px';
      notification.style.right = '10px';
      notification.style.backgroundColor = 'white';
      notification.style.border = '1px solid black';
      notification.style.padding = '10px';
      notification.style.zIndex = '10000';
      notification.textContent = request.message;
  
      document.body.appendChild(notification);
  
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 5000);
    }
  });
  