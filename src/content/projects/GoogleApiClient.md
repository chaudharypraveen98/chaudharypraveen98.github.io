---
title: "Google Api Client"
slug: "GoogleApiClient"
description: "A google API based client based on two API: GEO CODING AND PLACES API which can used installed in your google platform project."
date: 2020-06-15
author: "Praveen Chaudhary"
tags: ["googleapiclient", "geocoding", "placesapi", "programming", "scripting"]
repoUrl: "https://github.com/chaudharypraveen98/GoogleApiClient"
image: "https://media-exp1.licdn.com/dms/image/C5603AQHRamUaMrdA9g/profile-displayphoto-shrink_400_400/0/1597315489941?e=1629936000&v=beta&t=GjvQu_r0n3F2EtGkaRYSF6pH8vRdgx5lsD1-w8dc8gY"
headerImage: "/projects/assets/img/post-bg.webp"
---

**What We are going to do?**

                        

1. Installing required libraries and setting client
2. Getting longitude and latitude by  city or state name
3. Finding things/places around a location within some radius
4. Getting place details using the google place id

                        
## Step 1 -> Writing GoogleApiClient and exporting data (GoogleApiClient.py)

                        

### Writing GoogleApiClient

                        

**Installing required libraries**

                        

```
pip install requests
pip install requests
```

                        

**Importing libraries and setting API key**

                        

```python
import requests
from urllib.parse import urlencode

GOOGLE_API_KEY = "ENTER YOUR OWN API KEY"
```

                        

**Be sure to enter your key.**

                        

**Initiating the client**

                        

```
class GoogleMapsClient(object):
    lat = None
    lng = None
    data_type = "json"
    default_address = None
    api_key = None
```

                        

**setting default_address and key in client**

                        

```python
class GoogleMapsClient(object):
    lat = None
    lng = None
    data_type = "json"
    default_address = None
    api_key = None

    def __init__(self, api_key=None, default_address=None, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if api_key is None:
            raise Exception("Api key not found")
        self.api_key = api_key
        self.default_address = default_address
        if default_address is not None:
            self.get_url_and_log_lat()
        else:
            raise Exception("default address not set")
```

                        
## Step 2 -> Getting longitude and latitude by  city or state name.

                        

**What happening in the below code?**

                        

1. IF location is not given, it will set the location to default location
2. Else location is set to given input.
3. Once location is defined, we frame url with the help of default type i.e JSON
4. We pass the key and the location as query parameter.
5. Used the requests library to get request.
6. Then, extract the lat and long and return it.

                        

**Code**

                        

```python
def get_url_and_log_lat(self, location=None):
    loc_query = self.default_address
    if location is not None:
        loc_query = location
    base_url = f"https://maps.googleapis.com/maps/api/geocode/{self.data_type}"
    paramaters = {
        "address": loc_query,
        "key": self.api_key
    }
    url_params = urlencode(paramaters)
    endpoint = f"{base_url}?{url_params}"
    r = requests.get(endpoint)
    if r.status_code not in range(200, 299):
        return {}
    log_lat = {}
    try:
        log_lat = r.json()['results'][0]['geometry']['location']
        print(log_lat)
    except:
        pass
    self.lat = log_lat.get("lat")
    self.lng = log_lat.get("lng")
    return self.lat, self.lng
```

                        
## Step 3 -> Finding things/places around a location within some radius.

                        

**Oops, I am lost, what this code does?**

                        

1. IF location is not given, it will set the coordinates of previous location
2. Else location is set to given input.
3. Once location is defined, we frame url with the help of default type i.e JSON
4. We pass the key ,location, keyword and radius as query parameter.
5. Used the requests library to get request.
6. Then,return the response.

                        

**Now, Lets write code**

                        

```python
def search(self, keyword="Mexican Food", location="Faridabad", radius=1000):
    if location is not None:
        self.get_url_and_log_lat(location)
    endpoint = f"https://maps.googleapis.com/maps/api/place/nearbysearch/{self.data_type}"
    search_param = {
        "key": self.api_key,
        "location": f"{self.lat},{self.lng}",
        "radius": radius,
        "keyword": keyword,
    }
    search_param_encode = urlencode(search_param)
    place_url = f"{endpoint}?{search_param_encode}"
    r = requests.get(place_url)
    if r.status_code not in range(200, 299):
        return {}
    return r.json()
```

                        
                        
## Step 4 -> Getting place details using the google place id

                        

Wow! this time , I know the code. Let me start..

                        

1. If we have google place id, we can do the search
2. Default response is set to json in line 2
3. We pass the place id ,fields, and key as query parameter.
4. Used the requests library to get request.
5. Then,return the response.

                        

**It's time to change thinking into code**

                        

```python
def detail(self, place_id="ChIJqW9BqQe6j4AR0il4CC315_s", fields=["name", "rating", "formatted_phone_number"]):
    detail_base_url = "https://maps.googleapis.com/maps/api/place/details/json"
    detail_param = {
        "place_id": place_id,
        "fields": ",".join(fields),
        "key": self.api_key,
    }
    detail_param_encode = urlencode(detail_param)
    detail_url = f"{detail_base_url}?{detail_param_encode}"
    r = requests.get(detail_url)
    if r.status_code not in range(200, 299):
        return {}
    return r.json()
```

                        
                        

**Hurray! I made it finally.**

                        
                        
## Deployment

                        

For deployment,  We are using the **Repl** or **Heroku** to deploy our localhost to web.[For More Info](https://replit.com/)

                        
## Web Preview / Output

                        ![Google API Client project screenshot](https://raw.githubusercontent.com/chaudharypraveen98/GoogleApiClient/master/GOOGLE%20API%20CLIENT%20Frame.png)
                        Web preview on deployment
