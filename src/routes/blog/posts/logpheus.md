---
title: Logpheus
description: Basic Slack Bot that makes use of FT API to query for new devlogs and posts it to personal channels (for each personal channel you will have to provide your own api key i aint hitting ratelimit on my own api key for yall smh)
date: '2025-12-24'
tag:
  - flavourtown
  - flavortown
  - project
---



















## Devlog 2214 • 2025-12-24

I need a devlog to test so uhm past hour and half i well made lib file for ft its a class file so i can use it in other projects if i want to too then using that i made it pull projects then pull devlogs if no cache file exists it adds all devlogs of project id which is in apiKeys.json which stores project id as key then under it the api key and channel to post it to

0 likes • 98 min

## Devlog 2250 • 2025-12-24

The past hour I have been debugging and making the bot worked implementing /logpheus-add to add projects to the list and it works i just need to add /logpheus-remove now :3c and also docker support

0 likes • 75 min

## Devlog 2261 • 2025-12-24

Woah this was a fast devlog i made /logpheus-remove so you can now remove your project from a channel! and i also realised im an idiot! i now gotta modify the code to not use project id as a prefix and instead use channel id so someone cant block you from adding your proj to your channel because they added it to theres!

0 likes • 21 min

## Devlog 2272 • 2025-12-24

Woah fast fix too i swapped it to use api key instead sas the prefix only allowing 1 api key to be used for a channel but a channe4l can have multiple projects subscribed so yipeeeeeeeee

0 likes • 27 min

## Devlog 2308 • 2025-12-24

Prodtato. The bot is in prod and seems stable working in my channel! The docker is complete and also finished the readme showing how to use it but also how to self host it if you dont trust me with your api key which is BORING TRUST MEEEEEE its basically done i ship i think i did other stuff too but i forgor

0 likes • 45 min

## Devlog 2321 • 2025-12-24

An extra 21 minutes for me because docker sucks! I literally spent 21 minutes just trying to get apiKeys to be persistant in the docker containuer using docker volumes i hate docker NOW ITS PRODTATO READY

0 likes • 20 min

## Devlog 2912 • 2025-12-26

I need a devlog to test but the bot's handling system of new devlogs is being changed to do less work by making us of the new devlog_id in /api/v1/projects/:id making the bot and probably the api do less work thats just assuming but atleast the bot will do less work so peak!!!

0 likes • 48 min

## Devlog 2938 • 2025-12-26

Okay bot now makes use of devlog_ids to check so less resources during hosting and should also mean less api hits :3c also now /logpheus-stats to see how many users it has and every req has header that makes bot show up on the extensions page

0 likes • 34 min

## Devlog 3026 • 2025-12-26

More improvements to the code! The bot message has improved to be more detailed with the devlog and also improved the code by setting types to the functions used so when called you can know what data is returned easily from typescript and your ide and also cleaned up some of the code.

0 likes • 44 min

## Devlog 3075 • 2025-12-26

Clean up of code to be more easier to develop in by seperating views/commands out into seperate files, fixed cache files that was done before latest update using differnet cache setup not causing any issues but with this update would of so it now migrates old caches to new format and now includes ship status!!!!!!!

0 likes • 83 min

## Devlog 15662 • 2026-01-25

Another time for a devlog!!!!!!!!!!!!!!!!!!!!!!! BLEH :hyper-dino-wave:
I spent most of the time improving the error handling of logpheus so it makes use of MY BUGSINK MOREEEE and its more specific with errors so now if it isnt 401 it doesnt default to no project exists at id it only does that at 404 :3c with MORE CONTEXT TOO so better easier debugging

0 likes • 117 min

## Devlog 15877 • 2026-01-25

oop 3h already past jesus anyway
i fixed sum bugs
user command! get someones ft profile from sometimes slack account
opt outs column for something soon owo

0 likes • 182 min

## Devlog 16313 • 2026-01-26

Almost 3 hours again GOD i kinda forgor was gonna do one this morning but devlogs was done ANYWAY
- Register command and project command to register to use bot as general purpose just for its commands, user to get a persons profile and project to look at project by id ![bleh](https://images.weserv.nl/?url=https%3A%2F%2Femoji.slack-edge.com%2FT09V59WQY1E%2Fbleh%2F8be6dc6939de105f.png&w=30&h=30&fit=contain&n=-1) 
- Bug fixes such as shutting up the error logged when FT did a restart or anything like that ![sickbro](https://images.weserv.nl/?url=https%3A%2F%2Femoji.slack-edge.com%2FT09V59WQY1E%2Fsickbro%2Fdeed2ff6a3f25263.png&w=30&h=30&fit=contain&n=-1) 
- Drops disabled clients from saved clients arr because they are disabled
- More bug fixes as an FT api route changed without me knowing breaking the bot so had to fix that and fallback so if it happens again it logs to sentry as sus ![sussy](https://images.weserv.nl/?url=https%3A%2F%2Femoji.slack-edge.com%2FT09V59WQY1E%2Fsussy%2Fcc3a0a8a261caea2.png&w=30&h=30&fit=contain&n=-1)
- Did a update to readme to match new stuff ![yay](https://images.weserv.nl/?url=https%3A%2F%2Femoji.slack-edge.com%2FT09V59WQY1E%2Fyay%2F47296c029c8ee253.gif&w=30&h=30&fit=contain&n=-1) 

0 likes • 161 min

## Devlog 17028 • 2026-01-28

Chat, are we codemaxxing rn? no stupid we are bugfixing dumb ahh
- Fixed my channel being spammed in dev cuz i dropped project table by adding fallback to checker to prevent that
- Fixed sentry context not being included in commands/views sending sentry errors
- I realised slack modals have private metadata and also has body so instead of manually parsing the channel and user id through view i used that to hide it from user
- Idiotproofed the bot more because people somehow keep using other self hosted instances so now titles of modals use prefix as title which is different on every self hosted instance and for offical prod its just logpheus so if you STILL use wrong instance you are dumb nothing to say more about that
- DATA COMMADN TO SEE WHAT DATA LOGPHEUS HAS ON YOU YIPEEEEEEEEEEE ![yay](https://images.weserv.nl/?url=https%3A%2F%2Femoji.slack-edge.com%2FT09V59WQY1E%2Fyay%2F47296c029c8ee253.gif&w=30&h=30&fit=contain&n=-1) 
- Config command not channel specific now it uses user id to update api key
- Tells user that prod exploded instead of ghostting them when it does

0 likes • 156 min

## Devlog 3646 • 2025-12-28

Might aswell make a devlog for the stuff i did even though not really important. During this time I improved upon the add command to post more detail of the project when being added, I made changes to the Dockerfile to improve its build times using docker's cache mounts and removing unnecessary stages (i stole the build file from buns website and its very over complicated for this) and I made pending review after ship message more clear and once reviewed message more clear.

0 likes • 31 min

## Devlog 4012 • 2025-12-29

UH MORE HOURS FOR ME YIPEEEEEE so basically i in this time explode prod a couple times because of the new dockerfile but fixed it added improved error handling so that it doesnt spam my logs when something like a 401 happens i added ability to change api key in a channel using /logpheus-config, i converted timestamps to utc and now use the good format not the us format for dates so DD/MM/YYYY and it is now clickable timestamp so users can click it and convert it to their timezone if they want to and i moved the ext header which is useless to axios.create instead of spammed in every func call

0 likes • 103 min

## Devlog 4147 • 2025-12-29

# Haiiiiiiiiiiii
> I NEED MARKDOWN TO TEST LOGPHEUS THIS ISNT REALLY A DEVLOG JUST TESTING SOMETHING DEVLOG SOON THO

~~REA~~
*DK*
**YOUR BALD**
- QUACK
- A

1. A
2. a
- [x] quacked at people today
- [ ] meowed at people today
`sniffs you`
```
arf arf
```
[quacker](https://example.com)


---
sadgagagdag

0 likes • 19 min

## Devlog 4157 • 2025-12-29

Trying to implement support for markdown in logpheus
<u>meow</u>

i like <u>potatos</u>

0 likes • 34 min

## Devlog 4167 • 2025-12-29

OKAY REAL DEVLOG THIS TIME, markdown support is now fully added i think yes

0 likes • 28 min

## Devlog 4394 • 2025-12-30

# Migration!
Using json was really annoying especially for every project using their own cache json file for devlogs so instead i swapped to SQL which is using bun:sqlite for storing api keys, projects etc taking advantage of buns implementation which is pretty fast but also its less resource usage slightly because I'm not using json for everything I need parsing it stringifying it pushing it to file a lot. All previous json files will be migrated on start to the new db.

0 likes • 113 min

## Devlog 4899 • 2025-12-31

This whole devlog time was spent on another migration because I found out about pglite (postgres in wasm) and drizzle supported it so I migrated over to that instead because drizzle makes my life way more convienent especially working on logpheus it just took so long to setup as it was my first time using drizzle and i had to also create migration from sqlite and json to pglite to ensure no data loss.

0 likes • 290 min

## Devlog 4943 • 2025-12-31

WOOOOOOO just took down prod for 10 minutes because im dumb! I spent this time fixing my dumb mistakes, adding support to use full postgres in prod so I only need pglite in dev making my life easier in both cases and adding validation of api keys when added!

0 likes • 124 min

## Devlog 4952 • 2026-01-01

I'm logging this cuz free time! Logpheus felt like going on a spamming spree because of a bug in my code. Every minute a check ran and my dumbass made it update db to the value of the check so every 2 minutes it would change value back to one that causes shipped message to post causing spam hopefully this should be fixed tho

0 likes • 29 min

## Devlog 4960 • 2026-01-01

Nvm i hate code! 16m of more bug fixing to get it to stop spamming qwp

0 likes • 16 min

## Devlog 13586 • 2026-01-19

Bleh not devlogged this in a while but i got time so might aswell
Fixed bugs!
- You can now add multiple projects to one api key as fixed bug preventing this
- you can no longer be a stinky and try add the same project twice under a api key

0 likes • 46 min

## Devlog 14494 • 2026-01-21

Mreowwwww! I'm literally just improving logpheus handling of issues to use bugsink to post errors so I can read but also handle 401 errors better so I'm not being spammed with errors because you guys being annoying with your api keys

1 likes • 105 min

## Devlog 15325 • 2026-01-24

uhm pushed to prod the changes i madeto table etc fixed sum stuff took down prod for like half and hour as u do so fixed that because of dumb migration issues bleh but it does make use of new tables now for data not all data in new tables tho like last devlog timestamp or the store of user ids so i need to manually add uids in for users previous to the update but also change it so it stores and uses last devlog timestamp as main check and fallback to id check if need be

0 likes • 71 min

