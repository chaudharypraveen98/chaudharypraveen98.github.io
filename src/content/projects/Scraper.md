---
title: "Scraper"
slug: "Scraper"
description: "A scraper script which is running on python's framework Flask and Fast Api can scrape BoxOfficeMojo website."
date: 2020-06-13
author: "Praveen Chaudhary"
tags: ["fastapi", "flask", "script", "requestsHTML", "pandas", "scraping", "cli"]
previewUrl: "https://drive.google.com/file/d/1qldZHgiE9xDCtJZXJ7RcH5DsaE2xh1w2/preview"
repoUrl: "https://github.com/chaudharypraveen98/Scraper"
image: "https://media-exp1.licdn.com/dms/image/C5603AQHRamUaMrdA9g/profile-displayphoto-shrink_400_400/0/1597315489941?e=1629936000&v=beta&t=GjvQu_r0n3F2EtGkaRYSF6pH8vRdgx5lsD1-w8dc8gY"
headerImage: "/projects/assets/img/post-bg.webp"
---

<iframe src="https://drive.google.com/file/d/1qldZHgiE9xDCtJZXJ7RcH5DsaE2xh1w2/preview" width="640" height="480" allow="autoplay"></iframe>

**What We are going to do?**

1. We are creating a script to scrape the BoxOfficeMojo and export it to excel using the pandas library by making Dataframe using the nested dictionary.
2. Then, setting up the Flask Server to run periodic scraping using the get request on a particular url endpoint after a certain interval of time.
3. Then, making a url endpoint to serve the data which we had scraped till now.
4. We are making our localhost server accessible from anywhere using the Ngrok.
5. Lastly, We are making a cmdlet or powershell script to run from anywhere wether command prompt or window power shell.

## Step 1 -> Writing scraper and exporting data (Scraper.py)

### Writing scraper

We will use requestsHTML to scrape the data with the help of css selectors.

**But, What are selectors/locators?**

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

**Libraries Required :-**

1. Request-html
2. Requests
3. Pandas

**So, How to install them ?**

Run the following commands in python shell

```
pip install requests-html
pip install requests
pip install pandas
```

**Getting the html code using the Requests library**

It will take the filename as the keyword argument if save data is true. By default it will not save the html code in a file.

We are making a get request then we check for the response  status code. if status_code is in range(200,299) then its Ok.

Then the html code is feed into <tt>pharse_and_extract</tt> function

```python
def url_to_text(url, filename="world.html", save=False):
    r = requests.get(url)
    if r.status_code == 200:
        html_text = r.text
        if save:
            with open(filename, 'w') as f:
                f.write(html_text)
        return html_text
    return None
```

**Html Parsing**

The response code is parsed into html code using the requestsHTML HTML parser.

```python
def pharse_and_extract(url, name=2020):
    html_text = url_to_text(url)
    if html_text is None:
        return ""
    r_html = HTML(html=html_text)
```

**Scraping**

We will use the css selectors to locate the element and get the required data.

```python
def pharse_and_extract(url, name=2020):
    html_text = url_to_text(url)
    if html_text is None:
        return ""
    r_html = HTML(html=html_text)

    # scraping starts from here

    table_class = ".imdb-scroll-table"
    r_table = r_html.find(table_class)
    table_data = []

    if len(r_table) == 1:
        table = r_table[0]
        header_col = table.find("th")
        header_names = [x.text for x in header_col]
        rows = table.find("tr")
        for row in rows[1:]:
            cols = row.find("td")
            row_data = []
            for i, col in enumerate(cols):
                row_data.append(col.text)
            table_data.append(row_data)
```

**Exporting into CSV file**

Once the data is scraped, then it is loaded into Pandas Dataframe and then exported into CSV file.

```python
def pharse_and_extract(url, name=2020):
    html_text = url_to_text(url)
    if html_text is None:
        return ""
    r_html = HTML(html=html_text)
    table_class = ".imdb-scroll-table"
    r_table = r_html.find(table_class)
    table_data = []

    if len(r_table) == 1:
        table = r_table[0]
        header_col = table.find("th")
        header_names = [x.text for x in header_col]
        rows = table.find("tr")
        for row in rows[1:]:
            cols = row.find("td")
            row_data = []
            for i, col in enumerate(cols):
                row_data.append(col.text)
            table_data.append(row_data)

    # exporting data starts from here
    
    path = os.path.join(BASE_DIR, 'data')
    os.makedirs(path, exist_ok=True)
    filepath = os.path.join('data', f'{name}.csv')

    # loading into dataframe
    df = pd.DataFrame(table_data, columns=header_names)
    df.to_csv(filepath, index=False)
```

## Step 2 -> Setting up Flask Server

We are making a url endpoint, so that we can set up periodic scraping through a post request.

```python
from flask import Flask
from scraper import run as scraper_runner
from logger import log_save

app = Flask(__name__)

@app.route("/box-office", methods=['POST'])
def box_office_view():
    log_save()
    scraper_runner()
    return "done"
```

## Step 3 -> Serving the scraped data using FastAPI

we will load the data into dataframe from a csv file and then return a dictionary data to the forntend

```python
from fastapi import FastAPI
from scraper import run as scraper_runner
from logger import log_save
import os
import pandas as pd

app = FastAPI()

# Getting the file location

current = (os.path.join(os.getcwd(), 'data'))
os.makedirs(current, exist_ok=True)
file = os.path.join(current, "box_office_cleaned.csv")

# Serving the file on a get request

@app.get("/box-office-collect")
def abc():
    df = pd.read_csv(file)
    return df.to_dict("Rank")
```

We can even setup periodic scraping in FastAPI too by simple command given below -:

```python
@app.post("/box-office")
def box_office():
    log_save()
    scraper_runner()
    return {"data": "success"}
```

## Step 4 -> Deployment

For deployment,  We are using the **Ngrok** to deploy our localhost to web.[For More Info](https://ngrok.com/)

Make a python file (trigger.py)

Once our flask server is exposed through ngrok then we can make a post request to make a periodic scraping. We can use tools for that purpose like :-

1. UptimeRobot
2. Freshworks
3. Uptrends

```python
import requests

url = "http://9d44e5091b7d.ngrok.io"
endpoint = f'{url}/box-office'
r = requests.post(endpoint, json={})
print(r.text)
```

## Step 5 -> Making a ps1 script

It will help us to run command from anywhere like cmd, powershell etc

**Make a file with ps1 extension**

**For Flask Server**

```
set FLASK_APP=flask_server.py
$env:FLASK_APP = "flask_server.py"
flask run --host=127.0.0.1 --port=8000
```

**For FastAPI Server**

```
uvicorn fast_server:app --port 8888
```

## Web Preview / Output

![Scraper project screenshot](https://raw.githubusercontent.com/chaudharypraveen98/Scraper/master/output.JPG)

*Web preview on deployment*
