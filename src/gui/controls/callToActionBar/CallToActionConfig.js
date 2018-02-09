"use strict";
app.screenConfig.callToAction = [
  { id: "ctaOrder",               key: ["Select"],     btn: "btnSelect",     text: "Order" },
  { id: "ctaClose",               key: ["Back"],       btn: "btnBack",       text: "callToActionClose" },
  { id: "ctaInfo",                key: ["Info"],       btn: "btnInfo",       text: "callToActionMoreInfo" },
  { id: "ctaFullDetails",         key: ["Info"],       btn: "btnInfo",       text: "callToActionFullDetails" },
  { id: "ctaUpDown",              key: [ "ArrowUp", "ArrowDown" ], btn: "btnUpDown",     text: "Channels" },
  { id: "ctaScrollText",          key: [ "ArrowUp", "ArrowDown" ], btn: "btnScrollText", text: "Scroll Text" },
  { id: "ctaRecord",              key: ["Record"],     btn: "btnRecord",     text: "callToActionRecord" },
  { id: "ctaCancelRecord",        key: ["Record"],     btn: "btnRecord",     text: "Cancel Recording" },
  { id: "ctaRecordOptions",       key: ["Record"],     btn: "btnRecord",     text: "Record Options" },
  { id: "ctaStartOver",           key: ["Play"],       btn: "btnPlay",       text: "callToActionStartOver" },
  { id: "ctaWatchNow",            key: ["Play"],       btn: "btnPlay",       text: "callToActionWatchNow" },
  { id: "ctaJumpTo",              key: ["Red"],        btn: "btnRed",        text: "Jump To" },
  { id: "ctaSortListings",        key: ["Red"],        btn: "btnRed",        text: "callToActionSortListings" },
  { id: "ctaOptions",             key: ["Yellow"],    btn: "btnOptions",    text: "Options" },
  { id: "ctaChannelView",         key: ["Green"],      btn: "btnGreen",      text: "callToActionChannelView" },
  { id: "ctaGridView",            key: ["Green"],      btn: "btnGreen",      text: "callToActionGridView" },
  { id: "ctaFfwdSkip",            key: ["FastForward"], btn: "btnFfwdSkip",   text: "+ 24 Hours" },
  { id: "ctaRwdSkip",             key: ["Rewind"],     btn: "btnRwdSkip",    text: "- 24 Hours" },
  { id: "ctaPageLeftRight",       key: [ "FastForward", "Rewind" ],    btn: "btnSkip",       text: "Page Left/Right" },
  { id: "ctaSkip24H",             key: [ "FastForward", "Rewind" ],    btn: "btnSkip",       text: "callToActionSkip24H" },
  { id: "ctaPageUpDown",          key: [ "ChannelDown", "ChannelUp" ], btn: "btnPageUpDown", text: "callToActionPageUpDown" },
  { id: "ctaClear",               key: ["Back"],       btn: "btnBack",       text: "Clear" },
  { id: "ctaUndoChanges",         key: ["Red"],        btn: "btnRed",        text: "Undo Changes" },
  { id: "ctaResetDefaults",       key: ["Red"],        btn: "btnRed",        text: "Reset to Defaults" },
  { id: "ctaCancel",              key: ["Back"],       btn: "btnBack",       text: "Cancel" },
  { id: "ctaDelete",              key: ["Yellow"],     btn: "btnYellow",     text: "Delete" },
  { id: "ctaRemove",              key: ["Yellow"],     btn: "btnYellow",     text: "callToActionRemove" },
  { id: "ctaOtherTimes",          key: ["Red"],        btn: "btnRed",        text: "Other Times" },

  // Planner Specific
  { id: "ctaPlus30",              key: ["Red"],        btn: "btnRed",        text: "+30mins" },
  { id: "ctaMinus30",             key: ["Red"],        btn: "btnRed",        text: "-30mins" },
  { id: "ctaAddSeries",           key: ["Green"],      btn: "btnGreen",      text: "Add Series Link" },
  { id: "ctaRemoveSeries",        key: ["Green"],      btn: "btnGreen",      text: "Remove Series Link" },
  { id: "ctaDelAll",              key: ["Options"],    btn: "btnOptions",    text: "Delete all" },
  { id: "ctaDel",                 key: ["Options"],    btn: "btnOptions",    text: "callToActionDelete" },
  { id: "ctaKeep",                key: ["Blue"],       btn: "btnBlue",       text: "callToActionKeep" },
  { id: "ctaDontKeep",            key: ["Blue"],       btn: "btnBlue",       text: "Don't Keep" },

  // Block Settings Specific
  { id: "ctaBlock",               key: ["Select"],     btn: "btnSelect",     text: "callToActionBlock" },
  { id: "ctaUnBlock",             key: ["Select"],     btn: "btnSelect",     text: "callToActionUnBlock" },
  { id: "ctaUnBlockAll",          key: ["Red"],        btn: "btnRed",        text: "callToActionUnBlockAll" },

  // Favourite Settings Specific
  { id: "ctaFavourite",           key: ["Star"],       btn: "btnStar",       text: "callToActionFavourite" },
  { id: "ctaUnFavourite",         key: ["Star"],       btn: "btnStar",       text: "callToActionUnFavourite" },
  { id: "ctaUnFavouriteAll",      key: ["Red"],        btn: "btnRed",        text: "callToActionUnFavouriteAll" },

  // Reminder Specific
  { id: "ctaSetReminder",         key: ["Blue"],      btn: "btnBlue",      text: "callToActionSetReminder" },
  { id: "ctaRemoveReminder",      key: ["Blue"],      btn: "btnBlue",      text: "Remove Reminder" },

  // App Drawer Specific
  { id: "ctaLaunchApp",           key: ["Select"],     btn: "btnSelect",     text: "callToActionLaunchApp" },
  { id: "ctaCloseAppDrawer",      key: ["Apps"],       btn: "btnApps",       text: "Close App Drawer" },

  // App Portal Specific
  { id: "ctaAddToAppDrawer",      key: ["Star"],       btn: "btnStar",       text: "Add To App Drawer" },
  { id: "ctaRemoveFromAppDrawer", key: ["Star"],       btn: "btnStar",       text: "Remove From App Drawer" },

  // Search Screen
  { id: "ctaSearchClose",         key: ["Back"],       btn: "btnBack",       text: "callToActionReturn" },
  { id: "ctaSearchDelete",        key: ["Back"],       btn: "btnBack",       text: "callToActionDelete" },
  { id: "ctaFilter",              key: ["Green"],      btn: "btnGreen",      text: "callToActionFilter" },

  // Keyboard Specific
  { id: "ctaFullSearch",          key: ["Red"],        btn: "btnRed",        text: "callToActionFullSearch" },
  { id: "ctaClearRecent",         key: ["Yellow"],     btn: "btnYellow",     text: "callToActionClearRecentSearches" },

  // Network Specific
  { id: "ctaConnect",             key: ["Select"],     btn: "btnSelect",     text: "Connect" },
  { id: "ctaNetworkDetails",      key: ["Select"],     btn: "btnSelect",     text: "Network Details" },
  { id: "ctaSecurity",            key: ["Red"],        btn: "btnRed",        text: "Network Security Settings" },
  { id: "ctaWifiSettings",        key: ["Select"],     btn: "btnSelect",     text: "WiFi Settings" },
  { id: "ctaForget",              key: ["Yellow"],     btn: "btnYellow",     text: "Forget this network" },
  { id: "ctaRenewDHCP",           key: ["Green"],      btn: "btnGreen",      text: "Renew DHCP Lease" },
  { id: "ctaTCPIPSettings",       key: ["Red"],        btn: "btnRed",        text: "TCP/IP Settings" }
];
