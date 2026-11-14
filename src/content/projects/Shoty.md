---
title: "Shoty - A new era of music"
slug: "Shoty"
description: "Music website based on the top on Django framework. It is a dynamic website with responsive behaviour. It has a login feature and CRUD (create,read,update and the delete) features."
date: 2019-10-02
author: "Praveen Chaudhary"
tags: ["html", "css", "js", "jquery", "django", "python", "webdevelopment"]
previewUrl: "https://drive.google.com/file/d/1gh09T8UOu3S6JHCmrlvg36oqsSvx-XrM/preview"
repoUrl: "https://github.com/chaudharypraveen98/RpaChallenge"
image: "https://media-exp1.licdn.com/dms/image/C5603AQHRamUaMrdA9g/profile-displayphoto-shrink_400_400/0/1597315489941?e=1629936000&v=beta&t=GjvQu_r0n3F2EtGkaRYSF6pH8vRdgx5lsD1-w8dc8gY"
headerImage: "/projects/assets/img/post-bg.webp"
---

<iframe src="https://drive.google.com/file/d/1gh09T8UOu3S6JHCmrlvg36oqsSvx-XrM/preview" width="640" height="480" allow="autoplay"></iframe>

**What We are going to do?**

1. Starting the Django Project
2. Creating a music app within the Shoty Project
3. Create a Album and Song model in music/models.py
4. Creating a view for handling the request made from the client
5. Creating a Template for displaying the song data on the page

### Understanding Some Important Concepts

**What is Django Framework?**

Django is a Python-based free and open-source web framework that follows the model–template–views architectural pattern.

**Top Features of Django Framework**

- Excellent Documentation
- SEO Optimised
- High Scalability
- Versatile in Nature
- Offers High Security
- Provides Rapid Development

## Step 1 => Starting the Django Project

Initialize a Django project by following command. **Python** must be installed on your system.

```
pip install Django
```

You can confirm the installation by checking the django version by following command

```
python -m django --version
```

**Starting the Project**

```
django-admin startproject shoty
```

You get the project structure like this

```
shoty/
manage.py
shoty/
    __init__.py
    settings.py
    urls.py
    asgi.py
    wsgi.py
```

## Step 2 -> Creating a music app within the Shoty Project

**What is a Django App?**

An app is a Web application that does something – e.g., a Weblog system, a database of public records or a small poll app.

A project is a collection of configuration and apps for a particular website. A project can contain multiple apps. An app can be in multiple projects.

Creating the music app

```
python manage.py startapp music
```

That’ll create a directory music, which is laid out like this:

```
music/
    __init__.py
    admin.py
    apps.py
    migrations/
        __init__.py
    models.py
    tests.py
    views.py
```

## Step 3 -> Create a Album and Song model in music/models.py

**What is a Django Model?**

A model is the single, definitive source of truth about your data. It contains the essential fields and behaviors of the data you’re storing. Django follows the DRY Principle.

The goal is to define your data model in one place and automatically derive things from it.

Let's create a Django Model.

A database contains a number of variable which are represented by fields in django model.Each field is represented by an instance of a Field class – e.g., CharField for character fields and DateTimeField for datetimes. This tells Django what type of data each field holds.

```python
from django.db import models
from django.urls import reverse
from django import forms
from myfirstproject import settings
from django.core.files.storage import FileSystemStorage

class Album(models.Model):
    artist = models.CharField(max_length=250)
    album_title = models.CharField(max_length=250)
    genre = models.CharField(max_length=250)
    album_logo = models.FileField()
    # will add other configuration later
    ......

class Song(models.Model):
    album = models.ForeignKey(Album, on_delete=models.CASCADE)
    file_type = models.CharField(max_length=10, default="mp3")
    song_title = models.CharField(max_length=250)
    song_logo = models.ImageField(default='2.jpg')
    song_link = models.FileField(upload_to='', default='see.mp3')
    is_favourite = models.BooleanField(default=False)

    def __str__(self):
        return (self.song_title)
```

Here, Two concepts are used

1. Primary Key
2. Foreign Key

A **primary key** is used to ensure data in the specific column is unique. A **foreign key** is a column or group of columns in a relational database table that provides a link between data in two tables.

**Making migrations**

Once the model is defined, the django will automatically take schemas and table according to the fields supplied in the django model.

```
python manage.py makemigrations
python manage.py migrate
```

## Creating a view for handling the request made from the client.

```python
class DetailView(generic.DetailView):
    model = Album
    template_name = "music/detail.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['song_list'] = Song.objects.filter(album=self.object)
        return context

class AlbumCreate(CreateView):
    model = Album
    fields = ['artist', 'album_title', 'genre', 'album_logo']

class AlbumUpdate(UpdateView):
    model = Album
    fields = ['artist', 'album_title', 'genre', 'album_logo']

class AlbumDelete(DeleteView):
    model = Album
    success_url = reverse_lazy('music:index')
```

## Web Preview / Output

<!-- ![web preview](https://raw.githubusercontent.com/chaudharypraveen98/RpaChallenge/master/result.JPG) -->
*Web preview on deployment*
