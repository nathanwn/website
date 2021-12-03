---
title: "Building This Site"
date: 2026-06-21T21:46:55+10:00
draft: false
tags:
  - ai
  - antigravity
  - meta
  - scss
summary: Tools, design decisions, and personal thoughts behind building this website.
---

## The origin

I first tried creating this site back in 2021, and then again in 2024. However, I never got it to a decent state until recently.

I was trying out Google's Antigravity CLI in my free time. For both experimentation and entertainment, I wanted to find something different from what I had been doing in the past year or two. Finishing this site came to mind.

## The site generator

I didn't want something more complex than a static site hosted on GitHub Pages, so I needed a static site generator. I chose Hugo because it seemed simple and fast.

## Styling tool

I didn't want a pre-built Hugo theme which might lock me into features that wouldn't match my needs or an aesthetic that wasn't really my style.

I also wanted to learn CSS/SCSS, so SCSS was the choice. This turned out fine, as AI agents like Antigravity can handle SCSS quite well in my experience.

## Aesthetics

### Stylistic theme

I wanted this site to be a place where I mostly write about programming and software development. I want the overall aesthetic to match that theme, while keeping everything minimalistic and not distracting from the core content.

As a personal preference, I wanted the site to have elements of the terminal environment. This was reflected in the design of the navbar.

The rest of the site is quite normal for a blogging site. I want tagging for posts just to have some logical per-topic grouping.

### Color schemes with Light/Dark modes

I think in 2026, having a Light/Dark mode toggle is a must for a website.

I am no color theory expert, so I don't want to maintain my own color themes. To simplify the theming, I use the popular Catppuccin color theme, with the Frappe variant for Dark mode and the Latte variant for Light mode. These have slowly become my favorite color themes in the past year.

### Typography

Besides Light/Dark modes, the site also lets you choose between Sans Serif and Serif fonts. I think this is a pretty cool feature.

* Sans Serif fonts: Inter and JetBrains Mono
* Serif fonts: Fira Code and Merriweather

## Some thoughts

Overall, I'm quite happy with how the site turned out. Antigravity did introduce a few subtle SCSS bugs along the way, but most could be managed. These were mostly due to the agent getting "tunnel vision", focusing on implementing a single feature without considering the rest of the SCSS styling. This did require a fair amount of back-and-forth between me and the agent to resolve the issues. Nevertheless, Antigravity was a massive time-saver compared to styling everything entirely from scratch.

All in all, this was a fun experiment. This site is probably simple enough for this approach to be justified. Would I trust both the agent and my own skill to steer it if I were creating the front end of a more complex website? Probably not just yet.
