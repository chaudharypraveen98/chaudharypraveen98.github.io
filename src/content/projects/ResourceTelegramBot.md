---
title: "Resource Telegram Bot"
slug: "ResourceTelegramBot"
description: "A bot that will get the latest font, icons, meme, blogs and quotes. It uses the requests library to update and fetch data."
date: 2021-03-13
author: "Praveen Chaudhary"
tags: ["python", "telegram-bot", "bots"]
previewUrl: "https://drive.google.com/file/d/15clRHIMFSbxFavOY6OfTdkkXGf3P-2p2/view"
repoUrl: "https://github.com/chaudharypraveen98/ResourceTelegramBot"
image: "https://media-exp1.licdn.com/dms/image/C5603AQHRamUaMrdA9g/profile-displayphoto-shrink_400_400/0/1597315489941?e=1629936000&v=beta&t=GjvQu_r0n3F2EtGkaRYSF6pH8vRdgx5lsD1-w8dc8gY"
headerImage: "/projects/assets/img/post-bg.webp"
---

**What We are going to do?**

                        

1. Initialization of Resource Bot
2. Extracting the icons from flaticon and blogs from csstricks
3. Loading memes and quote from json file
4. Making commands and providing response in real time to users

                        

**Some Important Concept**

                        

We will be using the requests-html for scraping.

                        

**But, What is requests-html?**

                        

This library intends to make parsing HTML (e.g. scraping the web) as simple and intuitive as possible.

                        

- Full JavaScript support!
- CSS Selectors (a.k.a jQuery-style, thanks to PyQuery).
- XPath Selectors, for the faint of heart.
- Mocked user-agent (like a real web browser).
- Automatic following of redirects.
- Connection–pooling and cookie persistence.
- The Requests experience you know and love, with magical parsing abilities.
- Async Support

                        

**Requests ?**

                        

Requests is a Python HTTP library, released under the Apache License 2.0. The goal of the project is to make HTTP requests simpler and more human-friendly.

                        

**Installing Required libraries :-**

                        

```
pip install requests
pip install requests_html
```

                        
## Step 1 => Initialization of Resource Bot

                        

First get the API from [Telegram Official Page](https://core.telegram.org/)

                        

**Importing Required libraries and variables**

                        

```python
import json

import requests

Token = "Enter your Key"

    

    def send_messages(self, msg, chat_id):
        url = f"{self.base}/sendMessage?chat_id={chat_id}&text={msg}"
        if msg is not None:
            requests.get(url)
```

                        

**Initializing the Bot class and request url with our API token**

                        

```python
class ResourceBot():
    def __init__(self):
        self.token = Token
        self.base = f"https://api.telegram.org/bot{self.token}"

    ....
```

                        

**Syncing the message receive**

                        

```python
class ResourceBot():
    ....
    def get_updates(self, offset=None):
        url = f"{self.base}/getUpdates?timeout=100"
        if offset:
            url = url + f"&offset={offset + 1}"
        r = requests.get(url)
        return json.loads(r.content)
    ....
```

                        

**Sending message from our bot**

                        

```python
class ResourceBot():
    .... 
    def send_messages(self, msg, chat_id):
        url = f"{self.base}/sendMessage?chat_id={chat_id}&text={msg}"
        if msg is not None:
            requests.get(url)
```

                        

**Whole Client at Once**

                        

```python
import json

import requests

Token = "Enter your Key"

class ResourceBot():
    def __init__(self):
        self.token = Token
        self.base = f"https://api.telegram.org/bot{self.token}"

    def get_updates(self, offset=None):
        url = f"{self.base}/getUpdates?timeout=100"
        if offset:
            url = url + f"&offset={offset + 1}"
        r = requests.get(url)
        return json.loads(r.content)

    def send_messages(self, msg, chat_id):
        url = f"{self.base}/sendMessage?chat_id={chat_id}&text={msg}"
        if msg is not None:
            requests.get(url)
```

                        
## Step 2 => Extracting the icons from flaticon and blogs from csstricks

                        

We will use requests-html to extract the icons from flaticon and blogs from csstricks. We will use the css selectors to locate the element.

                        

We must have url depending on the input tag. We can frame url using our custom function.

                        
                        
                        

**Fetching the data from the url using Request-html**

                        

```python
def url_to_text(url):
    r = requests.get(url)
    if r.status_code == 200:
        html_text = r.text
        return html_text
```

                        

**r.status_code** will check the response status code. If it is valid then proceed to other part.

                        

**Parsing the Html code using HTML from requests-HTML**

                        

```python
# It will parse the html data into structure way
def pharse_and_extract(url, name=2020):
    html_text = url_to_text(url)
    if html_text is None:
        return ""
    r_html = HTML(html=html_text)
    return r_html
```

                        

**Getting Blogs from Css Tricks**

                        

It will find all the post using the css class. Then it will loop through all the posts and get all the required details like title and text.

                        

```python
def extract_from_css_tricks(res_html):
    resulted_tricks = []
    titles=res_html.find(".article-article h2 a")
    for title in titles:
      resulted_tricks.append(title.attrs['href'])
    return resulted_tricks
```

                        

**Getting Icons from Flaticons**

                        

We will make a custom url using the input tag. Then scrape the urls from that page.

                        

```python
def extract_icons_url(res_html,limit=1):
    icons_url = []
    titles=res_html.find(".icon--holder>a>img")
    for title in titles:
      icons_url.append(title.attrs['data-src'])
    return " \n".join(icons_url[:limit])
```

                        
## Step 3 => Loading memes and quote from json file

                        

We will load the memes and quotes from file using the JSON library

                        

```
with open(f'{dir_path}/memes.json', encoding="utf8") as file:
    meme_data = json.loads(file.read())

with open(f'{dir_path}/quotes.json', encoding="utf8") as file:
    quotes_data = json.loads(file.read())
```

                        
## Step 4 => Making commands and providing response in real time to users

                        

1. Make commands, so that we may know what the user want depending on the input supplied
2. Framing the url when needed
3. Replying using the custom formatter.

                        

**1. Initializing the commands**

                        

```python
def make_reply(message):
    reply = None
    if message == '/help':
        reply = "Type \n/meme to get meme \n/quote to get quote"
    elif message == '/meme':
        reply = random.choice(meme_data)
    elif message == '/resource':
        reply = "https://css-tricks.com/too-many-svgs-clogging-up-your-markup-try-use/"
    elif message == '/quote':
        reply = format_message(random.choice(quotes_data))
    elif message.startswith('/icon'):
        search_icon,*params = message.split(" ")
        if len(params)>1:
            flaticon_url = f"https://www.flaticon.com/search?word={params[0]}"
            icons = extract_icons_url(pharse_and_extract(flaticon_url),limit=int(params[-1]))
            reply = icons
    return reply
```

                        

We had used the custom formatter for quote command i.e <tt>format_message</tt>

                        

```python
def format_message(msg):
    formatted_msg = ""
    for i in msg:
        formatted_msg += f"{i.upper()} ---> {msg[i]}\n"
    return formatted_msg
```

                        
## How to run our Code

                        

1. Install the dependencies by following command  
                                pip3 install -r requirements.txt
2. Enter your token in main.py
3. Run the server.py to start the bot
4. Type `/help` to get started
5. Type `/meme` to get meme.
6. Type `/resource` to get recent resource. It's hardcoded in intial release.
7. Type `/icon  ` where `n` must be integer for how may icons you want about a particular `query`

                        
## Deployment

                        

You can only deploy on [Repl](https://replit.com/) or [Heroku](https://www.heroku.com/).

                        
                        
## Web Preview / Output

                        ![ResourceTelegramBot project screenshot](https://raw.githubusercontent.com/chaudharypraveen98/ResourceTelegramBot/master/telegram.JPG)
                        Web preview on deployment
