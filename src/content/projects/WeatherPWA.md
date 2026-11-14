---
title: "Weather PWA"
slug: "WeatherPWA"
description: "A web app that shows the weather depending on the city, state, or zipcode entered. It is a PWA which completes all the chrome lighthouse checks."
date: 2021-03-29
author: "Praveen Chaudhary"
tags: ["pwa", "html", "css", "javascript", "jquery", "webdevelopment"]
previewUrl: "https://drive.google.com/file/d/1OI6cmqhhgOYn7ZAJW_F3DxvOAPk3sFBp/preview"
repoUrl: "https://github.com/chaudharypraveen98/WeatherPWA"
image: "https://media-exp1.licdn.com/dms/image/C5603AQHRamUaMrdA9g/profile-displayphoto-shrink_400_400/0/1597315489941?e=1629936000&v=beta&t=GjvQu_r0n3F2EtGkaRYSF6pH8vRdgx5lsD1-w8dc8gY"
headerImage: "/projects/assets/img/post-bg.webp"
---

**What we are going to develop?**

1. Writing the service worker
2. Integrating with webpage
3. Fetching data from the API

**Before moving ahead, we must aware of some concepts**

**Some Important Concepts**

**What is a PWA?**

A progressive web application is a type of application software delivered through the web, built using common web technologies including HTML, CSS and JavaScript.

**What is a Workbox?**

Workbox is a library that bakes in a set of best practices and removes the boilerplate every developer writes when working with service workers.

**What is a Service Worker**

Service workers are scripts that run in the background in the user's browser, enabling such features as push notifications and background synchronization.

## Step 1 -> Writing the service worker

We will use the workbox library from google i.e a ready to plug service server.

Make a **service-worker.js** file.

```
importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.1.1/workbox-sw.js');

workbox.routing.registerRoute(
    ({request}) => request.destination === 'image',
    new workbox.strategies.NetworkFirst()
);
```

## Step 2 -> Integrating with webpage.

It will run the service worker on load of website.

```
<script>
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("/service-worker.js");
    }
</script>
```

We will be using the OpenWeatherAPI to get the weather data of a city or state. Get your free API key [here](https://openweathermap.org/api)

```javascript
const APIkey = "Enter your key";

$("#submit-button").click(function () {
var cityName = document.getElementById("weather-search").value;
console.log(cityName);
$.get(
    `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${APIkey}`,
    function (data, status) {
    console.log(data);
    document.getElementById("desc").innerText=data['weather'][0]['description']
    document.getElementById("max-temp").innerText=data['main']['temp_max']+" F"
    document.getElementById("min-temp").innerText=data['main']['temp_max']+" F"
    }
);
});
```

## Deployment

You can only deploy on personal website or [deploy on github pages.](https://pages.github.com/).

## Web Preview / Output

![WeatherPWA project screenshot](https://raw.githubusercontent.com/chaudharypraveen98/WeatherPWA/master/pwa.JPG)

*Web preview on deployment*
