---
title: GovGiz
description: Literally remaking my personal site in solidjs with solid-start but using the uk govs styling components :3c
date: '2026-01-28'
tag:
  - flavourtown
  - flavortown
  - project
---











## Devlog 17136 • 2026-01-29

Blehhhh ![3c](https://images.weserv.nl/?url=https%3A%2F%2Femoji.slack-edge.com%2FT09V59WQY1E%2F3c%2F8c317faf11962206.png&w=30&h=30&fit=contain&n=-1) so new project first devlog i spent most of time fighitng to get it to work with solidjs but it works AND LOOKS SEXY i also wiped up custom logo in figma balls


0 likes • 87 min

## Devlog 17146 • 2026-01-29

Im eepy its 1 am but gotta devlog so yipeeeeeeeeeeeeeeeeee
- Uses hackatime now to get my hours coded today
- Shows my local time which also live updates using typedjs to update it
- Small desc about me uses typedjs to change values bleh ![yay](https://images.weserv.nl/?url=https%3A%2F%2Femoji.slack-edge.com%2FT09V59WQY1E%2Fyay%2F47296c029c8ee253.gif&w=30&h=30&fit=contain&n=-1) 

0 likes • 47 min

## Devlog 18019 • 2026-01-31

BLEHHHHHH 2 HOURS ALREADY DAMN BLEHHH
ANYWAY ![3c](https://images.weserv.nl/?url=https%3A%2F%2Femoji.slack-edge.com%2FT09V59WQY1E%2F3c%2F8c317faf11962206.png&w=30&h=30&fit=contain&n=-1) ![3cnuke](https://images.weserv.nl/?url=https%3A%2F%2Femoji.slack-edge.com%2FT09V59WQY1E%2F3cnuke%2Fe35ee9bec8dfa875.png&w=30&h=30&fit=contain&n=-1)
UPDATEEEEEEEEEEEEEE AAAAAAAAAAAAAAAAAA
- I did sum code theft ![3c](https://images.weserv.nl/?url=https%3A%2F%2Femoji.slack-edge.com%2FT09V59WQY1E%2F3c%2F8c317faf11962206.png&w=30&h=30&fit=contain&n=-1) someone made a blog in solidjs with mdx before me so i stole sum code from it [there blog on it is here](https://andi.dev/blog/how-solid-start-blog/) so i made use of that code for mine but modifying it so it fits uk gov design bleh
- I did other stuff but forgor
### Changelog
- [feat: basic ahh blog i ripped off from someones site but trying to make fit this design](https://api.github.com/repos/GizzyUwU/govgiz/commits/4b2613c90b8a156fd557a6569138a5416a1876cd)


0 likes • 131 min

## Devlog 18071 • 2026-01-31

Wow an hour just spent on this? ![bleh](https://images.weserv.nl/?url=https%3A%2F%2Femoji.slack-edge.com%2FT09V59WQY1E%2Fbleh%2F8be6dc6939de105f.png&w=30&h=30&fit=contain&n=-1) uk gov being fucking annoying again! The UK Gov Design System lacks a code block which a [github issue](https://github.com/orgs/alphagov/projects/43/views/1?filterQuery=status%3A%22Not+published%22+code&pane=issue&itemId=10865678&issue=alphagov%7Cgovuk-design-system-backlog%7C8) was opened for it in 2018. so i spent past hour literally combining other components and jankiness to make one using prismjs for highlighting it looks pretty similar to the real one used on design system docs (which EXISTS BUT IN THE NPM ITSELF DOESNT????).

0 likes • 86 min

## Devlog 18087 • 2026-01-31

BLEHHHHH ANOTHER UPDATE SO SOON? YES YES I UPDATE RIGHT MEOW ![bleh](https://images.weserv.nl/?url=https%3A%2F%2Femoji.slack-edge.com%2FT09V59WQY1E%2Fbleh%2F8be6dc6939de105f.png&w=30&h=30&fit=contain&n=-1) 
ANYWAY
- Tag system exists meow
- a bit of changes to blog.tsx i forgor what they was
### Changelog
- [feat: tags](https://api.github.com/repos/GizzyUwU/govgiz/commits/9b9687cd0dd56d0b86eb97ec784ac01946e39ece)
- [fix: add copy button](https://api.github.com/repos/GizzyUwU/govgiz/commits/ef7e40b4fd1f2690a1b582ae4f07e73f1b5253c5)


0 likes • 46 min

## Devlog 18203 • 2026-01-31

HAIIII ITS MEEEE AGAIN ;3c
This wasnt much but yipeee
- Uses giscus for comments (it uses GitHub discussions for comments) ![yay](https://images.weserv.nl/?url=https%3A%2F%2Femoji.slack-edge.com%2FT09V59WQY1E%2Fyay%2F47296c029c8ee253.gif&w=30&h=30&fit=contain&n=-1) 
- Default blog page to list all blogs instead of it 404ing on /blog
- Breadcrumbs instead of bunches of back buttons i have to add to every single page as its top level and dynamic ![3-blahaj-spinning](https://images.weserv.nl/?url=https%3A%2F%2Femoji.slack-edge.com%2FT09V59WQY1E%2F3-blahaj-spinning%2F3814527118f8ddd7.gif&w=30&h=30&fit=contain&n=-1) 
### Changelog
- [feat: default blogs page to list blogs, breadcrumbs at top level so not spamming back buttons](https://api.github.com/repos/GizzyUwU/govgiz/commits/462d06bc8a6a2444ee12cdcf90a1ca8a07488e81)
- [feat: giscus for comments, gov giz logo redirect to /](https://api.github.com/repos/GizzyUwU/govgiz/commits/a260a01ac6257e84efe3acdbee4ef790727bf6f1)


0 likes • 60 min

## Devlog 18303 • 2026-02-01

BLEHHH IM BACK AGAIN ![3c](https://images.weserv.nl/?url=https%3A%2F%2Femoji.slack-edge.com%2FT09V59WQY1E%2F3c%2F8c317faf11962206.png&w=30&h=30&fit=contain&n=-1) since it has a blog now i gotta do the natural thing of being lazy! I made a github action to generate an mdx from these FT devlogs and projects and add it to the website mdx ![3c](https://images.weserv.nl/?url=https%3A%2F%2Femoji.slack-edge.com%2FT09V59WQY1E%2F3c%2F8c317faf11962206.png&w=30&h=30&fit=contain&n=-1) i also did sum other stuff but thats not really important compared to that

0 likes • 162 min

## Devlog 18312 • 2026-02-01

bleh i had to fix script and aciton that was painfal its 1 am im eepy but update
- github action runs update every 10m now correctly
- it prevents xss now from mdx bleh
- IM TIRIED

0 likes • 45 min

