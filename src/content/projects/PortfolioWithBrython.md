---
title: "PortfolioWithBrython"
slug: "PortfolioWithBrython"
description: "A portfolio based on the Brython ( designed to replace Javascript as the scripting language for the Web. As such, it is a Python 3 implementation (you can take it for a test drive through a web console), adapted to the HTML5 environment, that is to say with an interface to the DOM objects and events )."
date: 2021-03-16
author: "Praveen Chaudhary"
tags: ["brython", "html", "css", "web-assembly", "python", "webdevelopment"]
previewUrl: "https://www.praveenchaudhary.in/PortfolioWithBrython/"
repoUrl: "https://github.com/chaudharypraveen98/PortfolioWithBrython"
image: "https://media-exp1.licdn.com/dms/image/C5603AQHRamUaMrdA9g/profile-displayphoto-shrink_400_400/0/1597315489941?e=1629936000&v=beta&t=GjvQu_r0n3F2EtGkaRYSF6pH8vRdgx5lsD1-w8dc8gY"
headerImage: "/projects/assets/img/post-bg.webp"
---

**What We are going to do?**

                        

1. Creating a basic template using HTML
2. Request the profile data using ajax request and loads it into json serailizer.
3. Then inject that data into html using python snippets.

                        
## Intialising the variables then loading the required libraries

                        

****

                        

```python
from browser import document,ajax,console,window,html
from browser.template import Template
import json

# Intialising the local storage
storage = window.localStorage

# Make changes Here Only
your_name = 'Praveen Chaudhary'
first_profession = 'Full Stack Developer'
second_profession = 'Data Analsyt'
company_name = 'BinaryBeast'
web_creator = 'Praveen Chaudhary'
project_container = document['ProjectContainer']
footer_element = document.select('.profile-footer')[0]

profile_endpoint = "https://raw.githubusercontent.com/chaudharypraveen98/PortfolioWithGatsby/master/src/data/GithubProfile.json"
```

                        
## Requesting data through Ajax

                        

**From where data is loaded ?**

                        

You can load data from anywhere from the web,but tries to maintain the structure like [Sample Data](#)

                        

```python
def get_project():
    req = ajax.ajax()
    req.open('GET',profile_endpoint, True)
    req.bind('complete',on_complete)
    #document['joke'].text = 'Loading...'
    req.send()
```

                        
                        
## Loading in Json Serializer

                        

It will take the response text as input and gives JSON data.

                        

```python
def on_complete(req):
    project_list = json.loads(req.responseText)
    storage['projects']=project_list
    add_project(project_list)
```

                        
## Adding Data into HTML

                        

**How the data is loaded in frontend?**

                        

Brython has sepcial methods to put data into html tags , see how it works

                        

```python
def add_project(project_list):
    for project in project_list:
        title= html.H1(project['title'],Class="singleProjectTitle")
        if project['desc']!=None:
            project_desc= html.P(project['desc'],Class="project-desc")
        else:
            project_desc= html.P("This project is made by Praveen Chaudhary",Class="project-desc")
        if project['programming_language'] !=None:
            programming_language= html.H3(project['programming_language'],Class="programming-language")
        else:
            programming_language= html.H3("Html-Css-Js",Class="programming-language")

        projectNumber= html.P(project['id'],Class="projectNumber")
        project_container <= html.DIV(title+projectNumber+project_desc+programming_language,Class="singleProject")
```

                        

> Fun Fact - Brython is designed to replace Javascript as the scripting language for the Web.

                        

**Add some stylings to make it look impressive.**

                        
## Deployment

                        

For deployment, We are using the **GitHub Pages**.  [For More Info](https://pages.github.com/)

                        
## Web Preview / Output

                        ![PortfolioWithBrython project screenshot](https://raw.githubusercontent.com/chaudharypraveen98/PortfolioWithBrython/master/brython.JPG)
                        Web preview on deployment
