---
title: "StackOverflowScraper"
slug: "StackOverflowScrapper"
description: "This project aims to scraps questions depending on the fields, no of pages and question size. It makes a file with required tag. You can edit the filename easily."
date: 2020-07-27
author: "Praveen Chaudhary"
tags: ["requests", "requests-html", "pandas", "scraping", "scripting", "StackOverflowScraper"]
previewUrl: "https://drive.google.com/file/d/1HATnEAczmo3SlCD1ctq8nfH_QU0Mw-xc/preview"
repoUrl: "https://github.com/chaudharypraveen98/StackOverflowScraper"
image: "https://media-exp1.licdn.com/dms/image/C5603AQHRamUaMrdA9g/profile-displayphoto-shrink_400_400/0/1597315489941?e=1629936000&v=beta&t=GjvQu_r0n3F2EtGkaRYSF6pH8vRdgx5lsD1-w8dc8gY"
headerImage: "/projects/assets/img/post-bg.webp"
---

<iframe src="https://drive.google.com/file/d/1HATnEAczmo3SlCD1ctq8nfH_QU0Mw-xc/preview" width="640" height="480" allow="autoplay"></iframe>

**What We are going to do?**

1. First, we made a request to fetch the html page using the requests library
2. If the response is OK , then we feed into the HTML parser from requests-HTML
3. We will then use the selectors to get the required fields like question title, tag , votes and answered.

## libraries Required : -

1. Request-html
2. Pandas
3. Request library

## Prerequisites

**What are selectors/locators?**

A CSS Selector is a combination of an element selector and a value which identifies the web element within a web page.

**The choice of locator depends largely on your Application Under Test**

**Id**

An element’s id in XPATH is defined using: “[@id='example']” and in CSS using: “#” - ID's must be unique within the DOM.

Examples:

```
XPath: //div[@id='example']
CSS: #example
```

**Element Type**

The previous example showed //div in the xpath. That is the element type, which could be input for a text box or button, img for an image, or "a" for a link.

```
Xpath: //input or
Css: =input
```

**Direct Child**

HTML pages are structured like XML, with children nested inside of parents. If you can locate, for example, the first link within a div, you can construct a string to reach it. A direct child in XPATH is defined by the use of a “/“, while on CSS, it’s defined using “>”.

Examples:

```
XPath: //div/a
CSS: div > a
```

**Child or Sub-Child**

Writing nested divs can get tiring - and result in code that is brittle. Sometimes you expect the code to change, or want to skip layers. If an element could be inside another or one of its children, it’s defined in XPATH using “//” and in CSS just by a whitespace.

Examples:

```
XPath: //div//a
CSS: div a
```

**Class**

For classes, things are pretty similar in XPATH: “[@class='example']” while in CSS it’s just “.”

Examples:

```
XPath: //div[@class='example']
CSS: .example
```

## Understanding the code : -

## Requesting the html webpage

We will using the requests library to fetch the html code

```python
def extract_from_url(url):
  r = requests.get(url)
  if r.status_code not in range(200, 299):
      print("error")
      return "error while finding the data"
```

**r.status_code** will check the response status code. If it is valid then proceed to other part.

## Parsing the Html code using HTML from requests-HTML

```
html_text = r.text
formatted_html = HTML(html=html_text)
```

## Scraping using the parsed HTML code

```
data_summary = formatted_html.find(".question-summary")
data = []
classes_needed = ['.vote-count-post', '.question-hyperlink']
final_data = []
for question in data_summary:
    question_votes = question.find('.vote-count-post', first=True).text
    question_data = question.find('.question-hyperlink', first=True).text
    question_tags = question.find('.tags', first=True).text
    data = {}
    data["question"] = question_data
    data["votes"] = question_votes
    data["tags"] = question_tags
    final_data.append(data)
return final_data
```

First we find the question container that contains whole information. We had used the class css selector (.question-summary)

Then, we loop through all the question container.We can easily extract other details using the css selector like

- ('.vote-count-post') selector for votes
- ('.question-hyperlink') selector for question link
- ('.tags') selector for getting all the tags for the question

## Starting Scraper and Saving data into CSV format

```python
def scrape_stack(tag="python", page=1, pagesize="20", sortby="votes"):
    base_url = "https://stackoverflow.com/questions/tagged/"
    all_page_data = []
    # iterating through each pages
    for i in range(1, page + 1):
        url = f"{base_url}{tag}?tab={sortby}&page={i}&pagesize={pagesize}"
        all_page_data += extract_from_url(url)
    df = pd.DataFrame(all_page_data)
    df.to_csv(f"{tag}.csv", index=False)
```

To scrap the Stack Overflows Question , We have 4 keyword argument

scrape_stack(tag="python", page=1, pagesize="20", sortby="votes")

where

1. tag : Field you want to search like c, javascript, html etc.
2. page : How many pages you want to search.
3. pagesize : How much questions or thread each page contains.
4. sortby : You can sort the question according to votes,newest,active and unanswered.

if argument are passed then we made the url according to it, otherwise we will use the default arguments.

Once the scraping is done, we load that data into pandas dataframe. Once we are able to make dataframe, then we can easily export the data into .csv file.

## How to setup/run on local machine

1. First clone the repo by following command:-

```
git clone https://github.com/chaudharypraveen98/StackOverflowScraper.git
```
2. Then you have to install all the required dependencies by following command :-

```
pip3 install -r requirements.txt
```
3. Run the file in python interactive mode. Now you are ready to go. To scrap the Stack Overflows Question , type:-

```
scrape_stack(tag="python", page=1, pagesize="20", sortby="votes")
```

## Deployment

For deployment,  We are using the **Repl** or **Heroku** to deploy our localhost to web.[For More Info](https://replit.com/)

## Web Preview / Output

![StackOverflowScraper project screenshot](https://raw.githubusercontent.com/chaudharypraveen98/StackOverflowScraper/master/questions.JPG)

*Web preview on deployment*
