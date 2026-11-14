---
title: "AutoInsta"
slug: "AutoInsta"
description: "A python script which automate the working of instagram account. It provides various feature such as auto removing following, removing following that are not follower and downloading the media files, images and videos."
date: 2020-06-24
author: "Praveen Chaudhary"
tags: ["instagram", "python", "selenium", "automation"]
previewUrl: "https://drive.google.com/file/d/1Op8PgiifKK3Mjus5lgdDpgWCndp0nFWS/preview"
repoUrl: "https://github.com/chaudharypraveen98/AutoInsta"
image: "https://raw.githubusercontent.com/chaudharypraveen98/AutoInsta/master/quotes.JPG"
headerImage: "/projects/assets/img/post-bg.webp"
---

![AutoInsta](https://raw.githubusercontent.com/chaudharypraveen98/AutoInsta/master/AutoInsta.png)

**What We are going to do?**

1. Making a Login Script
2. Accessing the timeline feeds and downloading the media files
3. Managing the followers and followings
4. How to run our code

**Libraries/Tools required : -**

1. Chrome webdriver(same version as chrome browser)
2. Requests library
3. Selenium library
4. Urllib3

**Installing Libraries/Tools**

**For Chrome Web driver**

You can download it from [here](https://chromedriver.chromium.org/downloads)

If you are unable to install then you can follow this link [Youtube](https://www.youtube.com/watch?v=dz59GsdvUF8)

**Installing libraries**

```
pip install requests
pip install urllib3
pip install selenium
```

**Before moving ahead, We must be aware of Css selectors**

You can visit [Here](https://www.guru99.com/xpath-selenium.html)

## Step 1 -> Making a Login Script

We will make a script which will take the username and password from the config file and login to the user account so that we can perform other activites

First make a **config** file containing username and password.

```
USERNAME = ""
PASSWORD = ""
```

**Writing script**

First initiate the Chrome webdriver, base path and user url

```
BASE_DIR = os.path.dirname(__file__)
browser = webdriver.Chrome()
user_url = f"https://www.instagram.com/{USERNAME}"
```

**Login Function**

We will use the css selectors to locating the username field and password field. After entering the username and password at correct places, we click the submit button by location it by <tt>button[type='submit']</tt>

```python
# login in the instagram account
def login(browser=browser, username=USERNAME, password=PASSWORD):
    browser.get("https://www.instagram.com/")
    time.sleep(2)
    username_field = browser.find_element_by_name("username")
    username_field.send_keys(username)
    password_field = browser.find_element_by_name("password")
    password_field.send_keys(password)
    btn = browser.find_element_by_css_selector("button[type='submit']")
    time.sleep(2)
    btn.click()
```

## Step 2 -> Accessing the timeline feeds and downloading the media files

It will open the user timeline and downloads media files depending upon the input passed.

```python
def get_media(username=USERNAME, media_type=None, count=3, browser=browser)
    .....
```

It will take 4 keyword argument.

1. count : It refers to the number of post it should search to download.
2. username : Don't pass any username parameter if you want to download the self account post otherwise mention the username of other people.
3. media_type : It can be anyone either img or video but you need to pass the parameter in lower case. Don't pass any parameter to download both media  type.
4. browser : It is just an instance of web driver

```python
def get_media(username=USERNAME, media_type=None, count=3, browser=browser):
    person_url = f"https://www.instagram.com/{username}/"
    browser.get(person_url)

    # creating user media directory
    src_path = os.path.join(BASE_DIR, f"{username}")
    os.makedirs(src_path, exist_ok=True)

    # getting media links from the function
    media_elements = getting_all_post(media_type, count)
    print(media_elements)
    time.sleep(1.2)
    ...
    ...
```

It will first fetch the url. Then initiate the base dir for downloading media files.

Then It will call the <tt>getting_all_post</tt> function to retrieve all the media urls.

**<tt>getting_all_post</tt> Function**

It will take two arguments

1. media_type : It can be anyone either img or video but you need to pass the parameter in lower case. Don't pass any parameter to download both media  type.
2. count : It refers to the number of post it should search to download.

media nested array is intialized. The **zero index** will contains all the images in the post while the **first** index will contains all the video links

```python
# returning src url from all post
def getting_all_post(media_type, count):
    media = [[], []]
    post_xpath = f"//a[contains(@href,'/p/')]"
    post_media = browser.find_elements_by_xpath(post_xpath)
    search_upto = len(post_media)
    if count and count > search_upto:
        print("only", search_upto, "media files alvailable")
        print("downloading---", search_upto, "files only")
        search_upto = count
    elif count:
        search_upto = count
    for post in post_media[0:search_upto]:
        browser.execute_script("arguments[0].click()", post)
        time.sleep(2.5)
        media[0] += get_src_from_post()
        try:
            media[1] += get_src_from_post(post_type="video")
        except NoSuchElementException:
            pass
        close_btn()

    # only returning the video url from all media url
    if media_type == 'video':
        return media[1]
    elif media_type == 'img':
        return media[0]
    else:
        return (media[0] + media[1])
```

It will get the src url of video and img using the <tt>get_src_from_post</tt> function so that we can download later.

**<tt>get_src_from_post</tt> Function**

It will take the source url from a particular post

```python
# returning src of a particular post
def get_src_from_post(post_type="img"):
    links = []
    file_path = "//div[@role='button']//img[@style]"
    if post_type == "video":
        file_path = "//video[@type='video/mp4']"
    print(post_type)
    files = browser.find_elements_by_xpath(file_path)
    links += [file.get_attribute('src') for file in files]
    return links
```

Once we get all the urls, we will now download all the media files required

Continuing with the <tt>get_media</tt> function

```python
def get_media(username=USERNAME, media_type=None, count=3, browser=browser):
    person_url = f"https://www.instagram.com/{username}/"
    browser.get(person_url)

    # creating user media directory
    src_path = os.path.join(BASE_DIR, f"{username}")
    os.makedirs(src_path, exist_ok=True)

    # getting media links from the function
    media_elements = getting_all_post(media_type, count)
    print(media_elements)
    time.sleep(1.2)

    # looping through the media links
    for element_url in media_elements:
        # parsing the correct file name
        base_url = urlparse(element_url).path
        filename = os.path.basename(base_url)
        print(base_url, "-------", filename)

        # creating the get request to download the media files
        with requests.get(element_url, stream=True) as r:
            if r.status_code not in range(200, 299):
                print("downloading fails, trying next")
            filepath = os.path.join(src_path, f'{username}{filename}')
            if os.path.exists(filepath):
                print("file already exists")
                continue

            # open created file to write as binary
            with open(filepath, 'wb') as f:
                for chunk in r.iter_content():
                    if chunk:
                        f.write(chunk)
            print(element_url)

    print("-----------Done--------")
```

We will now iterate over the list of all media urls.

We will be using the **urlparse** from the **urllib3** library to name our particular media file.

Now we will request that url using the **Requests** library to download it. If the status_code is 200 (or response is ok) then we will write that file in the disk at the preferred location.

## Step 3 -> Managing the followers and followings

We can follow other suggested users or unfollow the ones that are not following us.

**Following Management**

It will remove a particular no of following

**HHow does code work ?**

1. Gets the user profile/timeline page
2. Open the following section
3. Then checks if count of following is greater then 12 then it will scroll and find others following as first page only contains 12 followings
4. It will remove following until input no of followings are not removed

```python
# removing a particular no of following
def remove_following(remove=0, browser=browser):
    browser.get(user_url)
    time.sleep(1.2)
    open_following_section()
    following_removed = 0
    if remove > 12:
        time.sleep(1.3)
        scroll_to_bottom("((//nav)[3]//following::div)[1]")
        time.sleep(1)
    following_path = "//a[@title]"
    following_sel_list = browser.find_elements_by_xpath(following_path)
    while following_removed ≷ remove:
        try:
            user_name = following_sel_list[following_removed].text
            following_x_path = f"//a[@title='{user_name}']//following::button"
            following_btn = browser.find_element_by_xpath(following_x_path)
            following_btn.click()
            # print("removed----", user_name)
            following_removed += 1
            time.sleep(1.7)
            unfollow_btn()
            # print("un follow", following_removed)
        except:
            break
    else:
        print("successfully removed", following_removed, "followers")
    close_btn()
```

It will use a <tt>open_following_section</tt> Function to follow the following section

**<tt>open_following_section</tt> Function**

```python
def open_following_section():
    follow_section_x_path = "//a[contains(@href,'following')]"
    follow_section = browser.find_element_by_xpath(follow_section_x_path)
    follow_section.click()
```

For scrolling bottom , we have used the <tt>scroll_to_bottom</tt> Function using the execute javascript function

```python
# it scrolls a particular section of the site
def scroll_to_bottom(scroll_xpath):
    scroll_time = 1.3
    scroll_element = browser.find_element_by_xpath(scroll_xpath)
    last_height = browser.execute_script("return arguments[0].scrollHeight;", scroll_element)
    while True:
        browser.execute_script("arguments[0].scrollTo(0, arguments[1]);", scroll_element, last_height)
        time.sleep(scroll_time)
        new_height = browser.execute_script("return arguments[0].scrollHeight;", scroll_element)
        if new_height == last_height:
            break
        last_height = new_height
```

We have also used the <tt>unfollow_btn</tt> function to click the unfollow button

```python
# finds the unfollow btn and click it.
def unfollow_btn():
    un_path = "//button[contains(text(),'Unfollow')]"
    un_follow = browser.find_element_by_xpath(un_path)
    un_follow.click()
```

Once our task is achieved, we closed that section using the <tt>close_btn</tt>

```python
def close_btn():
    close_btn_path = "//*[name()='svg' and @aria-label='Close']"
    close = browser.find_element_by_xpath(close_btn_path)
    close.click()
```

**Managing Followers**

It will help us to unfollow the users that are not following us

**How does this code works**

1. Gets the following page
2. Then opens the following section
3. Gets all the users so that we can compare later with the followers
4. Then open the followers page
5. Gets all the followers and compare with the following
6. Remove the ones which are not following us

```python
# it removes the following that are not your follower
def remove_following_not_followers(count=None, browser=browser):
    browser.get(user_url)
    time.sleep(1.3)
    open_following_section()
    time.sleep(1.3)
    scroll_to_bottom("((//nav)[3]//following::div)[1]")
    time.sleep(1)

    following_path = "//a[@title]"
    following_sel_list = browser.find_elements_by_xpath(following_path)
    following_list = {x.text for x in following_sel_list}
    print("followings are ", len(following_list), "--------------", following_list)

    close_btn()
    time.sleep(1)
    open_follower_section()
    time.sleep(1)
    scroll_to_bottom("((//div[@role='dialog']//div)[1]//div)[5]")

    followers_path = "(((//div[@role='dialog']//div)[1]//div)[5]//ul)[1]//a[@title]"
    followers_sel_list = browser.find_elements_by_xpath(followers_path)
    followers_list = {x.text for x in followers_sel_list}
    close_btn()
    print("followings are ", len(followers_list), "-------------------", followers_list)

    unwanted_follower = following_list - followers_list
    no_of_unwanted_follower = len(unwanted_follower)
    print("length of unwanted follower", no_of_unwanted_follower)
    time.sleep(1)

    open_following_section()
    time.sleep(1)
    scroll_to_bottom("((//nav)[3]//following::div)[1]")

    if count and count > no_of_unwanted_follower:
        print("the count exceeded only", no_of_unwanted_follower, "unwanted followers are there")
        no_of_unwanted_follower = count
    elif count:
        no_of_unwanted_follower = count

    for following in unwanted_follower[0:no_of_unwanted_follower]:
        print("removing---------", following)
        following_x_path = f"//a[@title='{following}']//following::button"
        following_btn = browser.find_element_by_xpath(following_x_path)
        following_btn.click()
    close_btn()
```

we have already discussed about the <tt>open_following_section</tt> , <tt>unfollow_btn</tt>, and <tt>close_btn</tt> Function. Lets discuss the other remained function used in this program.

**<tt>open_follower_section</tt> Function**

```python
def open_follower_section():
    follow_section_x_path = "//a[contains(@href,'followers')]"
    follow_section = browser.find_element_by_xpath(follow_section_x_path)
    follow_section.click()
```

**Lets merge all the codes together**

```python
import os
import requests
import time
from selenium import webdriver
from selenium.common.exceptions import NoSuchElementException
from urllib.parse import urlparse

from config1 import USERNAME, PASSWORD

BASE_DIR = os.path.dirname(__file__)
browser = webdriver.Chrome()
user_url = f"https://www.instagram.com/{USERNAME}"

# login in the instagram account
def login(browser=browser, username=USERNAME, password=PASSWORD):
    browser.get("https://www.instagram.com/")
    time.sleep(2)
    username_field = browser.find_element_by_name("username")
    username_field.send_keys(username)
    password_field = browser.find_element_by_name("password")
    password_field.send_keys(password)
    btn = browser.find_element_by_css_selector("button[type='submit']")
    time.sleep(2)
    btn.click()

# returning src of a particular post
def get_src_from_post(post_type="img"):
    links = []
    file_path = "//div[@role='button']//img[@style]"
    if post_type == "video":
        file_path = "//video[@type='video/mp4']"
    print(post_type)
    files = browser.find_elements_by_xpath(file_path)
    links += [file.get_attribute('src') for file in files]
    return links

# returning src url from all post
def getting_all_post(media_type, count):
    media = [[], []]
    post_xpath = f"//a[contains(@href,'/p/')]"
    post_media = browser.find_elements_by_xpath(post_xpath)
    search_upto = len(post_media)
    if count and count > search_upto:
        print("only", search_upto, "media files alvailable")
        print("downloading---", search_upto, "files only")
        search_upto = count
    elif count:
        search_upto = count
    for post in post_media[0:search_upto]:
        browser.execute_script("arguments[0].click()", post)
        time.sleep(2.5)
        media[0] += get_src_from_post()
        try:
            media[1] += get_src_from_post(post_type="video")
        except NoSuchElementException:
            pass
        close_btn()

    # only returning the video url from all media url
    if media_type == 'video':
        return media[1]
    elif media_type == 'img':
        return media[0]
    else:
        return (media[0] + media[1])

def get_media(username=USERNAME, media_type=None, count=3, browser=browser):
    person_url = f"https://www.instagram.com/{username}/"
    browser.get(person_url)

    # creating user media directory
    src_path = os.path.join(BASE_DIR, f"{username}")
    os.makedirs(src_path, exist_ok=True)

    # getting media links from the function
    media_elements = getting_all_post(media_type, count)
    print(media_elements)
    time.sleep(1.2)

    # looping through the media links
    for element_url in media_elements:
        # parsing the correct file name
        base_url = urlparse(element_url).path
        filename = os.path.basename(base_url)
        print(base_url, "-------", filename)

        # creating the get request to download the media files
        with requests.get(element_url, stream=True) as r:
            if r.status_code not in range(200, 299):
                print("downloading fails, trying next")
            filepath = os.path.join(src_path, f'{username}{filename}')
            if os.path.exists(filepath):
                print("file already exists")
                continue

            # open created file to write as binary
            with open(filepath, 'wb') as f:
                for chunk in r.iter_content():
                    if chunk:
                        f.write(chunk)
            print(element_url)

    print("-----------Done--------")

# removing a particular no of following
def remove_following(remove=0, browser=browser):
    browser.get(user_url)
    time.sleep(1.2)
    open_following_section()
    following_removed = 0
    if remove > 12:
        time.sleep(1.3)
        scroll_to_bottom("((//nav)[3]//following::div)[1]")
        time.sleep(1)
    following_path = "//a[@title]"
    following_sel_list = browser.find_elements_by_xpath(following_path)
    while following_removed < remove:
        try:
            user_name = following_sel_list[following_removed].text
            following_x_path = f"//a[@title='{user_name}']//following::button"
            following_btn = browser.find_element_by_xpath(following_x_path)
            following_btn.click()
            # print("removed----", user_name)
            following_removed += 1
            time.sleep(1.7)
            unfollow_btn()
            # print("un follow", following_removed)
        except:
            break
    else:
        print("successfully removed", following_removed, "followers")
    close_btn()

# finds the unfollow btn and click it.
def unfollow_btn():
    un_path = "//button[contains(text(),'Unfollow')]"
    un_follow = browser.find_element_by_xpath(un_path)
    un_follow.click()

def open_following_section():
    follow_section_x_path = "//a[contains(@href,'following')]"
    follow_section = browser.find_element_by_xpath(follow_section_x_path)
    follow_section.click()

def open_follower_section():
    follow_section_x_path = "//a[contains(@href,'followers')]"
    follow_section = browser.find_element_by_xpath(follow_section_x_path)
    follow_section.click()

def close_btn():
    close_btn_path = "//*[name()='svg' and @aria-label='Close']"
    close = browser.find_element_by_xpath(close_btn_path)
    close.click()

# it scrolls a particlar section of the site
def scroll_to_bottom(scroll_xpath):
    scroll_time = 1.3
    scroll_element = browser.find_element_by_xpath(scroll_xpath)
    last_height = browser.execute_script("return arguments[0].scrollHeight;", scroll_element)
    while True:
        browser.execute_script("arguments[0].scrollTo(0, arguments[1]);", scroll_element, last_height)
        time.sleep(scroll_time)
        new_height = browser.execute_script("return arguments[0].scrollHeight;", scroll_element)
        if new_height == last_height:
            break
        last_height = new_height

# it removes the following that are not your follower
def remove_following_not_followers(count=None, browser=browser):
    browser.get(user_url)
    time.sleep(1.3)
    open_following_section()
    time.sleep(1.3)
    scroll_to_bottom("((//nav)[3]//following::div)[1]")
    time.sleep(1)

    following_path = "//a[@title]"
    following_sel_list = browser.find_elements_by_xpath(following_path)
    following_list = {x.text for x in following_sel_list}
    print("followings are ", len(following_list), "--------------", following_list)

    close_btn()
    time.sleep(1)
    open_follower_section()
    time.sleep(1)
    scroll_to_bottom("((//div[@role='dialog']//div)[1]//div)[5]")

    followers_path = "(((//div[@role='dialog']//div)[1]//div)[5]//ul)[1]//a[@title]"
    followers_sel_list = browser.find_elements_by_xpath(followers_path)
    followers_list = {x.text for x in followers_sel_list}
    close_btn()
    print("followings are ", len(followers_list), "-------------------", followers_list)

    unwanted_follower = following_list - followers_list
    no_of_unwanted_follower = len(unwanted_follower)
    print("length of unwanted follower", no_of_unwanted_follower)
    time.sleep(1)

    open_following_section()
    time.sleep(1)
    scroll_to_bottom("((//nav)[3]//following::div)[1]")

    if count and count > no_of_unwanted_follower:
        print("the count exceeded only", no_of_unwanted_follower, "unwanted followers are there")
        no_of_unwanted_follower = count
    elif count:
        no_of_unwanted_follower = count

    for following in unwanted_follower[0:no_of_unwanted_follower]:
        print("removing---------", following)
        following_x_path = f"//a[@title='{following}']//following::button"
        following_btn = browser.find_element_by_xpath(following_x_path)
        following_btn.click()
    close_btn()

if __name__ == '__main__':
    login(browser)
```

Some Note : -

1. The download files will be in same directory with the name of the user. The download media files function has a automatic function which will prevent the duplication of the downloaded files.
2. Don't use the opened browser as it will hinder the working of the code.
3. If you find that the download is not working. There might be two reason :-
- Instagram might have changed the element position or element attribute

Your internet might be too slow
4. While downloading the media file. If the media file is video then it will take some more time depending on the internet speed.

</li>
</ol>

## Step 4 -> How to run and setup code ?

How to setup :-

1. First of all, install all the dependencies by `python3 install -r requirements.txt` in the cmd.
2. Then you need to install the selenium web driver in your system. You can follow this link [Youtube](https://www.youtube.com/watch?v=dz59GsdvUF8)
3. Now you need to change the username and password in the config.py folder or you can give it on later during the login.
4. There are three features that our project provide :-

Remove Following anyone
5. Remove Following that are not your follower
6. Download Media

</li>
<li>First you need to login to your download. Run the program in interactive shell. If you have already made changes in the config file. Then you can login by simple command:- `login()` or If you have not entered the credentials then you can login by:-

```
login(username="ENTER YOUR USERNAME", password="ENTER YOUR SECRET KEY")
```

</li>
<li>**(A). Remove follower**
Command:-

```
remove_following(remove=Enter the no of followers you want to unfollow)
```

Sample :-

```
remove_following(remove=6)
```

</li>
<li>**(B) : - Remove following that are not your follower.**
Basic syntax :-

```
remove_following_not_followers(count=Enter the number of followers to remove)
```

Sample code :-

```
remove_following_not_followers(count=5)
```

</li>
<li>**(C). Download Media** : - It can help you to download any media whether IGTV, Video Or Image.
Basic Syntax :- get_media(username=USERNAME, media_type=img or video, count=3)
Sample :-

```
get_media(username="therock", media_type=img, count=3)
or
get_media(count=3)
```

</li>
</ol>

## Deployment

You can easily deploy on [Heroku](https://www.heroku.com/)

You can read more about on [Medium Blog](https://romik-kelesh.medium.com/how-to-deploy-a-python-web-scraper-with-selenium-on-heroku-1459cb3ac76c)

## Web Preview / Output

[https://drive.google.com/file/d/1Op8PgiifKK3Mjus5lgdDpgWCndp0nFWS/preview](https://drive.google.com/file/d/1Op8PgiifKK3Mjus5lgdDpgWCndp0nFWS/preview)

*Web preview on deployment*
