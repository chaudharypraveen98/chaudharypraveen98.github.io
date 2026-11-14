---
title: "Opportunities Bot Discord"
slug: "OpportunitiesBotDiscord"
description: "A bot that can extract the internship posts from the internshala and store in the repl database and gives response when asked."
date: 2021-03-11
author: "Praveen Chaudhary"
tags: ["discord-bot", "python", "requests-html", "bot"]
image: "https://media-exp1.licdn.com/dms/image/C5603AQHRamUaMrdA9g/profile-displayphoto-shrink_400_400/0/1597315489941?e=1629936000&v=beta&t=GjvQu_r0n3F2EtGkaRYSF6pH8vRdgx5lsD1-w8dc8gY"
headerImage: "/projects/assets/img/post-bg.webp"
---

**What We are going to do?**

1. Extracting the Opportunities from Internshala and Freelancer.
2. Initializing the Discord client.
3. Making commands, caching it for further use and providing response in real time to users

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

**Dicord Python**

A modern, easy to use, feature-rich, and async ready API wrapper for Discord written in Python.

**Installing Required libraries :-**

```
pip install requests
pip install requests_html
pip install discord
```

## Step 1 => Extracting the Opportunities from Internshala and Freelancer

We will requests-html to extract the opportunities from Freelancer and Internshala. We will use the css selectors to loacte the element.

We must have url depending on the input tag. We can frame url using our custom function.

**For Internshala Url**

```python
# It will start the scraper. If It has a keyword then url will be based upon that.
def start_scraper(keyword=None):
    if keyword:
        url = f"https://internshala.com/internships/keywords-{keyword}"
    else:
        url = "https://internshala.com/internships"
    return get_internship(url)
```

**For Freelancer Url**

```python
# Starter function for freelancing function
def get_freelance(keyword=None):
    random_keywords = ['python', 'java', 'web', 'javascript', 'graphics']
    if keyword:
        url = f"https://www.freelancer.com/jobs/?keyword={keyword}"
    else:
        random_keyword = random.choice(random_keywords)
        url = f"https://www.freelancer.com/jobs/?keyword={random_keyword}"
    res_html = pharse_and_extract(url)
    freelance_works = extract_from_freelancer(res_html)
    return freelance_works
```

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

**Getting internship from Internshala**

It will find all the post using the css class. Then it will loop through all the posts and get all the required details like stipend, duration, organisation name and so on.

```python
# it will loop through all the internship and extract valuable data
def get_internship(url):
    internships = []
    res_data = pharse_and_extract(url)
    opportunties = res_data.find(".individual_internship")
    for opportunity in opportunties:
        title = opportunity.find(".company a", first=True).text
        internship_link = opportunity.find(".profile a", first=True).attrs['href']
        organisation = opportunity.find(".company .company_name", first=True).text
        organisation_internships = opportunity.find(".company_name a", first=True).attrs['href']
        location = opportunity.find(".location_link", first=True).text
        start_data = opportunity.find("#start-date-first", first=True).text.split("\xa0immediately")[-1]
        ctc = opportunity.find(".stipend", first=True).text
        apply_lastes_by = opportunity.xpath(".//span[contains(text(),'Apply By')]/../../div[@class='item_body']",
                                            first=True).text
        duration = opportunity.xpath(".//span[contains(text(),'Duration')]/../../div[@class='item_body']",
                                     first=True).text
        internships.append({
            'title': title,
            'organisation': organisation,
            'location': location,
            'start_data': start_data,
            'ctc': ctc,
            'apply_lastes_by': apply_lastes_by,
            'duration': duration,
            'organisation_internships': f"https://internshala.com{organisation_internships}",
            'internship_link': f"https://internshala.com{internship_link}"
        })
    return internships
```

**Getting Jobs using Freelancer Work**

Same like above, First it will all post using the common class and then loop through it ie. <code>(.JobSearchCard-item)</code> class.

```python
# It will extract the freelancing opportunities
def extract_from_freelancer(res_html):
    freelance_works = []
    opportunities = res_html.find(".JobSearchCard-item")
    for opportunity in opportunities:
        title = opportunity.find(".JobSearchCard-primary-heading a", first=True).text
        freelance_link = opportunity.find(".JobSearchCard-primary-heading a", first=True).attrs['href']
        avg = opportunity.find(".JobSearchCard-primary-price")
        if avg:
            avg_proposal = avg[0].text
        else:
            avg_proposal = "Not mentioned"
        apply_lastes_by = opportunity.find(".JobSearchCard-primary-heading-days", first=True).text
        desc = opportunity.find(".JobSearchCard-primary-description", first=True).text
        freelance_works.append({
            'title': title,
            'description': desc,
            'apply_lastes_by': apply_lastes_by,
            'avg_proposal': avg_proposal,
            'freelance_link': f"https://www.freelancer.com/{freelance_link}"
        })
    return freelance_works
```

## Step 2 => Initializing the Discord client

It will initialize the client so that we can use later when needed.

**Please make sure to put the channel ID**

```

```

@client.event
async def on_ready():
channel = client.get_channel(<>)
print("We have logged in as", client.user)

## Step 3 => Making commands, caching it for further use and providing response in real time to users

**What is Repl Database?**

Replit Database is a simple, user-friendly key-value store inside of every repl. No configuration is required; you can get started right away!

What we are going to do in the step?

1. Make commands, so that we may know what the user want depending on the input supplied
2. Checking is the data is present in database or not.
3. If present, then provide the response using our custom formatter
4. If not, Scrape then provide response using formatter

**1. Initializing the commands**

```python
@client.event
async def on_message(message):
    if message.author == client.user:
        return
    if message.content.startswith('$hello'):
        await message.channel.send(f"Hello {message.author}")
    if message.content.startswith('$reset internship'):
        del db['internship']
        await message.channel.send("cleared internship")
    if message.content.startswith('$reset freelance'):
        del db['freelance']
        await message.channel.send("cleared freelance")
    if message.content.startswith('$reset'):
        db.clear()
        await message.channel.send("cleared all")
    if message.content.startswith('$help'):
        db.clear()
        await message.channel.send(
            "------------------\nwrite $internship with space separated field or keyword \n\nExample \n$internship python \n\nFor Freelance \n----------------------\nwrite $freelance with space separated\n----------------------- \n\nExample \n$freelance python \n\nOr \n\n $freelance \nfor random freelance work")

    if message.content.startswith('$internship'):
        .... 

    if message.content.startswith('$freelance'):
        ....
```

**2. Checking Repl Database**

```
....
if message.content.startswith('$freelance'):
    key_list = message.content.split(" ")
    if len(key_list) > 1:
        keyword = key_list[1]
        if 'freelance' in db.keys():
            if keyword in db['freelance'].keys():
                free_result = random.choice(db['freelance'][keyword])

            else:
                freelance_works = get_freelance(keyword=keyword)
                db['freelance'][keyword] = freelance_works
                free_result = random.choice(freelance_works)
....
```

**If data is found in database**

```
....
result_message = format_message(free_result)
await message.channel.send(result_message)
....
```

**If not, scrape then response**

```
...
else:
    db['freelance'] = {}
    freelance_works = get_freelance(keyword=keyword)
    db['freelance'][keyword] = freelance_works
    free_result = random.choice(freelance_works)
result_message = format_message(free_result)
await message.channel.send(result_message)
...
```

**Whole Code at Once**

```python
@client.event
async def on_message(message):
    if message.author == client.user:
        return
    if message.content.startswith('$hello'):
        await message.channel.send(f"Hello {message.author}")
    if message.content.startswith('$reset internship'):
        del db['internship']
        await message.channel.send("cleared internship")
    if message.content.startswith('$reset freelance'):
        del db['freelance']
        await message.channel.send("cleared freelance")
    if message.content.startswith('$reset'):
        db.clear()
        await message.channel.send("cleared all")
    if message.content.startswith('$help'):
        db.clear()
        await message.channel.send(
            "------------------\nwrite $internship with space separated field or keyword \n\nExample \n$internship python \n\nFor Freelance \n----------------------\nwrite $freelance with space separated\n----------------------- \n\nExample \n$freelance python \n\nOr \n\n $freelance \nfor random freelance work")

    if message.content.startswith('$internship'):
        keyword = message.content.split(" ")[-1]
        print(keyword)
        if 'internship' in db.keys():
            if keyword in db['internship'].keys():
                result = random.choice(db[keyword])
            else:
                opportunities = start_scraper(keyword=keyword)
                db['internship'][keyword] = opportunities
                result = random.choice(opportunities)
        else:
            db['internship'] = {}
            opportunities = start_scraper(keyword=keyword)
            db['internship'][keyword] = opportunities
            result = random.choice(opportunities)

        result_message = format_message(result)
        await message.channel.send(result_message)

    if message.content.startswith('$freelance'):
        key_list = message.content.split(" ")
        if len(key_list) > 1:
            keyword = key_list[1]
            if 'freelance' in db.keys():
                if keyword in db['freelance'].keys():
                    free_result = random.choice(db['freelance'][keyword])

                else:
                    freelance_works = get_freelance(keyword=keyword)
                    db['freelance'][keyword] = freelance_works
                    free_result = random.choice(freelance_works)

            else:
                db['freelance'] = {}
                freelance_works = get_freelance(keyword=keyword)
                db['freelance'][keyword] = freelance_works
                free_result = random.choice(freelance_works)
            result_message = format_message(free_result)
            await message.channel.send(result_message)

        else:
            if 'freelance' in db.keys():
                if 'random' in db['freelance'].keys():
                    free_result = random.choice(db['freelance']['random'])
                else:
                    data = get_freelance()
                    db['freelance']['random'] = data
                    free_result = random.choice(data)
            else:
                db['freelance'] = {}
                data = get_freelance()
                db['freelance']['random'] = data
                free_result = random.choice(data)

            result_message = format_message(free_result)
            await message.channel.send(result_message)
```

## Deployment

You can only deploy on [Repl](https://replit.com/) as we are using the Repl Database.

## Web Preview / Output

![OpportunitiesBotDiscord project screenshot](https://raw.githubusercontent.com/chaudharypraveen98/OpportunitiesBotDiscord/master/opportunities.JPG)

*Web preview on deployment*
