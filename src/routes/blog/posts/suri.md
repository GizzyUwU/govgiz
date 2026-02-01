---
title: Suri
description: Do you hate slack desktop? Is it really slow for you like it is for me? Well fuck it I hate slack desktop and it's lag so I'm making it myself.
date: '2025-12-18'
tags:
  - flavourtown
  - flavortown
  - projects
---

## Devlog 358 • 2025-12-20

Yes I am 1h 48m in to this and I have made barely any progress. Blame slack for that I spent all this time just trying to get convo history to work :hs:

0 likes • 111 min

## Devlog 685 • 2025-12-21

I spent most of the 2h 33m trying and debugging just to get a single d cookie that slack auth uses it was pain in the ass since webkit2gtk kept crashing (because it sucks ass) when i tried to intercept responses to look through there headers under I realised tauri supports grabbing webview windows cookies so I swapped to on_navigation to look for path /checkcookie which slack auth uses to check for cookie is valid so we know the webview will have the cookie at that time then we extract and print it for now. I still gotta grab the second token although that should be 10x easier since slack sends that one over a network request only requiring the d cookie to get it although it does require some parsing since the response is js script? thats really stupid

0 likes • 152 min

## Devlog 1029 • 2025-12-22

Well this one is a long one. I literally spent 4 hours and the feature isn't done yet. I can confirm that I hate slack, I have gained more hate for tauri and more love for tauri. I tried first to make the request for data i need manually which for some god known reason refused to work and kept 404ing aka i hate slack, i then spent my time trying to grab data from session storage before slack wiped it which that didnt work out then I realised it moves the data to localStorage which is well weird and I wrote rust code to grab that then I spent more time just trying to get that data from webview to frontend code and FINALLY I GOT THE DATA login still not done tho now take a picturee of my shit code

0 likes • 242 min

## Devlog 1054 • 2025-12-22

30 minutes later and it works mostly now! The webview window now closes once finished and you can view channels and message history again :3c

0 likes • 31 min

## Devlog 1903 • 2025-12-23

Well this was semi painful but WEBSOCKET mhm yes we got slack websocket in it now and because slack sends so much data even on channels your not currently looking at you could multiple channels at once on it :uuh: mhm yes you can see people typing, that someone joined someone sent a message while not being in that channel very sigma must say but this was pain to get to work

0 likes • 143 min

## Devlog 2160 • 2025-12-24

More modifications to auth! This time not because slack sucks but because I wanted auto login. It now saves xoxd and xoxc in a json file with name scheme "slack-${user.name}.json" user,name being active system user so different system users dont got same file and don't worry it's encrypted with a key set in system keyring under that users account. The user account name is grabbed using a tauri command with using the rust crate "users' to get the active system account.

0 likes • 125 min

## Devlog 5676 • 2026-01-03

I forgor to make a devlog qwp. ANYWAY 10 days past and i did some stuff :3 I tried to get tauri to shutup about "couldnn't find callback id" because it sucks at cleaning up its own resources with its plugins that took a while until i just made console.warn filter it out of console to shut it up instead it aint my job to fix tauris shit,  I also made a bit of a ui for it and real time messages from the websocket and ability to post messages! (dont mind the random person on the right i stole the ui from flowbite :3c)

0 likes • 318 min

## Devlog 5720 • 2026-01-03

Yeah my previous fix to shutup couldnt find callback id annoyed me so i spent this whole devlog time just trying to get my shit rust code to work so it prevents default reload and instead causes a window relaunch clearing out any callback ids so no console spam because it relaunches on reload

0 likes • 99 min

## Devlog 5979 • 2026-01-04

Names! Yes this could of been done in like 30 minutes but im a twat i made a stupid mistake causing me to not match the user id to the gotten ids for the channel because i used channel: channelId in the body not channels: [channelId] causing slack to throw workspace users not channel users. I also moved chat to its own file instead of just in the index.tsx file

0 likes • 131 min

## Devlog 6086 • 2026-01-04

A bit better message parsing :3c it now has semi good image support setup image is kinda large gotta fix that but it also unescapes html encode stuff now so yipee

0 likes • 60 min

## Devlog 6260 • 2026-01-05

Better parsing of rich text blocks :3c not completely dont yet tho

1 likes • 41 min

## Devlog 6298 • 2026-01-05

I implemented more of the formatting :3c also added names back as i broke that

1 likes • 68 min

