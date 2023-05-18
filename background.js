console.log('background.js loaded');

function functionToInject() {
  let audio = new Audio(chrome.runtime.getURL('sounds/death_sound.mp3'));
  audio.play();
}

const socialMediaSites = [
  'www.facebook.com',
  'www.twitter.com',
  'www.instagram.com',
  'www.linkedin.com',
  'www.snapchat.com',
  'www.pinterest.com',
  'www.reddit.com',
  'www.tiktok.com',
  'www.whatsapp.com',
  'www.youtube.com',
  'www.netflix.com',
  'www.twitch.tv',
  'www.hulu.com',
  'www.disneyplus.com',
  'www.amazon.com/Prime-Video',
  'www.spotify.com',
];

const affirmations = [
  "That's the spirit! Keep up the good work, dearie!",
  "You're making this old gal proud, keep it up!",
  "Now that's what I call productivity! Well done, kiddo!",
  "You're on fire today! Just like my famous hot sauce!",
  "I'm so happy you're focused – as sweet as my apple pie!",
  "That's the way, dear! Show those tasks who's boss!",
  "You're really knocking it out of the park! Keep going!",
  "Heavens to Betsy, you're doing fantastic!",
  'Oh, I could just hug you! Keep up the great work!',
  "You're making progress like a champ! Don't stop now!",
];

const negativeMessages = [
  'Get off that Facebook, young whippersnapper, and get back to work!',
  "Quit your Tweetin' and focus, or you'll feel my wrath!",
  "Oh, so you're on Instagram? How about Insta-GRANDMA? Now focus!",
  'Snap out of your Snapchat and snap into productivity!',
  "TikTok, TikTok, time's a-wastin'! Stop scrolling and start working!",
  "You better LinkedIn with your task, or I'll come after you!",
  'Pinterest-ing choice, but not when you have work to do!',
  "I see you on YouTube, but I'd rather you be on You-Do-Your-Task!",
  "Reddit all about it: Grandma's not happy when you're not working!",
  'Whatsapp with all this distraction? Get back to your task!',
];

let state = 'off';
let currentSite = null;
let timer = null;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.command === 'start') {
    state = 'on';
    console.log('Start button clicked');
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        message: "Grandma is rooting for you. Let's start!",
      });
    });
  } else if (request.command === 'stop') {
    state = 'off';
    console.log('Stop button clicked');
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { message: "I'm so proud of you." });
    });
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  }
});

// Listen for updates on any tab.
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // If the extension is off, we do nothing.
  if (state !== 'on') {
    return;
  }
  // Only act on completed loading.
  if (changeInfo.status === 'complete') {
    // Parse the URL to get the hostname of the site.
    const site = new URL(tab.url).hostname;

    // Check if the site is in our list of social media sites.
    if (socialMediaSites.includes(site)) {
      // Only send messages if the site has changed.
      if (currentSite !== site) {
        // Send a negative message immediately.
        let message =
          negativeMessages[Math.floor(Math.random() * negativeMessages.length)];
        console.log('Sending negative message:', message);
        chrome.tabs.sendMessage(tabId, { message: message });

        // Clear any existing timer.
        if (timer) {
          clearTimeout(timer);
        }

        // Set a timer to send another negative message after 10 seconds.
        setTimeout(() => {
          message =
            negativeMessages[
              Math.floor(Math.random() * negativeMessages.length)
            ];
          console.log('Sending negative message after 10 seconds:', message);
          chrome.tabs.sendMessage(tabId, { message: message });
        }, 10000); // 10 seconds

        // Sending third negative message after 40 seconds
        setTimeout(() => {
          const message =
            negativeMessages[
              Math.floor(Math.random() * negativeMessages.length)
            ];
          console.log('Sending negative message:', message);
          chrome.tabs.sendMessage(tabId, { message: message });
        }, 40000);

        // Send final message after 60 seconds
        setTimeout(() => {
          chrome.tabs.sendMessage(tabId, { message: 'Grandma has died....' });
          console.log('Grandma died message sent');

          // Speak the final message
          chrome.tts.speak('Grandma has died.');
        }, 60000);
      }
    } else {
      // If the site is not a social media site and there's no timer currently set,
      // set a timer to send a positive message after 60 seconds.
      if (!timer) {
        timer = setTimeout(() => {
          const message =
            affirmations[Math.floor(Math.random() * affirmations.length)];
          console.log('Sending positive message:', message);
          chrome.tabs.sendMessage(tabId, { message: message });
          /*
          chrome.notifications.create('', {
            title: 'Good Job!!',
            message: message,
            iconUrl: '/asset/good.png',
            type: 'basic'
          });      
          */
          chrome.scripting.executeScript({
            target: { tabId: tabId },
            file: ['content.js'],
          });
          timer = null;
        }, 60000);
      }
    }
    // Update the current site.
    currentSite = site;
  }
});
