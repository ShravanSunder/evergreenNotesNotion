# Evergreen notes for notion

## Overview

⚠ This extension was written before Notion released their API, by basically reverse engineering the api and types.

The data types and systems were approximation and this hasn't been updated after their api release. Fortunately everything still works.

The extension creates a side panel. See the links below for pictures and dtails!

## Links

-  [Webpage on Notion 📚](https://shravansunder.notion.site/Evergreen-Notes-For-Notion-e35e6ed4dd5a45b19bf2de2bb86b1a7e)
-  [Chrome extension 🕸](https://chrome.google.com/webstore/detail/evergreen-notes-for-notio/chhpogndpjcgjbnbcodhdnilklfanmfh)
-  [Buy me a coffee ☕](https://www.buymeacoffee.com/ShravanSunder)

## Some architecture

-  uses webpack with esbuild plugin
-  written in react and redux toolkit
-  notion types in typescript

## what i would do differently

-  use recoil or swr/rtk with state
-  use notion api authentication
-  change the mechanism to get the current page in state
-  cache updates so its not so slow,
   -  maybe use `indexdb` with `dexiejs`
   -  `sql lite` with `absurd-sql` https://github.com/jlongster/absurd-sql
-  maybe use an existing notion rendering engine, there's a lot of options now
