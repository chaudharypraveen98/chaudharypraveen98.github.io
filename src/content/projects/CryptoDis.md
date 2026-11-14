---
title: "CryptoDis"
slug: "CryptoDis"
description: "A web app that will fetch the current price of popular cryptocurrencies."
date: 2020-04-21
author: "Praveen Chaudhary"
tags: ["css", "html", "jquery", "webdevelopment", "blockchain"]
previewUrl: "https://www.praveenchaudhary.in/CryptoDis/"
repoUrl: "https://github.com/chaudharypraveen98/CryptoDis"
image: "https://media-exp1.licdn.com/dms/image/C5603AQHRamUaMrdA9g/profile-displayphoto-shrink_400_400/0/1597315489941?e=1629936000&v=beta&t=GjvQu_r0n3F2EtGkaRYSF6pH8vRdgx5lsD1-w8dc8gY"
headerImage: "/projects/assets/img/post-bg.webp"
---

**What We are going to do?**

1. Creating a basic template using HTML
2. Request the cryptocurrencies data using Jquery fetch request.
3. Then inject that data into html body using JQuery Append.

## Fetching Data

**We will fetch the data using JQuery fetch**

```javascript
function rate(){
fetch('https://api.coinbase.com/v2/prices/INR/spot')
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        ..............
        // handle the data here
    }
}
```

## Formatting the data and Loading

**We need to format the data and present more systematically.**

```javascript
.then((data) => {
    let i;
    for(i = 0; i > data.data.length; i++) {
        let obj = data.data[i];
        console.log(obj);
        let elementTag = ` 
# ${i+1}
 
#### ${obj.base}
 
#### Rs. ${parseFloat(obj.amount).toFixed(2)}
 [More Info](https://www.blockchain.com/prices/${obj.base}) `
        $("#main").append(elementTag);
    }
}
```

> Fun Fact - No one knows who created bitcoin.

**Add some stylings to make it look impressive.**

## Deployment

For deployment, We are using the **GitHub Pages**.  [For More Info](https://pages.github.com/)

## Web Preview / Output

![CryptoDis project screenshot](https://raw.githubusercontent.com/chaudharypraveen98/PortfolioWithBrython/master/brython.JPG)

*Web preview on deployment*
