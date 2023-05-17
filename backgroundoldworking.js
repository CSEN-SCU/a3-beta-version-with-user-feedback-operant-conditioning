console.log("background.js loaded");

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
    'www.spotify.com'
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
  "Oh, I could just hug you! Keep up the great work!",
  "You're making progress like a champ! Don't stop now!"
];

const negativeMessages = [
  "Get off that Facebook, young whippersnapper, and get back to work!",
  "Quit your Tweetin' and focus, or you'll feel my wrath!",
  "Oh, so you're on Instagram? How about Insta-GRANDMA? Now focus!",
  "Snap out of your Snapchat and snap into productivity!",
  "TikTok, TikTok, time's a-wastin'! Stop scrolling and start working!",
  "You better LinkedIn with your task, or I'll come after you!",
  "Pinterest-ing choice, but not when you have work to do!",
  "I see you on YouTube, but I'd rather you be on You-Do-Your-Task!",
  "Reddit all about it: Grandma's not happy when you're not working!",
  "Whatsapp with all this distraction? Get back to your task!"
];

let timer = null;
let state = 'off';
let currentSite = '';

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.command === 'start') {
    state = 'on';
    console.log('Extension started');
  } else if (request.command === 'stop') {
    state = 'off';
    if (timer) {
      clearTimeout(timer);
    }
    console.log('Extension stopped');
  }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (state !== 'on') {
    return;
  }

  if (changeInfo.status === 'complete') {
    const site = new URL(tab.url).hostname;

    if (socialMediaSites.includes(site)) {
      if (currentSite !== site) {
        state = 'negative';
        const message = negativeMessages[Math.floor(Math.random() * negativeMessages.length)];
        console.log('Sending negative message:', message);
        chrome.notifications.create({
          type: 'basic',
          iconUrl: 'images/icon128.png',
          title: 'Angry Grandma',
          message: message
        });

        if (timer) {
          clearTimeout(timer);
        }
        let timeSpent = 0;
        timer = setInterval(() => {
          timeSpent++;
          if (timeSpent === 1) {
            chrome.notifications.create({
              type: 'basic',
              iconUrl: 'images/icon128.png',
              title: 'Angry Grandma',
              message: 'Charge!'
            });
            console.log('Sent Charge! message');
            clearTimeout(timer);
          }
        }, 60000); // 1 minute
      }
    } else {
      state = 'positive';
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        if (state === 'positive') {
          const message = affirmations[Math.floor(Math.random() * affirmations.length)];
          console.log('Sending positive message:', message);
          chrome.notifications.create({
            type: 'basic',
            iconUrl: 'images/icon128.png',
            title: 'Angry Grandma',
            message: message
          });
        }
      }, 60000); // 1 minute
    }

    currentSite = site;
  }
});
