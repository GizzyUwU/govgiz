---
title: GovGiz
description: Literally remaking my personal site in solidjs with solid-start but using the uk govs styling components :3c
date: '2026-01-28'
tags:
  - flavourtown
  - flavortown
  - projects
---

## Devlog 19153 • 2026-02-03

Bleh haiii again ![wave-pikachu-2](https://images.weserv.nl/?url=https%3A%2F%2Femoji.slack-edge.com%2FT09V59WQY1E%2Fwave-pikachu-2%2F5e95fb2267f03afa.gif&w=30&h=30&fit=contain&n=-1) 
I spent the past hour adding hc webring to my site (would of been easier using the provided embed but that doesnt fit the theme so why would i do that?)
I remade the embed that provided the webring but with govuk design to match better it doesnt look like much but it was pain to get it to be like that

0 likes • 1h 6m

## Devlog 19140 • 2026-02-03

Another day another update BLEH ![3c](https://images.weserv.nl/?url=https%3A%2F%2Femoji.slack-edge.com%2FT09V59WQY1E%2F3c%2F8c317faf11962206.png&w=30&h=30&fit=contain&n=-1)
I mostly did fixes but also some nice to have changes
- Vertically align emojis from devlogs with the text
- Make checkboxes more visible but also uglier because i couldnt set a custom bg for them
- Drop solid-icons for unplugin icons to shutup a babel error which also slowed down load in dev
- Change <a> with <A> from solidjs router as i heard its better for solidjs idk 
- Throws a 404 now when project doesn't exist instead of erroring
- Shut up solid hydration because of using <link> not <Link> for 88x31
- Drop kaboom a tag which was hidden from viewers but not needed anyway as i went with different fix for 404
Thats basically it also I GET UNBANNED FROM THE SLACK TODAY YAY ![yay](https://images.weserv.nl/?url=https%3A%2F%2Femoji.slack-edge.com%2FT09V59WQY1E%2Fyay%2F47296c029c8ee253.gif&w=30&h=30&fit=contain&n=-1) 

0 likes • 1h 46m

## Devlog 18978 • 2026-02-02

HAIIIII IM BACK AGAIN ;3c
SOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO i made sum changes if you didnt notice dumb ahh
- Modified FTToMDX to not just use minutes but hours and if you need days too that but like that prob wont be hit for days
- Swapped da order from oldest -> newest to newest -> so it looks better
- Better markdown support with h1 support and other stuff like checkboxes just not existing
- Improved detection of lang in markdown code block but if it cant detect it just say unknown then nothing
- Copy block no longer copies its own text
I got the 4167 devlog id? ![sixseven](https://images.weserv.nl/?url=https%3A%2F%2Femoji.slack-edge.com%2FT09V59WQY1E%2Fsixseven%2F361b0d7b25240b66.png&w=30&h=30&fit=contain&n=-1) 

### Changelog
- [minor: change from just mins to days, hours, mins](https://api.github.com/repos/GizzyUwU/govgiz/commits/9d231bc4a59e7c3c5849548039877bdb07dc3bcc)
- [feat: improved detection of language by parsing child, fix for copy button coping the copy button too not just the code](https://api.github.com/repos/GizzyUwU/govgiz/commits/30e7d6bb0071061868c2eb01f74be74fe4b3697d)
- [fix: lacking rmark-gfm causing some markdown to not be supported, h1 missing so it didnt match](https://api.github.com/repos/GizzyUwU/govgiz/commits/acf0304757e1e5c7969d7b2221a0db2447cd3e6e)
- [feat: ratelimit handler + fix for it not moving stuff for new devlogs i forgor about that case](https://api.github.com/repos/GizzyUwU/govgiz/commits/698bdaa1fa6ab7821cb743dc1dec67aa07c3665f)
- [fix: swap order from oldest to newest to newest to oldest](https://api.github.com/repos/GizzyUwU/govgiz/commits/07b3487f54bc06b62bcceb717473469060c4a358)


0 likes • 1h 3m

## Devlog 18818 • 2026-02-02

An hour? Damn not that long to be fair, ANYWAY hai chat ![3c](https://images.weserv.nl/?url=https%3A%2F%2Femoji.slack-edge.com%2FT09V59WQY1E%2F3c%2F8c317faf11962206.png&w=30&h=30&fit=contain&n=-1) I did sum fixes
- 404 continued to explode on github so I fixed that finally by making a static 404.html not solidjs one,
- 404, Details and Home page is less fucked on mobile now
- Improved birthday count down text to do less typedjs typing

0 likes • 51m

## Devlog 18662 • 2026-02-01

KABOOM WE DO UPDATE YIPEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE
![3-blahaj-spinning](https://images.weserv.nl/?url=https%3A%2F%2Femoji.slack-edge.com%2FT09V59WQY1E%2F3-blahaj-spinning%2F3814527118f8ddd7.gif&w=30&h=30&fit=contain&n=-1) 
- 404 fixed i think on prod it works in dev
- DETAILS PAGE ABOUT ME ![3c](https://images.weserv.nl/?url=https%3A%2F%2Femoji.slack-edge.com%2FT09V59WQY1E%2F3c%2F8c317faf11962206.png&w=30&h=30&fit=contain&n=-1) 
- Sum other stuff i forgor

### Changelog
- [fix: 404 exploding bleh](https://api.github.com/repos/GizzyUwU/govgiz/commits/04992389ebbb216020b9f2102cb9e3c53b31139a)
- [feat: fix 404 on github, 88x31 for this site, github follower count and star count i stole from cyteon, details page](https://api.github.com/repos/GizzyUwU/govgiz/commits/f4fbc7f37ad4baa27692f9d5a6df0e8f1421487b)


0 likes • 1h 40m

## Devlog 18619 • 2026-02-01

Okay i apparentally forgot to hit post so let me write this again. HAIIIIIIIIIII ![3c](https://images.weserv.nl/?url=https%3A%2F%2Femoji.slack-edge.com%2FT09V59WQY1E%2F3c%2F8c317faf11962206.png&w=30&h=30&fit=contain&n=-1) 
i DID SOME THINGS
- Prod setup exists on github pages?! [https://gizzy.gay](https://gizzy.gay)
- Swap replacing stuff to prevent execution with just using .md instead of mdx
- Updated breadcrump to show current page too
- Fix ftToMDX to stop spamming new lines and changing tags to tag
- 404 Page now
- Search for projects or tags
- Fixed postsPlugin to not explode when md
- Page navigation section
- Some other things i cant rememebber  ![bleh](https://images.weserv.nl/?url=https%3A%2F%2Femoji.slack-edge.com%2FT09V59WQY1E%2Fbleh%2F8be6dc6939de105f.png&w=30&h=30&fit=contain&n=-1) 
- No longer shows posts with tag projects on blog posts page
- Made tags and blog posts page more sexy

0 likes • 3h 26m

## Devlog 18312 • 2026-02-01

bleh i had to fix script and aciton that was painfal its 1 am im eepy but update
- github action runs update every 10m now correctly
- it prevents xss now from mdx bleh
- IM TIRIED

0 likes • 44m

## Devlog 18303 • 2026-02-01

BLEHHH IM BACK AGAIN ![3c](https://images.weserv.nl/?url=https%3A%2F%2Femoji.slack-edge.com%2FT09V59WQY1E%2F3c%2F8c317faf11962206.png&w=30&h=30&fit=contain&n=-1) since it has a blog now i gotta do the natural thing of being lazy! I made a github action to generate an mdx from these FT devlogs and projects and add it to the website mdx ![3c](https://images.weserv.nl/?url=https%3A%2F%2Femoji.slack-edge.com%2FT09V59WQY1E%2F3c%2F8c317faf11962206.png&w=30&h=30&fit=contain&n=-1) i also did sum other stuff but thats not really important compared to that

0 likes • 2h 41m

## Devlog 18203 • 2026-01-31

HAIIII ITS MEEEE AGAIN ;3c
This wasnt much but yipeee
- Uses giscus for comments (it uses GitHub discussions for comments) ![yay](https://images.weserv.nl/?url=https%3A%2F%2Femoji.slack-edge.com%2FT09V59WQY1E%2Fyay%2F47296c029c8ee253.gif&w=30&h=30&fit=contain&n=-1) 
- Default blog page to list all blogs instead of it 404ing on /blog
- Breadcrumbs instead of bunches of back buttons i have to add to every single page as its top level and dynamic ![3-blahaj-spinning](https://images.weserv.nl/?url=https%3A%2F%2Femoji.slack-edge.com%2FT09V59WQY1E%2F3-blahaj-spinning%2F3814527118f8ddd7.gif&w=30&h=30&fit=contain&n=-1) 
### Changelog
- [feat: default blogs page to list blogs, breadcrumbs at top level so not spamming back buttons](https://api.github.com/repos/GizzyUwU/govgiz/commits/462d06bc8a6a2444ee12cdcf90a1ca8a07488e81)
- [feat: giscus for comments, gov giz logo redirect to /](https://api.github.com/repos/GizzyUwU/govgiz/commits/a260a01ac6257e84efe3acdbee4ef790727bf6f1)


0 likes • 59m

## Devlog 18087 • 2026-01-31

BLEHHHHH ANOTHER UPDATE SO SOON? YES YES I UPDATE RIGHT MEOW ![bleh](https://images.weserv.nl/?url=https%3A%2F%2Femoji.slack-edge.com%2FT09V59WQY1E%2Fbleh%2F8be6dc6939de105f.png&w=30&h=30&fit=contain&n=-1) 
ANYWAY
- Tag system exists meow
- a bit of changes to blog.tsx i forgor what they was
### Changelog
- [feat: tags](https://api.github.com/repos/GizzyUwU/govgiz/commits/9b9687cd0dd56d0b86eb97ec784ac01946e39ece)
- [fix: add copy button](https://api.github.com/repos/GizzyUwU/govgiz/commits/ef7e40b4fd1f2690a1b582ae4f07e73f1b5253c5)


0 likes • 46m

## Devlog 18071 • 2026-01-31

Wow an hour just spent on this? ![bleh](https://images.weserv.nl/?url=https%3A%2F%2Femoji.slack-edge.com%2FT09V59WQY1E%2Fbleh%2F8be6dc6939de105f.png&w=30&h=30&fit=contain&n=-1) uk gov being fucking annoying again! The UK Gov Design System lacks a code block which a [github issue](https://github.com/orgs/alphagov/projects/43/views/1?filterQuery=status%3A%22Not+published%22+code&pane=issue&itemId=10865678&issue=alphagov%7Cgovuk-design-system-backlog%7C8) was opened for it in 2018. so i spent past hour literally combining other components and jankiness to make one using prismjs for highlighting it looks pretty similar to the real one used on design system docs (which EXISTS BUT IN THE NPM ITSELF DOESNT????).

0 likes • 1h 26m

## Devlog 18019 • 2026-01-31

BLEHHHHHH 2 HOURS ALREADY DAMN BLEHHH
ANYWAY ![3c](https://images.weserv.nl/?url=https%3A%2F%2Femoji.slack-edge.com%2FT09V59WQY1E%2F3c%2F8c317faf11962206.png&w=30&h=30&fit=contain&n=-1) ![3cnuke](https://images.weserv.nl/?url=https%3A%2F%2Femoji.slack-edge.com%2FT09V59WQY1E%2F3cnuke%2Fe35ee9bec8dfa875.png&w=30&h=30&fit=contain&n=-1)
UPDATEEEEEEEEEEEEEE AAAAAAAAAAAAAAAAAA
- I did sum code theft ![3c](https://images.weserv.nl/?url=https%3A%2F%2Femoji.slack-edge.com%2FT09V59WQY1E%2F3c%2F8c317faf11962206.png&w=30&h=30&fit=contain&n=-1) someone made a blog in solidjs with mdx before me so i stole sum code from it [there blog on it is here](https://andi.dev/blog/how-solid-start-blog/) so i made use of that code for mine but modifying it so it fits uk gov design bleh
- I did other stuff but forgor
### Changelog
- [feat: basic ahh blog i ripped off from someones site but trying to make fit this design](https://api.github.com/repos/GizzyUwU/govgiz/commits/4b2613c90b8a156fd557a6569138a5416a1876cd)


0 likes • 2h 11m

## Devlog 17146 • 2026-01-29

Im eepy its 1 am but gotta devlog so yipeeeeeeeeeeeeeeeeee
- Uses hackatime now to get my hours coded today
- Shows my local time which also live updates using typedjs to update it
- Small desc about me uses typedjs to change values bleh ![yay](https://images.weserv.nl/?url=https%3A%2F%2Femoji.slack-edge.com%2FT09V59WQY1E%2Fyay%2F47296c029c8ee253.gif&w=30&h=30&fit=contain&n=-1) 

0 likes • 46m

## Devlog 17136 • 2026-01-29

Blehhhh ![3c](https://images.weserv.nl/?url=https%3A%2F%2Femoji.slack-edge.com%2FT09V59WQY1E%2F3c%2F8c317faf11962206.png&w=30&h=30&fit=contain&n=-1) so new project first devlog i spent most of time fighitng to get it to work with solidjs but it works AND LOOKS SEXY i also wiped up custom logo in figma balls


0 likes • 1h 27m

