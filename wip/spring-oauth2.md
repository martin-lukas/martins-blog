---
layout: post
title: "Using OAuth2 with Spring Security"
date: 2023-04-03 04:16:00 -0000
categories: security spring
---

When learning about OAuth2, its complexity cannot be bypassed. Sometimes you just need to read the docs. In this instance, these are the [RFC-6749](https://www.rfc-editor.org/rfc/rfc6749).

For learning this topic in a practical way, I chose to use the Spring Security framework, which also provides some libraries for working with OAuth2.

From now on, I'll start using just the term OAuth, as OAuth1.0 was deprecated, and they are not compatible anyway.

OAuth is an authentication and authorization mechanism, that describes several parties:

- resource owner - end-user or service
- resource server - providers the resource, and is able to enforce authentication/authorization
- authorization server - trusted party that all sides can use to prove authentication/authorization
- client - user/service requesting access to that resource

