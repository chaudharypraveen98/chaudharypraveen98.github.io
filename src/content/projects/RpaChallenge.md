---
title: "RpaChallenge"
slug: "RpaChallenge"
description: "Solving Rpa challenge with the help of robot framework."
date: 2020-10-31
author: "Praveen Chaudhary"
tags: ["robotframework", "python", "rpa-challenge", "automation"]
previewUrl: "https://drive.google.com/file/d/1gh09T8UOu3S6JHCmrlvg36oqsSvx-XrM/preview"
repoUrl: "https://github.com/chaudharypraveen98/RpaChallenge"
image: "https://media-exp1.licdn.com/dms/image/C5603AQHRamUaMrdA9g/profile-displayphoto-shrink_400_400/0/1597315489941?e=1629936000&v=beta&t=GjvQu_r0n3F2EtGkaRYSF6pH8vRdgx5lsD1-w8dc8gY"
headerImage: "/projects/assets/img/post-bg.webp"
---

<iframe src="https://drive.google.com/file/d/1gh09T8UOu3S6JHCmrlvg36oqsSvx-XrM/preview" width="640" height="480" allow="autoplay"></iframe>

**What We are going to do?**

1. Starting the RpaChallenge Website
2. Simply input the data from excel sheet
3. Finding the suitable selectors and entering the data.

### Understanding Some Important Concepts

**What is Robot Framework?**

Robot Framework is a generic open source automation framework. It can be used for test automation and robotic process automation (RPA). Read more on [robot framework website](https://robotframework.org/)

We will be using the css selectors.

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

1. robotframework => It is main framework which runs all the code under the keyword.
2. robotframework-seleniumlibrary => It is responsible for managing the browser
3. robotframework-datadriver => It will take the data from excel to the program

**So, How to install them ?**

Run the following commands in python shell

```
pip install robotframework
pip install robotframework-seleniumlibrary
pip install robotframework-datadriver
```

## Step 1 => Starting the RpaChallenge Website (RpaResource.robot)

It will open the browser with the help of selenium webdriver

It will then load the [Rpa challenge](http://www.rpachallenge.com/) website and start the test.

```
*** Settings ***
Library  SeleniumLibrary

*** Variables ***
${browser}  chrome
${url}      http://www.rpachallenge.com/

*** Keywords ***
StartTheTestCase
    Open browser    ${url}  ${browser}
    Page Should Contain Element     xpath://button[contains(text(),"Start")]
    click element   xpath://button[contains(text(),"Start")]
```

## Step 2 -> Simply input the data from excel sheet (data_entry.robot)

We will use the robotframework-data driver to load the data from the excel file

```
*** Settings ***
Library  SeleniumLibrary
Library  DataDriver     ../TestData/challenge.xlsx
Resource    ../Resource/RpaResource.robot
Suite Setup     StartTheTestCase
Test Template   EnterTheData

*** Variables ***

*** Test Cases ***
EnterTheData with   ${First}     ${Last}     ${Company}  ${Role}     ${Address}  ${Email}    ${Phone}
```

## Step 3 -> Finding the suitable selectors and entering the data (data_entry.robot)

We will locate the element with the help to css selector and then enters the required data and finishes the task.

```
*** Settings ***
Library  SeleniumLibrary
Library  DataDriver     ../TestData/challenge.xlsx
Resource    ../Resource/RpaResource.robot
Suite Setup     StartTheTestCase
Test Template   EnterTheData

*** Variables ***

*** Test Cases ***
EnterTheData with   ${First}     ${Last}     ${Company}  ${Role}     ${Address}  ${Email}    ${Phone}

*** Keywords ***
EnterTheData
    [Arguments]  ${First}       ${Last}     ${Company}  ${Role}     ${Address}  ${Email}    ${Phone}
    input text   xpath://input[@ng-reflect-name="labelPhone"]       ${Phone}
    input text   xpath://input[@ng-reflect-name="labelCompanyName"]       ${Company}
    input text   xpath://input[@ng-reflect-name="labelRole"]       ${Role}
    input text   xpath://input[@ng-reflect-name="labelAddress"]       ${Address}
    input text   xpath://input[@ng-reflect-name="labelEmail"]       ${Email}
    input text   xpath://input[@ng-reflect-name="labelFirstName"]       ${First}
    input text   xpath://input[@ng-reflect-name="labelLastName"]       ${Last}
    click element   xpath://input[@type="submit"]
```

## How to run code ?

1. Install all the required libraries by : -

```
pip install -r requirements.txt
```
2. Then you need to install the selenium web driver in your system. You can follow this link Youtube
3. Run the following command

```
robot TestCases/data_entry.robot
```

## Web Preview / Output

![RpaChallenge project screenshot](https://raw.githubusercontent.com/chaudharypraveen98/RpaChallenge/master/result.JPG)

*Web preview on deployment*
