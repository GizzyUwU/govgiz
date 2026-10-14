---
title: HCES (Hack Club Event Scraper)
description: HCES (Hack Club Event Scraper) - Scrapes Hack Club Events (rn only stardance and flavortown) for data like devlogs, shop items and more
date: '2026-08-03'
updatedAt: '2026-08-31'
tags:
  - macondo
  - projects
projects:
  - source: macondo
    id: '16007'
---
## Devlog 28311 • 2026-08-31

So for this I lowk did a lot of debugging aka I hate bun!
Most of this time was literally spent trying to figure out what in the world was so different between local dev and Docker. It was the bun version! The bun version used in Docker was latest and for some reason took the liberty to fully rerun index.ts when I imported db and logger from it. Why? I don't fucking no it didn't do this in dev and lowk had to throw it in Claude and get it to figure out this madness!
I also fixed it to work better in docker with db migrations and that so it fully works in docker now splitting up frontend and backend into diff containers.
It be now in prod at https://hces.gizzy.gay
![image](https://cdn.hackclub.com/01a05848-5693-7601-98ee-294b24d028ff/image.png)
![image](https://cdn.hackclub.com/01a05848-c174-7f17-bde3-fa30cb223dba/image.png)

0 likes • 0m

## Devlog 28240 • 2026-08-30

Wow been a bit! Anyway the changes made!
- Cleaned up the Docs as it was a mess with routes so cleaned up with grouping!
- Swapped away from openpanel to prometheus for stats as op was not really made for what I wanted lowk
- Flavortown API added so you can use that with HCES now!
- Reworked CP adapter to work off the main lib for the API and now both FT and SD fully have compatability routes setup
- Both API's have most all endpoints setup!
- More optimisations to try really get the latency down esp with websocket usage
- ![image](https://cdn.hackclub.com/01a05314-c45d-7e3a-b684-5586980cb1f9/image.png)
- ![image](https://cdn.hackclub.com/01a05315-0c14-7f1e-8ce7-263f2677b8d0/image.png)
- ![image](https://cdn.hackclub.com/01a05315-5fcb-7e04-8aec-1378d46a466f/image.png)

0 likes • 0m

## Devlog 27200 • 2026-08-19

I did some changes to code to optimise it fix some stuff and more!
- I don't know why but before I used db to store worker stats used to find best worker that's better in memory locally for speed so swapped that to a map
- Added local worker support fully so orchestrator can work as its own worker
- Started caching api keys with 30s ttl to decrease latency from DB request
- Swapped to use PNPM since my storage lowk gettin fucked by all the projects I got with node modules
- Fixed site showing white by adding not found page
- Did a bit of modifications to reduce db queries/change some queries to not block the request in the quest of reducing latency from being 3s at some points to now max 1s from api key not cached to lowest 200ms most of that being from the request to stardance
- Partial project scraper no on stardance scraper to grab project data but not devlogs yet
- Swapped away from axios to bun's native fetch since for some reason axios could take mutliple seconds compared to bun and bun offered preconnect to scraper urls where I couldn't find that on axios
- OpenPanel support so I get metrics! On latency, workers connected and more
![image](https://cdn.hackclub.com/01a01973-a97a-7ac3-a62b-6eed44543ea6/image.png)
![image](https://cdn.hackclub.com/01a01974-a86e-7edf-b925-59e29f15745e/image.png)
![image](https://cdn.hackclub.com/01a01974-db10-784f-b4e6-27ead28345ca/image.png)

0 likes • 0m

## Devlog 26876 • 2026-08-16

I did some stuff in ts :3
- Mostly complete worker support so I can run other multiple nodes using orchestrator to manage stuff
- Admin dash! and ability to create workers
- User websockets so it's faster to hit endpoints and the server manages interval checks and sends them to you using values u set
![image](https://cdn.hackclub.com/01a00bd4-35ee-7b0b-83ca-9eec36e277ff/image.png)
![image](https://cdn.hackclub.com/01a00bd4-eb4c-7df3-8712-cc29494368be/image.png)

0 likes • 0m

## Devlog 26162 • 2026-08-12

I have now 
- started building the stardance scraper scraping shop and GOI dash atm for data
- started setting up the api key api
- api docs anyone? yeah ts was pain in the ass to do elysia didnt want to filter out routes i wanted to hide so had to force it to
- I think other stuff :3
![image](https://cdn.hackclub.com/019ff3a2-e805-7c18-8233-6bd15c2f70f3/image.png)
![image](https://cdn.hackclub.com/019ff3a3-1a13-7437-873b-2229eabf6c5e/image.png)
![image](https://cdn.hackclub.com/019ff3a6-d86c-7fab-a3b2-207cad374f75/image.png)

0 likes • 0m

## Devlog 25826 • 2026-08-10

Meow :3 I was suppose to devlog when I finished HCA integration but forgot to so I devlog it all now!
- HCA Integration for handling authentication with dashboard which controls api key creation and that
- A dashboard?! Lowk vibecoded tailwind file to use hc branding cuz could not be asked to manually input hc's themings
- API key creation on dash, deletion of them too and never adding a ability for them to expire cuz i dont care if u want them to expire!
- Account deletion if you want to leave :(
- Cron to remvoe stale sessions!
- Sum shit untracked branding I manually made ripping off hc's branding
![image](https://cdn.hackclub.com/019febcb-7a98-748f-850d-ab3129571f2e/image.png)
![image](https://cdn.hackclub.com/019febcb-b841-7c14-a5ee-67496e92a2f8/image.png)
![image](https://cdn.hackclub.com/019febcb-ed64-75df-9036-55dd84f40249/image.png)

0 likes • 0m

