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
    //let store = sessionStorage.setItem("state","on");
    console.log('Start button clicked');
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.action.setIcon({ path: './assets/progressState.png' });
      chrome.tabs.sendMessage(tabs[0].id, {
        message: "Grandma is rooting for you. Let's start!",
      });
      //used https://developer.chrome.com/docs/extensions/reference/notifications/ for help on syntax
      chrome.notifications.create('', {
        title: "Let's begin!!",
        message: "Grandma is rooting for you. Let's start!",
        iconUrl: '/assets/start.png',
        type: 'basic',
      });
    });
  } else if (request.command === 'stop') {
    state = 'off';
    console.log('Stop button clicked');
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.action.setIcon({ path: './assets/startState.png' });
      chrome.tabs.sendMessage(tabs[0].id, { message: "I'm so proud of you." });
      //used https://developer.chrome.com/docs/extensions/reference/notifications/ for help on syntax
      chrome.notifications.create('', {
        title: 'Good Work Today!!',
        message: "I'm so proud of you.",
        iconUrl: '/assets/end.png',
        type: 'basic',
      });
    });
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  } else if (request.command === 'load') {
    if (state === 'on') {
      chrome.runtime.sendMessage({ status: 'progress' });
    }
  }
});

// Listen for updates on any tab.
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // If the extension is off, we do nothing.
  if (state !== 'on') {
    return;
  }

  let clock = Math.floor(Math.random() * (600000 - 180000) + 180000);

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
        //used https://developer.chrome.com/docs/extensions/reference/notifications/ for help on syntax
        chrome.notifications.create('', {
          title: 'What are YOU doing?!',
          message: message,
          iconUrl: '/assets/bad.png',
          type: 'basic',
        });

        // Clear any existing timer.
        if (timer) {
          clearTimeout(timer);
          timer = null;
        }

        // Set a timer to send negative messages
        setTimeout(() => {
          if (currentSite === site) {
            message =
              negativeMessages[
                Math.floor(Math.random() * negativeMessages.length)
              ];
            console.log('Sending negative message after 1 minute:', message);
            chrome.tabs.sendMessage(tabId, { message: message });
            //used https://developer.chrome.com/docs/extensions/reference/notifications/ for help on syntax
            chrome.notifications.create('', {
              title: 'GET OFF ALREADY!!',
              message: message,
              iconUrl: '/assets/bad.png',
              type: 'basic',
            });

            // Sending third negative message after 2 more minutes
            setTimeout(() => {
              if (currentSite === site) {
                const message =
                  negativeMessages[
                    Math.floor(Math.random() * negativeMessages.length)
                  ];
                console.log(
                  'Sending negative message after 2 more minutes: ',
                  message
                );
                chrome.tabs.sendMessage(tabId, { message: message });
                //used https://developer.chrome.com/docs/extensions/reference/notifications/ for help on syntax
                chrome.notifications.create('', {
                  title: 'SIGH Do you HATE ME?!',
                  message: message,
                  iconUrl: '/assets/bad.png',
                  type: 'basic',
                });

                // Send final message after 3 more minutes
                setTimeout(() => {
                  if (currentSite === site) {
                    chrome.tabs.sendMessage(tabId, {
                      message: 'Grandma has died....',
                    });
                    console.log('Grandma died message sent');
                    //used https://developer.chrome.com/docs/extensions/reference/notifications/ for help on syntax
                    chrome.notifications.create('', {
                      title: 'SHAME ON YOU!',
                      message: 'Grandma has died....',
                      iconUrl: '/assets/heaven.png',
                      type: 'basic',
                    });

                    // Speak the final message
                    chrome.tts.speak('Grandma has died.');
                  }
                }, 180000); // 3 more minutes have passed
              }
            }, 120000); // 2 more minutes have passed
          }
        }, 60000); // 1 minute have passed
      }
    } else {
      // If the site is not a social media site and there's no timer currently set,
      // set a timer to send a positive message
      if (!timer) {
        timer = setTimeout(() => {
          const message =
            affirmations[Math.floor(Math.random() * affirmations.length)];
          console.log('Sending positive message:', message);
          chrome.tabs.sendMessage(tabId, { message: message });
          //used https://developer.chrome.com/docs/extensions/reference/notifications/ for help on syntax
          chrome.notifications.create('', {
            title: 'Good Job!!',
            message: message,
            iconUrl: '/assets/good.png',
            type: 'basic',
          });
          timer = null;
        }, clock);
      }
    }
    // Update the current site.
    currentSite = site;
  }
});
