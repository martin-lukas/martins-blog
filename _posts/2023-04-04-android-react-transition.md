---
layout: post
title: "How to Transition Between Android and React and Back"
date: 2023-04-04
tags: android react security
---

Imagine a situation, where you have an existing Android app, within which you want to have a WebView, that will load a page with a whole another app, written in React. There could be several reasons why you would want to do such a thing, but let's just say it's a necessary feature. How do you go about it technologically? Just to clarify, this comes from the point of view of a React developer, not an Android developer.

## 1. Requirements

Let's say there are several requirements for this nested web app:
1. You should be able to seamlessly transition between the Android app into the React app.
1. If you're currently logged in, that valid session should carry over as well.
1. You should be able to transition back into the Android app when the time comes.

### 1.1 Seamless transition into a web app

In the Android app, you usually use a WebView to 

// how to load react app in webview

// refresh tokens right before transition

// make it usecured - assets can't load, can't attach auth header

// have an endpoint to convert stuff to cookies
