// Catalog of all 80+ supported services in the Franz Multi-Messenger Wrapper
export interface FranzServiceDefinition {
  id: string;
  name: string;
  category: "popular" | "messaging" | "email" | "productivity" | "social" | "custom";
  isPopular?: boolean;
  defaultUrl: string;
  iconType: string; // identifier for icon rendering
  brandColor: string;
  badgeCount?: number;
  description: string;
  recipeDevPath?: string;
  userAgent?: string;
  supportsDarkTheme?: boolean;
}

export const ALL_FRANZ_SERVICES: FranzServiceDefinition[] = [
  // --- MOST POPULAR SERVICES ---
  {
    id: "onekey",
    name: "ONE KEY",
    category: "popular",
    isPopular: true,
    defaultUrl: "https://web.onekey.so",
    iconType: "onekey",
    brandColor: "#00B812",
    description: "Next-gen Web3 crypto wallet with real-time Tron TRC-20 USDT sync (TDJrjt9rmGjR5WwzmRvZL1aw7Nioi6ksG).",
    recipeDevPath: "C:\\Users\\PC\\AppData\\Roaming\\Franz\\recipes\\dev\\onekey"
  },
  {
    id: "whatsapp",
    name: "WhatsApp",
    category: "popular",
    isPopular: true,
    defaultUrl: "https://web.whatsapp.com",
    iconType: "whatsapp",
    brandColor: "#25D366",
    description: "Simple. Personal. Real-time messaging and calls across all devices.",
    recipeDevPath: "C:\\Users\\PC\\AppData\\Roaming\\Franz\\recipes\\dev\\whatsapp"
  },
  {
    id: "telegram",
    name: "Telegram",
    category: "popular",
    isPopular: true,
    defaultUrl: "https://web.telegram.org/k/",
    iconType: "telegram",
    brandColor: "#0088cc",
    description: "Fast and secure cloud-based mobile and desktop messaging app.",
    recipeDevPath: "C:\\Users\\PC\\AppData\\Roaming\\Franz\\recipes\\dev\\telegram"
  },
  {
    id: "messenger",
    name: "Messenger",
    category: "popular",
    isPopular: true,
    defaultUrl: "https://www.messenger.com",
    iconType: "messenger",
    brandColor: "#0084FF",
    description: "Connect with your friends and family on Facebook Messenger.",
    recipeDevPath: "C:\\Users\\PC\\AppData\\Roaming\\Franz\\recipes\\dev\\messenger"
  },
  {
    id: "slack",
    name: "Slack",
    category: "popular",
    isPopular: true,
    defaultUrl: "https://app.slack.com/client",
    iconType: "slack",
    brandColor: "#4A154B",
    description: "Team communication and collaboration for productive workplaces.",
    recipeDevPath: "C:\\Users\\PC\\AppData\\Roaming\\Franz\\recipes\\dev\\slack"
  },
  {
    id: "gmail",
    name: "Gmail",
    category: "popular",
    isPopular: true,
    defaultUrl: "https://mail.google.com",
    iconType: "gmail",
    brandColor: "#EA4335",
    description: "Secure, smart, and easy to use email by Google.",
    recipeDevPath: "C:\\Users\\PC\\AppData\\Roaming\\Franz\\recipes\\dev\\gmail"
  },
  {
    id: "skype",
    name: "Skype",
    category: "popular",
    isPopular: true,
    defaultUrl: "https://web.skype.com",
    iconType: "skype",
    brandColor: "#00AFF0",
    description: "Stay in touch with free video chat, messaging, and affordable calls.",
    recipeDevPath: "C:\\Users\\PC\\AppData\\Roaming\\Franz\\recipes\\dev\\skype"
  },
  {
    id: "android-messages",
    name: "Android Messages",
    category: "popular",
    isPopular: true,
    defaultUrl: "https://messages.google.com/web",
    iconType: "android-messages",
    brandColor: "#1A73E8",
    description: "Text on your computer with Messages for web by Google.",
    recipeDevPath: "C:\\Users\\PC\\AppData\\Roaming\\Franz\\recipes\\dev\\android-messages"
  },
  {
    id: "discord",
    name: "Discord",
    category: "popular",
    isPopular: true,
    defaultUrl: "https://discord.com/app",
    iconType: "discord",
    brandColor: "#5865F2",
    description: "Your place to talk, chat, hang out, and stay close with friends.",
    recipeDevPath: "C:\\Users\\PC\\AppData\\Roaming\\Franz\\recipes\\dev\\discord"
  },
  {
    id: "google-calendar",
    name: "Google Calendar",
    category: "popular",
    isPopular: true,
    defaultUrl: "https://calendar.google.com",
    iconType: "calendar",
    brandColor: "#4285F4",
    description: "Time-management and scheduling calendar service by Google.",
    recipeDevPath: "C:\\Users\\PC\\AppData\\Roaming\\Franz\\recipes\\dev\\google-calendar"
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    category: "popular",
    isPopular: true,
    defaultUrl: "https://www.linkedin.com/messaging",
    iconType: "linkedin",
    brandColor: "#0A66C2",
    description: "Manage your professional identity. Build and engage with your network.",
    recipeDevPath: "C:\\Users\\PC\\AppData\\Roaming\\Franz\\recipes\\dev\\linkedin"
  },
  {
    id: "trello",
    name: "Trello",
    category: "popular",
    isPopular: true,
    defaultUrl: "https://trello.com",
    iconType: "trello",
    brandColor: "#0079BF",
    description: "Collaborate, manage projects, and reach new productivity peaks.",
    recipeDevPath: "C:\\Users\\PC\\AppData\\Roaming\\Franz\\recipes\\dev\\trello"
  },
  {
    id: "franz-todos",
    name: "Franz ToDos",
    category: "popular",
    isPopular: true,
    defaultUrl: "https://todos.meetfranz.com",
    iconType: "franz-todos",
    brandColor: "#1DA1F2",
    description: "Built-in Franz task manager and checklist organizer.",
    recipeDevPath: "C:\\Users\\PC\\AppData\\Roaming\\Franz\\recipes\\dev\\franz-todos"
  },
  {
    id: "instagram",
    name: "Instagram",
    category: "popular",
    isPopular: true,
    defaultUrl: "https://www.instagram.com/direct/inbox/",
    iconType: "instagram",
    brandColor: "#E1306C",
    description: "Direct messaging, stories, and social sharing on Instagram.",
    recipeDevPath: "C:\\Users\\PC\\AppData\\Roaming\\Franz\\recipes\\dev\\instagram"
  },
  {
    id: "chatgpt",
    name: "ChatGPT",
    category: "popular",
    isPopular: true,
    defaultUrl: "https://chatgpt.com",
    iconType: "chatgpt",
    brandColor: "#10a37f",
    description: "Conversational artificial intelligence assistant and workflow co-pilot.",
    recipeDevPath: "C:\\Users\\PC\\AppData\\Roaming\\Franz\\recipes\\dev\\chatgpt"
  },
  {
    id: "celestimind",
    name: "CELESTIMIND",
    category: "popular",
    isPopular: true,
    defaultUrl: "https://alphaqubit.io/celestimind",
    iconType: "celestimind",
    brandColor: "#FF6600",
    description: "Quantum intelligent computing neural hub and enterprise workstation.",
    recipeDevPath: "C:\\Users\\PC\\AppData\\Roaming\\Franz\\recipes\\dev\\celestimind"
  },

  // --- ALL SPECIFIC SERVICES REQUESTED BY USER ---
  {
    id: "bip",
    name: "BiP",
    category: "messaging",
    defaultUrl: "https://web.bip.com",
    iconType: "bip",
    brandColor: "#00B4D8",
    description: "Secure, fast, and feature-rich instant messaging platform.",
    recipeDevPath: "C:\\Users\\PC\\AppData\\Roaming\\Franz\\recipes\\dev\\bip"
  },
  {
    id: "chatwork",
    name: "Chatwork",
    category: "messaging",
    defaultUrl: "https://www.chatwork.com",
    iconType: "chatwork",
    brandColor: "#FF3366",
    description: "Business chat tool that integrates chat, task management, and video calls.",
    recipeDevPath: "C:\\Users\\PC\\AppData\\Roaming\\Franz\\recipes\\dev\\chatwork"
  },
  {
    id: "custom-website",
    name: "Custom Website",
    category: "custom",
    isPopular: true,
    defaultUrl: "https://earnings.ink",
    iconType: "custom-website",
    brandColor: "#0088ff",
    description: "Add any custom website, intranet, portal, or web service with isolated session.",
    recipeDevPath: "C:\\Users\\PC\\AppData\\Roaming\\Franz\\recipes\\dev\\custom-website"
  },
  {
    id: "element",
    name: "Element",
    category: "messaging",
    defaultUrl: "https://app.element.io",
    iconType: "element",
    brandColor: "#0DBD8B",
    description: "Secure collaboration and messaging powered by the Matrix network.",
    recipeDevPath: "C:\\Users\\PC\\AppData\\Roaming\\Franz\\recipes\\dev\\element"
  },
  {
    id: "fastmail",
    name: "Fastmail",
    category: "email",
    defaultUrl: "https://app.fastmail.com",
    iconType: "fastmail",
    brandColor: "#2F54EB",
    description: "Private, secure email, calendars, and contacts that put you first.",
    recipeDevPath: "C:\\Users\\PC\\AppData\\Roaming\\Franz\\recipes\\dev\\fastmail"
  },
  {
    id: "flowdock",
    name: "Flowdock",
    category: "messaging",
    defaultUrl: "https://www.flowdock.com/app",
    iconType: "flowdock",
    brandColor: "#00A8FF",
    description: "Team collaboration chat app with threaded team inboxes.",
    recipeDevPath: "C:\\Users\\PC\\AppData\\Roaming\\Franz\\recipes\\dev\\flowdock"
  },
  {
    id: "frost-todos",
    name: "Frost ToDos",
    category: "productivity",
    defaultUrl: "https://frost-todos.app",
    iconType: "frost-todos",
    brandColor: "#00b4d8",
    description: "Lightweight and frosty task planner for agile workflows.",
    recipeDevPath: "C:\\Users\\PC\\AppData\\Roaming\\Franz\\recipes\\dev\\frost-todos"
  },
  {
    id: "gadu-gadu",
    name: "Gadu-Gadu",
    category: "messaging",
    defaultUrl: "https://www.gg.pl",
    iconType: "gadu-gadu",
    brandColor: "#FFCC00",
    description: "Popular instant messaging service with warm sunshine branding.",
    recipeDevPath: "C:\\Users\\PC\\AppData\\Roaming\\Franz\\recipes\\dev\\gadu-gadu"
  },
  {
    id: "gigahog",
    name: "Gigahog",
    category: "productivity",
    defaultUrl: "https://gigahog.io",
    iconType: "gigahog",
    brandColor: "#9b5de5",
    description: "High-throughput data streaming and collaboration utility.",
    recipeDevPath: "C:\\Users\\PC\\AppData\\Roaming\\Franz\\recipes\\dev\\gigahog"
  },
  {
    id: "glitter",
    name: "Glitter",
    category: "social",
    defaultUrl: "https://glitter.social",
    iconType: "glitter",
    brandColor: "#f15bb5",
    description: "Vibrant social communication and micro-community hub.",
    recipeDevPath: "C:\\Users\\PC\\AppData\\Roaming\\Franz\\recipes\\dev\\glitter"
  },
  {
    id: "glowing-bear",
    name: "Glowing Bear",
    category: "messaging",
    defaultUrl: "https://www.glowing-bear.org",
    iconType: "glowing-bear",
    brandColor: "#e0a96d",
    description: "Web frontend for WeeChat with modern design and encrypted sockets.",
    recipeDevPath: "C:\\Users\\PC\\AppData\\Roaming\\Franz\\recipes\\dev\\glowing-bear"
  },
  {
    id: "google-chat",
    name: "Google Chat",
    category: "messaging",
    defaultUrl: "https://chat.google.com",
    iconType: "google-chat",
    brandColor: "#00AC47",
    description: "Intelligent and secure communications tool built for teams.",
    recipeDevPath: "C:\\Users\\PC\\AppData\\Roaming\\Franz\\recipes\\dev\\google-chat"
  },
  {
    id: "google-keep",
    name: "Google Keep",
    category: "productivity",
    defaultUrl: "https://keep.google.com",
    iconType: "google-keep",
    brandColor: "#FBBC04",
    description: "Capture notes, lists, photos, and audio on Google Keep.",
    recipeDevPath: "C:\\Users\\PC\\AppData\\Roaming\\Franz\\recipes\\dev\\google-keep"
  },
  {
    id: "google-voice",
    name: "Google Voice",
    category: "messaging",
    defaultUrl: "https://voice.google.com",
    iconType: "google-voice",
    brandColor: "#34A853",
    description: "A smarter phone number that works across your smartphones and the web.",
    recipeDevPath: "C:\\Users\\PC\\AppData\\Roaming\\Franz\\recipes\\dev\\google-voice"
  },
  {
    id: "grape",
    name: "Grape",
    category: "messaging",
    defaultUrl: "https://chatgrape.com",
    iconType: "grape",
    brandColor: "#673AB7",
    description: "Secure business chat solution tailored for on-premise deployments.",
    recipeDevPath: "C:\\Users\\PC\\AppData\\Roaming\\Franz\\recipes\\dev\\grape"
  },
  {
    id: "groupme",
    name: "GroupMe",
    category: "messaging",
    defaultUrl: "https://web.groupme.com",
    iconType: "groupme",
    brandColor: "#00AFF0",
    description: "The free, simple way to stay connected with those who matter most.",
    recipeDevPath: "C:\\Users\\PC\\AppData\\Roaming\\Franz\\recipes\\dev\\groupme"
  },
  {
    id: "hangouts",
    name: "Hangouts",
    category: "messaging",
    defaultUrl: "https://hangouts.google.com",
    iconType: "hangouts",
    brandColor: "#0F9D58",
    description: "Classic Google Hangouts messaging and video hangout portal.",
    recipeDevPath: "C:\\Users\\PC\\AppData\\Roaming\\Franz\\recipes\\dev\\hangouts"
  },
  {
    id: "hangouts-chat",
    name: "Hangouts Chat",
    category: "messaging",
    defaultUrl: "https://chat.google.com",
    iconType: "hangouts-chat",
    brandColor: "#00897B",
    description: "Google Workspace team chat and rooms with enterprise bots.",
    recipeDevPath: "C:\\Users\\PC\\AppData\\Roaming\\Franz\\recipes\\dev\\hangouts-chat"
  },
  {
    id: "hipchat",
    name: "HipChat",
    category: "messaging",
    defaultUrl: "https://www.hipchat.com",
    iconType: "hipchat",
    brandColor: "#205081",
    description: "Hosted group chat and video chat built for teams and development.",
    recipeDevPath: "C:\\Users\\PC\\AppData\\Roaming\\Franz\\recipes\\dev\\hipchat"
  },
  {
    id: "icloud",
    name: "iCloud",
    category: "email",
    defaultUrl: "https://www.icloud.com",
    iconType: "icloud",
    brandColor: "#0070c9",
    description: "Access your iCloud Mail, Calendar, Notes, and Reminders anywhere.",
    recipeDevPath: "C:\\Users\\PC\\AppData\\Roaming\\Franz\\recipes\\dev\\icloud"
  },
  {
    id: "icq",
    name: "ICQ",
    category: "messaging",
    defaultUrl: "https://web.icq.com",
    iconType: "icq",
    brandColor: "#7CB342",
    description: "Classic and upgraded instant messaging with live voice and video.",
    recipeDevPath: "C:\\Users\\PC\\AppData\\Roaming\\Franz\\recipes\\dev\\icq"
  },
  {
    id: "idobata",
    name: "Idobata",
    category: "messaging",
    defaultUrl: "https://idobata.io",
    iconType: "idobata",
    brandColor: "#F4511E",
    description: "Chat tool for developer teams with rich markdown and webhook bots.",
    recipeDevPath: "C:\\Users\\PC\\AppData\\Roaming\\Franz\\recipes\\dev\\idobata"
  },
  {
    id: "imo",
    name: "Imo",
    category: "messaging",
    defaultUrl: "https://imo.im",
    iconType: "imo",
    brandColor: "#0288D1",
    description: "Free video calls and chat over low-bandwidth mobile and web.",
    recipeDevPath: "C:\\Users\\PC\\AppData\\Roaming\\Franz\\recipes\\dev\\imo"
  },
  {
    id: "inbox",
    name: "Inbox",
    category: "email",
    defaultUrl: "https://inbox.google.com",
    iconType: "inbox",
    brandColor: "#1E88E5",
    description: "Smart email bundling and reminders by Google Inbox.",
    recipeDevPath: "C:\\Users\\PC\\AppData\\Roaming\\Franz\\recipes\\dev\\inbox"
  },
  {
    id: "irccloud",
    name: "IRCCloud",
    category: "messaging",
    defaultUrl: "https://www.irccloud.com",
    iconType: "irccloud",
    brandColor: "#3F51B5",
    description: "Modern IRC client in your browser that stays connected forever.",
    recipeDevPath: "C:\\Users\\PC\\AppData\\Roaming\\Franz\\recipes\\dev\\irccloud"
  },
  {
    id: "mailbox-org",
    name: "mailbox org",
    category: "email",
    defaultUrl: "https://login.mailbox.org",
    iconType: "mailbox-org",
    brandColor: "#43A047",
    description: "Secure, ad-free, eco-friendly email and cloud storage from Germany.",
    recipeDevPath: "C:\\Users\\PC\\AppData\\Roaming\\Franz\\recipes\\dev\\mailbox-org"
  },
  {
    id: "mattermost",
    name: "Mattermost",
    category: "messaging",
    defaultUrl: "https://mattermost.com",
    iconType: "mattermost",
    brandColor: "#0072C6",
    description: "Open source platform for developer collaboration, workflow, and chat.",
    recipeDevPath: "C:\\Users\\PC\\AppData\\Roaming\\Franz\\recipes\\dev\\mattermost"
  },
  {
    id: "meta-business-messenger",
    name: "Meta Business Messenger",
    category: "messaging",
    defaultUrl: "https://business.facebook.com/latest/inbox",
    iconType: "meta-business",
    brandColor: "#0080FB",
    description: "Unify Instagram DMs and Facebook business customer messages.",
    recipeDevPath: "C:\\Users\\PC\\AppData\\Roaming\\Franz\\recipes\\dev\\meta-business-messenger"
  },
  {
    id: "microsoft-kaizala",
    name: "Microsoft Kaizala",
    category: "messaging",
    defaultUrl: "https://manage.kaiza.la",
    iconType: "kaizala",
    brandColor: "#0078D4",
    description: "Mobile chat-based work management software by Microsoft.",
    recipeDevPath: "C:\\Users\\PC\\AppData\\Roaming\\Franz\\recipes\\dev\\microsoft-kaizala"
  },
  {
    id: "microsoft-teams",
    name: "Microsoft Teams",
    category: "messaging",
    isPopular: true,
    defaultUrl: "https://teams.microsoft.com",
    iconType: "teams",
    brandColor: "#5059C9",
    description: "Meet, chat, call, and collaborate in one place from anywhere.",
    recipeDevPath: "C:\\Users\\PC\\AppData\\Roaming\\Franz\\recipes\\dev\\microsoft-teams"
  },
  {
    id: "mysms",
    name: "MySMS",
    category: "messaging",
    defaultUrl: "https://app.mysms.com",
    iconType: "mysms",
    brandColor: "#00C853",
    description: "Text from any computer or tablet using your existing phone number.",
    recipeDevPath: "C:\\Users\\PC\\AppData\\Roaming\\Franz\\recipes\\dev\\mysms"
  },
  {
    id: "nextcloud",
    name: "Nextcloud",
    category: "productivity",
    defaultUrl: "https://nextcloud.com",
    iconType: "nextcloud",
    brandColor: "#0082C9",
    description: "Self-hosted productivity platform keeping your enterprise in control.",
    recipeDevPath: "C:\\Users\\PC\\AppData\\Roaming\\Franz\\recipes\\dev\\nextcloud"
  },
  {
    id: "nextcloud-talk",
    name: "Nextcloud Talk",
    category: "messaging",
    defaultUrl: "https://nextcloud.com/talk",
    iconType: "nextcloud-talk",
    brandColor: "#0074B7",
    description: "On-premises audio/video conferencing and text chat by Nextcloud.",
    recipeDevPath: "C:\\Users\\PC\\AppData\\Roaming\\Franz\\recipes\\dev\\nextcloud-talk"
  },
  {
    id: "outlook",
    name: "Outlook",
    category: "email",
    isPopular: true,
    defaultUrl: "https://outlook.live.com",
    iconType: "outlook",
    brandColor: "#0078D4",
    description: "Free personal email and calendar from Microsoft.",
    recipeDevPath: "C:\\Users\\PC\\AppData\\Roaming\\Franz\\recipes\\dev\\outlook"
  },
  {
    id: "outlook-m365",
    name: "Outlook Microsoft 365",
    category: "email",
    defaultUrl: "https://outlook.office.com",
    iconType: "outlook-m365",
    brandColor: "#D83B01",
    description: "Enterprise email, calendaring, and contacts with Microsoft 365.",
    recipeDevPath: "C:\\Users\\PC\\AppData\\Roaming\\Franz\\recipes\\dev\\outlook-m365"
  },
  {
    id: "plonk",
    name: "Plonk",
    category: "messaging",
    defaultUrl: "https://plonk.io",
    iconType: "plonk",
    brandColor: "#FF5722",
    description: "Fast messaging drop-in with custom micro-channels.",
    recipeDevPath: "C:\\Users\\PC\\AppData\\Roaming\\Franz\\recipes\\dev\\plonk"
  },
  {
    id: "pocket",
    name: "Pocket",
    category: "productivity",
    defaultUrl: "https://getpocket.com",
    iconType: "pocket",
    brandColor: "#EE4056",
    description: "Save articles, videos, and stories to read or view anywhere later.",
    recipeDevPath: "C:\\Users\\PC\\AppData\\Roaming\\Franz\\recipes\\dev\\pocket"
  },
  {
    id: "protonmail",
    name: "ProtonMail",
    category: "email",
    isPopular: true,
    defaultUrl: "https://mail.proton.me",
    iconType: "protonmail",
    brandColor: "#6D4AFF",
    description: "Secure email based in Switzerland with end-to-end encryption.",
    recipeDevPath: "C:\\Users\\PC\\AppData\\Roaming\\Franz\\recipes\\dev\\protonmail"
  },
  {
    id: "pulse-sms",
    name: "Pulse SMS",
    category: "messaging",
    defaultUrl: "https://messenger.pulsesms.app",
    iconType: "pulse-sms",
    brandColor: "#5C6BC0",
    description: "Fast, beautiful, next-generation SMS and MMS across all devices.",
    recipeDevPath: "C:\\Users\\PC\\AppData\\Roaming\\Franz\\recipes\\dev\\pulse-sms"
  },
  {
    id: "pushbullet",
    name: "Pushbullet",
    category: "productivity",
    defaultUrl: "https://www.pushbullet.com",
    iconType: "pushbullet",
    brandColor: "#4CAF50",
    description: "Connecting your devices. Send links, files, and reply to SMS from PC.",
    recipeDevPath: "C:\\Users\\PC\\AppData\\Roaming\\Franz\\recipes\\dev\\pushbullet"
  },
  {
    id: "rainloop",
    name: "Rain Loop",
    category: "email",
    defaultUrl: "https://www.rainloop.net",
    iconType: "rainloop",
    brandColor: "#29B6F6",
    description: "Simple, modern, and fast web-based email client.",
    recipeDevPath: "C:\\Users\\PC\\AppData\\Roaming\\Franz\\recipes\\dev\\rainloop"
  },
  {
    id: "rocketchat",
    name: "Rocket Chat",
    category: "messaging",
    defaultUrl: "https://rocket.chat",
    iconType: "rocketchat",
    brandColor: "#F5455C",
    description: "Secure, compliant team collaboration engine for regulated industries.",
    recipeDevPath: "C:\\Users\\PC\\AppData\\Roaming\\Franz\\recipes\\dev\\rocketchat"
  },
  {
    id: "roundcube",
    name: "Roundcube",
    category: "email",
    defaultUrl: "https://roundcube.net",
    iconType: "roundcube",
    brandColor: "#37474F",
    description: "Browser-based multilingual IMAP webmail client with application UI.",
    recipeDevPath: "C:\\Users\\PC\\AppData\\Roaming\\Franz\\recipes\\dev\\roundcube"
  },
  {
    id: "send-tasks",
    name: "Send Tasks",
    category: "productivity",
    defaultUrl: "https://sendtasks.app",
    iconType: "send-tasks",
    brandColor: "#AB47BC",
    description: "Delegate tasks cleanly to anyone via email and web links.",
    recipeDevPath: "C:\\Users\\PC\\AppData\\Roaming\\Franz\\recipes\\dev\\send-tasks"
  },
  {
    id: "spectrum",
    name: "Spectrum",
    category: "social",
    defaultUrl: "https://spectrum.chat",
    iconType: "spectrum",
    brandColor: "#7B1FA2",
    description: "The community platform for developers, designers, and creatives.",
    recipeDevPath: "C:\\Users\\PC\\AppData\\Roaming\\Franz\\recipes\\dev\\spectrum"
  },
  {
    id: "steamchat",
    name: "SteamChat",
    category: "social",
    defaultUrl: "https://steamcommunity.com/chat",
    iconType: "steamchat",
    brandColor: "#171A21",
    description: "Chat with your Steam friends, group channels, and gaming clans.",
    recipeDevPath: "C:\\Users\\PC\\AppData\\Roaming\\Franz\\recipes\\dev\\steamchat"
  },
  {
    id: "stride",
    name: "Stride",
    category: "messaging",
    defaultUrl: "https://stride.com",
    iconType: "stride",
    brandColor: "#0052CC",
    description: "Team chat, built-in meetings, and integrated collaboration.",
    recipeDevPath: "C:\\Users\\PC\\AppData\\Roaming\\Franz\\recipes\\dev\\stride"
  },
  {
    id: "tawk-to",
    name: "Tawk to",
    category: "messaging",
    defaultUrl: "https://dashboard.tawk.to",
    iconType: "tawk-to",
    brandColor: "#00B44B",
    description: "100% free live chat software to monitor and chat with visitors.",
    recipeDevPath: "C:\\Users\\PC\\AppData\\Roaming\\Franz\\recipes\\dev\\tawk-to"
  },
  {
    id: "teamwork-projects",
    name: "Teamwork Projects",
    category: "productivity",
    defaultUrl: "https://www.teamwork.com",
    iconType: "teamwork",
    brandColor: "#263238",
    description: "Client work and project management software crafted for teams.",
    recipeDevPath: "C:\\Users\\PC\\AppData\\Roaming\\Franz\\recipes\\dev\\teamwork-projects"
  },
  {
    id: "the-lounge",
    name: "The Lounge",
    category: "messaging",
    defaultUrl: "https://thelounge.chat",
    iconType: "the-lounge",
    brandColor: "#E91E63",
    description: "Modern, responsive self-hosted web IRC client that never sleeps.",
    recipeDevPath: "C:\\Users\\PC\\AppData\\Roaming\\Franz\\recipes\\dev\\the-lounge"
  },
  {
    id: "threema",
    name: "Threema",
    category: "messaging",
    defaultUrl: "https://web.threema.ch",
    iconType: "threema",
    brandColor: "#212121",
    description: "The secure messaging app that places privacy and encryption first.",
    recipeDevPath: "C:\\Users\\PC\\AppData\\Roaming\\Franz\\recipes\\dev\\threema"
  },
  {
    id: "todoist",
    name: "Todoist",
    category: "productivity",
    defaultUrl: "https://todoist.com/app",
    iconType: "todoist",
    brandColor: "#E44332",
    description: "Organize work and life with the world’s top productivity and task app.",
    recipeDevPath: "C:\\Users\\PC\\AppData\\Roaming\\Franz\\recipes\\dev\\todoist"
  },
  {
    id: "toggl",
    name: "Toggl",
    category: "productivity",
    defaultUrl: "https://track.toggl.com",
    iconType: "toggl",
    brandColor: "#E57373",
    description: "Effortless time tracking and reporting for work and freelance projects.",
    recipeDevPath: "C:\\Users\\PC\\AppData\\Roaming\\Franz\\recipes\\dev\\toggl"
  },
  {
    id: "tweetdeck",
    name: "TweetDeck",
    category: "social",
    defaultUrl: "https://tweetdeck.twitter.com",
    iconType: "tweetdeck",
    brandColor: "#1DA1F2",
    description: "Multi-column real-time feeds, lists, and activity streams on X.",
    recipeDevPath: "C:\\Users\\PC\\AppData\\Roaming\\Franz\\recipes\\dev\\tweetdeck"
  },
  {
    id: "twist",
    name: "Twist",
    category: "messaging",
    defaultUrl: "https://twist.com",
    iconType: "twist",
    brandColor: "#319795",
    description: "Asynchronous team communication app where conversations stay organized.",
    recipeDevPath: "C:\\Users\\PC\\AppData\\Roaming\\Franz\\recipes\\dev\\twist"
  },
  {
    id: "twitch",
    name: "Twitch",
    category: "social",
    defaultUrl: "https://www.twitch.tv",
    iconType: "twitch",
    brandColor: "#9146FF",
    description: "Live interactive streaming for gaming, music, talk shows, and esports.",
    recipeDevPath: "C:\\Users\\PC\\AppData\\Roaming\\Franz\\recipes\\dev\\twitch"
  },
  {
    id: "viva-engage",
    name: "Viva Engage",
    category: "social",
    defaultUrl: "https://web.yammer.com",
    iconType: "viva-engage",
    brandColor: "#0078D4",
    description: "Build community, share knowledge, and engage colleagues across Microsoft 365.",
    recipeDevPath: "C:\\Users\\PC\\AppData\\Roaming\\Franz\\recipes\\dev\\viva-engage"
  },
  {
    id: "vk",
    name: "VK",
    category: "social",
    defaultUrl: "https://vk.com",
    iconType: "vk",
    brandColor: "#4680C2",
    description: "Connect with friends and discover news, music, and social communities.",
    recipeDevPath: "C:\\Users\\PC\\AppData\\Roaming\\Franz\\recipes\\dev\\vk"
  },
  {
    id: "voxer",
    name: "Voxer",
    category: "messaging",
    defaultUrl: "https://web.voxer.com",
    iconType: "voxer",
    brandColor: "#FF8F00",
    description: "Walkie-talkie push-to-talk voice messaging for teams on the go.",
    recipeDevPath: "C:\\Users\\PC\\AppData\\Roaming\\Franz\\recipes\\dev\\voxer"
  },
  {
    id: "webex",
    name: "Webex",
    category: "messaging",
    defaultUrl: "https://web.webex.com",
    iconType: "webex",
    brandColor: "#002B49",
    description: "Cisco Webex video conferencing, meetings, and team messaging.",
    recipeDevPath: "C:\\Users\\PC\\AppData\\Roaming\\Franz\\recipes\\dev\\webex"
  },
  {
    id: "wechat",
    name: "WeChat",
    category: "messaging",
    defaultUrl: "https://web.wechat.com",
    iconType: "wechat",
    brandColor: "#07C160",
    description: "Connecting over a billion people with calls, chats, and lifestyle services.",
    recipeDevPath: "C:\\Users\\PC\\AppData\\Roaming\\Franz\\recipes\\dev\\wechat"
  },
  {
    id: "workplace",
    name: "Workplace",
    category: "social",
    defaultUrl: "https://workplace.meta.com",
    iconType: "workplace",
    brandColor: "#1877F2",
    description: "Business communication tool by Meta connecting your entire company.",
    recipeDevPath: "C:\\Users\\PC\\AppData\\Roaming\\Franz\\recipes\\dev\\workplace"
  },
  {
    id: "x",
    name: "X",
    category: "social",
    defaultUrl: "https://x.com/messages",
    iconType: "x",
    brandColor: "#000000",
    description: "Direct messages and real-time news on the global town square.",
    recipeDevPath: "C:\\Users\\PC\\AppData\\Roaming\\Franz\\recipes\\dev\\x"
  },
  {
    id: "xing",
    name: "Xing",
    category: "social",
    defaultUrl: "https://www.xing.com",
    iconType: "xing",
    brandColor: "#026466",
    description: "Professional networking platform for the German-speaking market.",
    recipeDevPath: "C:\\Users\\PC\\AppData\\Roaming\\Franz\\recipes\\dev\\xing"
  },
  {
    id: "zalo",
    name: "Zalo",
    category: "messaging",
    defaultUrl: "https://chat.zalo.me",
    iconType: "zalo",
    brandColor: "#0068FF",
    description: "Leading instant messaging and video call application in Vietnam.",
    recipeDevPath: "C:\\Users\\PC\\AppData\\Roaming\\Franz\\recipes\\dev\\zalo"
  },
  {
    id: "zendesk",
    name: "Zendesk",
    category: "productivity",
    defaultUrl: "https://www.zendesk.com",
    iconType: "zendesk",
    brandColor: "#03363D",
    description: "Customer service software and support ticketing system.",
    recipeDevPath: "C:\\Users\\PC\\AppData\\Roaming\\Franz\\recipes\\dev\\zendesk"
  },
  {
    id: "zoho-cliq",
    name: "Zoho Cliq",
    category: "messaging",
    defaultUrl: "https://cliq.zoho.com",
    iconType: "zoho-cliq",
    brandColor: "#E53935",
    description: "Simplify team communication and workflows with channels and bots.",
    recipeDevPath: "C:\\Users\\PC\\AppData\\Roaming\\Franz\\recipes\\dev\\zoho-cliq"
  },
  {
    id: "mail-com",
    name: "mail.com",
    category: "email",
    defaultUrl: "https://www.mail.com",
    iconType: "mail-com",
    brandColor: "#1A237E",
    description: "Free email accounts with over 200 distinctive domains and cloud storage.",
    recipeDevPath: "C:\\Users\\PC\\AppData\\Roaming\\Franz\\recipes\\dev\\mail-com"
  },
  {
    id: "earnings-ink",
    name: "earnings.ink",
    category: "custom",
    isPopular: true,
    defaultUrl: "https://earnings.ink",
    iconType: "earnings-ink",
    brandColor: "#10B981",
    description: "Executive monetized links, publisher revenue, and earnings dashboard.",
    recipeDevPath: "C:\\Users\\PC\\AppData\\Roaming\\Franz\\recipes\\dev\\earnings-ink"
  },
  {
    id: "zulip",
    name: "Zulip",
    category: "messaging",
    defaultUrl: "https://zulip.com",
    iconType: "zulip",
    brandColor: "#5B8BF7",
    description: "Organized team chat that combines the immediacy of Slack with email threading.",
    recipeDevPath: "C:\\Users\\PC\\AppData\\Roaming\\Franz\\recipes\\dev\\zulip"
  }
];

// Initial user instances matching the screenshot (18 accounts configured)
export interface ActiveFranzInstance {
  instanceId: string;
  serviceId: string;
  name: string;
  url: string;
  badge: number;
  isEnabled: boolean;
  isMuted: boolean;
  workspace: string; // 'all' | 'private' | 'office' | 'support' | custom
  zoomFactor: number;
  sessionPartition: string;
  userAgent?: string;
  order: number;
}

export const INITIAL_USER_INSTANCES: ActiveFranzInstance[] = [
  {
    instanceId: "inst-chatgpt-1",
    serviceId: "chatgpt",
    name: "ChatGPT",
    url: "https://chatgpt.com",
    badge: 0,
    isEnabled: true,
    isMuted: false,
    workspace: "all",
    zoomFactor: 1.0,
    sessionPartition: "persist:chatgpt_1",
    order: 0
  },
  {
    instanceId: "inst-tg-1",
    serviceId: "telegram",
    name: "Telegram (Main)",
    url: "https://web.telegram.org/k/",
    badge: 0,
    isEnabled: true,
    isMuted: false,
    workspace: "private",
    zoomFactor: 1.0,
    sessionPartition: "persist:telegram_1",
    order: 1
  },
  {
    instanceId: "inst-tg-2",
    serviceId: "telegram",
    name: "Telegram (VIP Channel)",
    url: "https://web.telegram.org/a/",
    badge: 0,
    isEnabled: true,
    isMuted: false,
    workspace: "private",
    zoomFactor: 1.0,
    sessionPartition: "persist:telegram_2",
    order: 2
  },
  {
    instanceId: "inst-tg-3",
    serviceId: "telegram",
    name: "Telegram (Ecosystem Bot)",
    url: "https://web.telegram.org/k/",
    badge: 0,
    isEnabled: true,
    isMuted: false,
    workspace: "office",
    zoomFactor: 1.0,
    sessionPartition: "persist:telegram_3",
    order: 3
  },
  {
    instanceId: "inst-tg-4",
    serviceId: "telegram",
    name: "Telegram (Support Desk)",
    url: "https://web.telegram.org/a/",
    badge: 0,
    isEnabled: true,
    isMuted: false,
    workspace: "support",
    zoomFactor: 1.0,
    sessionPartition: "persist:telegram_4",
    order: 4
  },
  {
    instanceId: "inst-wa-1",
    serviceId: "whatsapp",
    name: "WhatsApp (Primary)",
    url: "https://web.whatsapp.com",
    badge: 0,
    isEnabled: true,
    isMuted: false,
    workspace: "private",
    zoomFactor: 1.0,
    sessionPartition: "persist:whatsapp_1",
    order: 5
  },
  {
    instanceId: "inst-wa-2",
    serviceId: "whatsapp",
    name: "WhatsApp (Business)",
    url: "https://web.whatsapp.com",
    badge: 0,
    isEnabled: true,
    isMuted: false,
    workspace: "office",
    zoomFactor: 1.0,
    sessionPartition: "persist:whatsapp_2",
    order: 6
  },
  {
    instanceId: "inst-wa-3",
    serviceId: "whatsapp",
    name: "WhatsApp (VIP Direct)",
    url: "https://web.whatsapp.com",
    badge: 0,
    isEnabled: true,
    isMuted: false,
    workspace: "support",
    zoomFactor: 1.0,
    sessionPartition: "persist:whatsapp_3",
    order: 7
  },
  {
    instanceId: "inst-celestimind-1",
    serviceId: "celestimind",
    name: "CELESTIMIND",
    url: "https://alphaqubit.io/celestimind",
    badge: 0,
    isEnabled: true,
    isMuted: false,
    workspace: "office",
    zoomFactor: 1.0,
    sessionPartition: "persist:celestimind_1",
    order: 8
  },
  {
    instanceId: "inst-ig-1",
    serviceId: "instagram",
    name: "Instagram (Direct 1)",
    url: "https://www.instagram.com/direct/inbox/",
    badge: 3, // Matches screenshot 1 badge
    isEnabled: true,
    isMuted: false,
    workspace: "private",
    zoomFactor: 1.0,
    sessionPartition: "persist:instagram_1",
    order: 9
  },
  {
    instanceId: "inst-ig-2",
    serviceId: "instagram",
    name: "Instagram (Brand 2)",
    url: "https://www.instagram.com/direct/inbox/",
    badge: 0,
    isEnabled: true,
    isMuted: false,
    workspace: "office",
    zoomFactor: 1.0,
    sessionPartition: "persist:instagram_2",
    order: 10
  },
  {
    instanceId: "inst-ig-3",
    serviceId: "instagram",
    name: "Instagram (Creator 3)",
    url: "https://www.instagram.com/direct/inbox/",
    badge: 0,
    isEnabled: true,
    isMuted: false,
    workspace: "office",
    zoomFactor: 1.0,
    sessionPartition: "persist:instagram_3",
    order: 11
  },
  {
    instanceId: "inst-custom-1",
    serviceId: "custom-website",
    name: "Custom Website (earnings.ink)",
    url: "https://earnings.ink",
    badge: 0,
    isEnabled: true,
    isMuted: false,
    workspace: "office",
    zoomFactor: 1.0,
    sessionPartition: "persist:custom_1",
    order: 12
  },
  {
    instanceId: "inst-fb-1",
    serviceId: "meta-business-messenger",
    name: "Facebook Pages",
    url: "https://business.facebook.com/latest/inbox",
    badge: 0,
    isEnabled: true,
    isMuted: false,
    workspace: "office",
    zoomFactor: 1.0,
    sessionPartition: "persist:fb_1",
    order: 13
  },
  {
    instanceId: "inst-custom-2",
    serviceId: "custom-website",
    name: "Custom Website (Portal)",
    url: "https://my.alteryx.com",
    badge: 0,
    isEnabled: true,
    isMuted: false,
    workspace: "office",
    zoomFactor: 1.0,
    sessionPartition: "persist:custom_2",
    order: 14
  },
  {
    instanceId: "inst-tg-5",
    serviceId: "telegram",
    name: "Telegram (Executive)",
    url: "https://web.telegram.org/k/",
    badge: 0,
    isEnabled: true,
    isMuted: false,
    workspace: "office",
    zoomFactor: 1.0,
    sessionPartition: "persist:telegram_5",
    order: 15
  },
  {
    instanceId: "inst-ig-4",
    serviceId: "instagram",
    name: "Instagram (Personal)",
    url: "https://www.instagram.com/direct/inbox/",
    badge: 0,
    isEnabled: true,
    isMuted: false,
    workspace: "private",
    zoomFactor: 1.0,
    sessionPartition: "persist:instagram_4",
    order: 16
  },
  {
    instanceId: "inst-custom-3",
    serviceId: "custom-website",
    name: "Custom Website (Solscan Explorer)",
    url: "https://solscan.io",
    badge: 0,
    isEnabled: true,
    isMuted: false,
    workspace: "office",
    zoomFactor: 1.0,
    sessionPartition: "persist:custom_3",
    order: 17
  },
  {
    instanceId: "inst-onekey-1",
    serviceId: "onekey",
    name: "ONE KEY (TRC-20 USDT)",
    url: "https://web.onekey.so",
    badge: 0,
    isEnabled: true,
    isMuted: false,
    workspace: "all",
    zoomFactor: 1.0,
    sessionPartition: "persist:onekey_1",
    order: 18
  }
];
