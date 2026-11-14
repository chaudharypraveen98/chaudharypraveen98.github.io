---
title: "SpotifyApi"
slug: "SpotifyApi"
description: "It is a class based client Api. It makes multiple get request with the spotify to search songs, album, artist and the tracks."
date: 2020-06-11
author: "Praveen Chaudhary"
tags: []
image: "https://miro.medium.com/max/875/1*ZMxBcjKeF6cHP6QJXx-rjg.jpeg"
headerImage: "/projects/assets/img/post-bg.webp"
---

**How the code works :-**

                        

**Libraries required**

                         

```python
import base64
import requests
import datetime
from urllib.parse import urlencode
```

                        

**Get your API credentials from Spotify developer account**

                            

```
client_id = ‘client id’
client_key = “enter the key”
```

                            

**Initialize the client**

                            

```
class SpotifyApi(object):
    access_token = None
    access_token_expires = datetime.datetime.now()
    access_token_did_expires = True
    client_id = None
    client_key = None
    token_url = ‘https://accounts.spotify.com/api/token'
```

                            
## Authentication

                            

```python
def __init__(self, client_id, client_key, *args, **kwargs):
    super().__init__(*args, **kwargs)
    self.client_id = client_id
    self.client_key = client_key

# Converting the credentials to base64 encoding

def get_token_header(self):
    cred_base64 = self.get_client_credentials()
    return {
    “Authorization”: f’Basic {cred_base64}’
    }

# Checking if credentials is supplied or not

def get_client_credentials(self):
    client_id = self.client_id
    client_key = self.client_key
    if client_key == None or client_key == None:
    raise Exception(“you must set the client credentials”)
    cred = f’{client_id}:{client_key}’
    cred_base64 = base64.b64encode(cred.encode())
    return cred_base64.decode()

# Getting token data

def get_token_data(self):
    return {
    “grant_type”: “client_credentials”
    }

# Performing authentication

def perform_auth(self):
    token_url = self.token_url
    token_data = self.get_token_data()
    token_header = self.get_token_header()
    r = requests.post(token_url, data=token_data, headers=token_header)
    if r.status_code not in range(200, 299):
    return False
    token_response_data = r.json()
    now = datetime.datetime.now()
    expires_in = token_response_data[‘expires_in’]
    expires = now + datetime.timedelta(seconds=expires_in)
    self.access_token_expires = expires
    self.access_token_did_expires = expires < now
    self.access_token = token_response_data[‘access_token’]
    return True

# Getting access token

def get_access_token(self):
    token = self.access_token
    expires = self.access_token_expires
    now = datetime.datetime.now()
    if expires < now:
    self.perform_auth()
    return self.get_access_token()
    elif token is None:
    self.perform_auth()
    return self.get_access_token()
    return token
```

                        

> Fun Fact - There are over 50 million tracks available to listen to on the app.

                        
## How to setup the API :-

                        

1. First install requirements.txt by :- 

```
python3 install -r requirements.txt
```
2. Enter the client id and secret key that you have to get from the Spotify developer account in the "spotify_api.py".
3. Make an object of the class to use methods.
                                Example:-
                                

```
spotify = SpotifyApi()
4. Then you have to perform authentication for getting the access token. An access token is used to make a get request. One need to understand that access token has an expiry time i.e. 3600 seconds for version 1 now. But your class automatically manages that work for you. It will regenerate the token if it expires. So you don’t need to worry about it at all. Running authentication is a one time process. For authentication simply run :-
spotify.perform_auth()
```

                        

**How to use the API:**

                        

1. Now you can start using the methods or get requests as shown below :-
spotify.search(query, operator=None, operator_query=None, search_type="type")
Where :-
                        query  = It can be anything, depending on the type of search. For search type like artist, it can be Neha Kakkar, Honey Singh, Raaftar etc.
                        search_type = spotify provides different type of searches like by artists, albums or tracks.
                        operator = Spotify provides two type of operators, i.e "OR" and "NOT". NOT operator means exclude it. OR operator means anyone of both.
                        operator_query = means anything you want to exclude or to make an option. Example :-

```
songs=spotify.search("Tony", operator="not" , operator_query="Kakkar", search_type="artist")
```

The above code will search for tony, but it will neglect the results which contains the Kakkar in their title.
2. You can even search for the track in the similar way for track. Example :-

```
spotify.search(Time, search_type="track")
```

                        </p>Output<p>
                        ![SpotifyApi project screenshot](https://miro.medium.com/max/875/1*ZMxBcjKeF6cHP6QJXx-rjg.jpeg)
                        Api response we get from the server
