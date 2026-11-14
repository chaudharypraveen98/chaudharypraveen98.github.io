---
title: "Parco"
slug: "Parco"
description: "A parking solution built on Django with the google APIs such as JavaScript map API ,distance and places API."
date: 2020-09-29
author: "Praveen Chaudhary"
tags: ["googleapi", "django", "python", "html", "css", "javascript", "jquery", "webdevelopment"]
previewUrl: "https://drive.google.com/file/d/1qldZHgiE9xDCtJZXJ7RcH5DsaE2xh1w2/preview"
repoUrl: "https://github.com/chaudharypraveen98/Parco"
image: "https://raw.githubusercontent.com/chaudharypraveen98/Parco/master/output.JPG"
headerImage: "/projects/assets/img/post-bg.webp"
---

<iframe width="560" height="315" src="https://www.youtube.com/embed/NqRwAwJOrfs" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>                        
                        

**What We are going to do?**

                        

1. Starting the Django Project
2. Creating a booking app within the smart_parking Project
3. Create a Album and Song model in booking/models.py
4. Importing booking data from json file using  Django Extensions
5. Writing GraphQL queries and schema
6. Creating a view for handling the request made from the client
7. Adding function handlers to routes
8. Creating a Template for displaying the song data on the page
9. Fetching data using ajax into templates

                        

### Understanding Some Important Concepts

                        

**What is Django Framework?**

                        

Django is a Python-based free and open-source web framework that follows the model–template–views architectural pattern.

                        

**Top Features of Django Framework**

                        

- Excellent Documentation
- SEO Optimized
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
django-admin startproject smart_parking
```

                        

You get the project structure like this

                        

```
smart_parking/
    manage.py
    smart_parking/
        __init__.py
        settings.py
        urls.py
        asgi.py
        wsgi.py
```

                        
## Step 2 -> Creating a booking app within the smart_parking Project

                        

**What is a Django App?**

                        

An app is a Web application that does something – e.g., a Weblog system, a database of public records or a small poll app.

 
                        

A project is a collection of configuration and apps for a particular website. A project can contain multiple apps. An app can be in multiple projects.

                        

Creating the booking app

                        

```
python manage.py startapp booking
```

                        

That’ll create a directory booking, which is laid out like this:

                        

```
booking/
    __init__.py
    admin.py
    apps.py
    migrations/
        __init__.py
    models.py
    tests.py
    views.py
```

                        

**Including your app and libraries in project**

                        

```
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # our main reusable components
    'booking.apps.BookingConfig',

    # for API
    'rest_framework'
]
```

                        

**Making migrations**

                        

Once the model is defined, the django will automatically take schemas and table according to the fields supplied in the django model.

                        

```
python manage.py makemigrations
python manage.py migrate
```

                        
## Step 3 -> Create a Booking and Slot model in booking/models.py

                        

**What is a Django Model?**

                        

A model is the single, definitive source of truth about your data. It contains the essential fields and behaviors of the data you’re storing. Django follows the DRY Principle.

 
                        

The goal is to define your data model in one place and automatically derive things from it.

                        

Let's create a Django Model.

                        

A database contains a number of variable which are represented by fields in django model.Each field is represented by an instance of a Field class – e.g., CharField for character fields and DateTimeField for datetimes. This tells Django what type of data each field holds.

                        

```python
from django.db import models

# Create your models here.
class Slot(models.Model):
    slot_id = models.CharField(primary_key=True, max_length=15)
    slot_title = models.CharField(max_length=40)
    slot_lag = models.FloatField()
    slot_long = models.FloatField()
    slot_charges = models.IntegerField()

    def __str__(self):
        return self.slot_id + str(self.slot_charges)

class Booking(models.Model):
    slot_no = models.ForeignKey(Slot, on_delete=models.CASCADE)
    booking_id = models.CharField(unique=True, null=True,max_length=15)
    cost = models.IntegerField()
    duration = models.IntegerField()
    start_timing = models.DateTimeField()
    end_timing = models.DateTimeField(blank=True,null=True)
    email = models.EmailField(blank=False)

    def __str__(self):
        return self.slot_no.slot_id + str(self.duration) + "hours"
```

                        

Here, We have used the one to many relationship between the booking and Slot as there can be many booking for Slot.

                        
                        

**Adding models to admin panel**

                        

Django provides built-in admin panel to manage the data into model

                        

```python
from django.contrib import admin

from .models import Slot, Booking

# Register your models here.

admin.site.register(Slot),
admin.site.register(Booking)
```

                        
## Step 4 -> Writing serializers for companies model data

                        
### What are Serializers?

                        

Serializers allow complex data such as querysets and model instances to be converted to native Python datatypes that can then be easily rendered into JSON, XML or other content types. Serializers also provide deserialization, allowing parsed data to be converted back into complex types, after first validating the incoming data.

                        

**We are using Model Serializer. But Why?**

                        

The <tt>ModelSerializer</tt> class provides a shortcut that lets you automatically create a <tt>Serializer</tt> class with fields that correspond to the Model fields.

                        

**The <tt>ModelSerializer</tt> class is the same as a regular <tt>Serializer</tt> class, except that**:

                        

- It will automatically generate a set of fields for you, based on the model.
- It will automatically generate validators for the serializer, such as unique_together validators.
- It includes simple default implementations of .create() and .update().

                        

```python
from django.contrib.admin import widgets
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.forms import ModelForm
from rest_framework import serializers, exceptions

from booking.models import Booking

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(validated_data['username'], validated_data['email'], validated_data['password'])

        return user

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        username = data.get("username", "")
        password = data.get("password", "")
        print("hey")

        if username and password:
            user = authenticate(username=username, password=password)
            if user:
                if user.is_active:
                    data["user"] = user
                else:
                    msg = "user is inactive"
                    raise exceptions.ValidationError(msg)
            else:
                msg = "Wrong credentials"
                raise exceptions.ValidationError(msg)
        else:
            msg = "Must provide username and password both"
            raise exceptions.ValidationError(msg)
        return data

class BookingForm(ModelForm):
    class Meta:
        model = Booking
        fields = "__all__"
        exclude =('end_timing',)
```

                        

Here we are using **ModelSerializer** for User model and BookingForm and **Default Serializer** for Login authentication

                        

**Default Serializer** has a built-in validate function for validating the data entered

                        
## Step 5 -> Building form to authenticate the user.

                        

```python
from django import forms

class LoginForm(forms.Form):
    username = forms.CharField(max_length=100)
    password = forms.CharField(widget=forms.PasswordInput)
```

                        
## Step 6 -> Creating a view for handling the request made from the client.

                        

**What is a Django View?**

                        

A view function, or view for short, is a Python function that takes a Web request and returns a Web response.

                        
                        

**Importing required models,functions and libraries**

                        

```python
from datetime import timedelta
from django.contrib.auth.models import User
from django.contrib import messages
from django.contrib.auth import authenticate, login
from django.core.mail import send_mail
from django.shortcuts import render, redirect
from django.views.generic import FormView
from rest_framework.response import Response
from rest_framework.views import APIView

from smart_parking.settings import EMAIL_HOST_USER
from .login import LoginForm
from .serializers import UserSerializer, LoginSerializer, BookingForm
```

**Contact Page handler**

```python
def contact(request):
    return render(request, "booking/contact.html")
```

**Creating Booking Form**

What's going here?

1. Once the user request the booking form via get request, then get function manages the request
2. After filling the details, the form is send to post function handler in the Form view

<tt>Get</tt> and <tt>Post</tt> are the built-in function of FormView class.

```python
class CreateBooking(FormView):
    template_name = "booking/dashboard.html"
    form_class = BookingForm

    def get(self, request):
        form = self.form_class(None)
        return render(request, self.template_name, {"form": form})

    def post(self, request, *args, **kwargs):
        form = self.form_class(request.POST)
        if form.is_valid():
            booking = form.save(self, commit=False)
            booking.booking_id = "PARK" + booking.start_timing.strftime("%d%b%Y%H%M")
            print(booking.booking_id)
            booking.end_timing = booking.start_timing + timedelta(hours=booking.duration)
            msg = f"Thank you for booking with us. Your booking id "
            send_mail(msg, EMAIL_HOST_USER, [booking.email], fail_silently=False)
            messages.success(request, 'Form submission successful')
            booking.save()
```

**Serving the homepage**

```python
def index(request):
    return render(request, "booking/index.html")
```

**Signup Handler**

Once the user filled the form and posted the data for registering, then the <tt>post</tt> function of the APIView is responsible for handling it.

```python
class SignUp(APIView):
    serializer_class = UserSerializer

    def post(self, request, *args, **kwargs):
        serializer = UserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        # return Response(({"user": UserSerializer(user, context=self.get_serializer_context()).data,}))
        return Response({"msg": "successfully created"})
```

**Login Handler**

It will manage the authentication of the user.

```python
class LoginView(FormView):
    form_class = LoginForm
    template_name = "booking/login.html"

    def get(self, request):
        form = self.form_class(None)
        return render(request, self.template_name, {"form": form})

    def post(self, request):
        form = self.form_class(request.POST)
        if form.is_valid():
            username = form.cleaned_data['username']
            password = form.cleaned_data['password']
            user = authenticate(username=username, password=password)
            us = user.username
            print("---------", us)
            if user is not None:
                login(request, user)
                return redirect('booking:create')
                # return render(request, 'booking/dashboard.html', {"user": user})
                # return HttpResponse(json.dumps(user), content_type="application/json")
                # return JsonResponse(us, safe=False)
        return render(request, self.template_name, {"form": form})
```

                        

We are using Django <tt>render</tt> in-built function.

                        

The <tt>render()</tt>  function takes the request object as its first argument, a template name as its second argument and a dictionary as its optional third argument. It returns an <tt>HttpResponse</tt> object of the given template rendered with the given context.

                        

                        
## Step 7 -> Adding function handlers to routes.(smart_parking/urls.py)

                        

Whenever user visit the user, a function is called in view which takes care of response.

                        

```python
from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", include("booking.urls")),
]
```

                        

**Adding sub path for booking app**

                        

It defines the particular path for booking app

                        

```python
from django.conf.urls import url
from django.urls import path

from . import views

app_name = "booking"

urlpatterns = [
    url(r'^login/$', views.LoginView.as_view(), name='login'),
    path("", views.index, name="index"),
    path("contact/", views.contact, name="contact"),
    path("create/", views.CreateBooking.as_view(), name="create"),
    path("api/login/", views.LoginApi.as_view(), name="api-login"),
    path("api/signup/", views.SignUp.as_view(), name="api-signup"),
]
```

                        
## Step 8 -> Managing the state of Slots.(smart_parking/booking/static/booking/js/firebase.js)

                        

We are using the Firebase database to store the status of the slots in the parking area.

                        

```javascript
var firebaseConfig = {
    apiKey: "",
    authDomain: "",
    databaseURL: ",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
    measurementId: ""
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    
    $(document).ready(function(){
    let database = firebase.database();
    let slot1;
    let slot2;
    let slot3;
    let slot4;
    
    database.ref().on("value", function(snap){
        slot1 = snap.val().slot1;
        slot2 = snap.val().slot2;
        slot3 = snap.val().slot3;
        slot4 = snap.val().slot4;
        console.log(slot1);
    
        {if(slot1 ==="free"){
        console.log("free");
        insertSlot("slot1");
        } else {
        console.log("occupied");
        removeSlot("slot1");
        }}
        {if(slot2 ==="free"){
        console.log("free");
        insertSlot("slot2");
        } else {
        console.log("occupied");
        removeSlot("slot2");
        }}
        {if(slot3 ==="free"){
        console.log("free");
        insertSlot("slot3");
        } else {
        console.log("occupied");
        removeSlot("slot3");
        }}
        {if(slot4 ==="free"){
        console.log("free");
        insertSlot("slot4");
        } else {
        console.log("occupied");
        removeSlot("slot4");
        }}
    });
    let insertSlot=function (param){
        console.log(param)
        $('#id-slot').append(
        $('<option>').prop({
            id: param,
            innerHTML: "slot1 activated",
            name: param,
        })
        );
    };
    let removeSlot=function (param){
        $(`#${param}`).remove()
    };
    });
```

                        
## Step 9 -> Creating a Template for displaying the song data on the page

                        

We are using the jinja templating engine for displaying the data.

                        

```html
{% extends "booking/base.html" %}
{% load static %}

{% block css %}
    <link rel="{% static "booking/css/jquery.datetimepicker.css" %}">
{% endblock %}

{% block body %}
    
        
            

User Dashboard

            
## Welcome {{ user }}

        
    
    
        <button id="btnAction"  class="btn btn-primary" onClick="locate()">Click to see slots</button>
    

    
        <form enctype="multipart/form-data" method="post" class="form-control">
            
                {% csrf_token %}
                {% include 'booking/bookingForm.html' %}
                
                    <label for="id-slot">Select Parking Slot</label>
                    <select id="id-slot" name="slot-id">
                    </select>
                
                
                    <button type="submit" class="btn btn-success" value="Submit">Submit</button>
                
            
        </form>
    

    <select id="end">
        <option value="28.445323,77.315779">Pristine Mall, sector 31</option>
        <option value="28.444657,77.319635">Community Center, Sector 31</option>
        <option value="28.448644,77.308221">Metro Parking</option>
    </select>
    

    <!-- add their the user dasbhboard and the above is user varibale -->

{% endblock %}
```

**Integrating the maps and routes in template using the google api**

```javascript
{% block script %}
    <script type="text/javascript">
        let map;
        let directionsService;
        let directionsDisplay;
        let currentLatitude;
        let currentLongitude;

        function initMap() {
            let mapLayer = document.getElementById("map");
            let directionsService = new google.maps.DirectionsService;
            let directionsDisplay = new google.maps.DirectionsRenderer;
            const centerCoordinates = new google.maps.LatLng( 28.449349, 77.315725);
            let defaultOptions = {center: centerCoordinates, zoom: 14};
            map = new google.maps.Map(mapLayer, defaultOptions);
            directionsDisplay.setMap(map);
            function calculateAndDisplayRoute(directionsService, directionsDisplay) {
                let element=document.getElementById('end').value.split(",");
                let lat=parseFloat(element[0]);
                let long=parseFloat(element[1]);
                directionsService.route({
                  origin: new google.maps.LatLng(currentLatitude, currentLongitude),
                  destination: new google.maps.LatLng(lat,long ),
                  travelMode: 'DRIVING'
                },
                    function(response, status) {
                        if (status === 'OK') {
                            directionsDisplay.setDirections(response);
                        } else {
                            window.alert('Directions request failed due to ' + status);
                        }
                    });
            }

            let onChangeHandler = function () {
                calculateAndDisplayRoute(directionsService, directionsDisplay);
            };
            document.getElementById('end').addEventListener('change', onChangeHandler);
        }

        function addMarker(coords) {
            let marker = new google.maps.Marker({
                position: coords,
                map: map,
            });
        }

        function personMarker(coords) {
            console.log("new person marker")
            let marker = new google.maps.Marker({
                position: coords,
                map: map,
                icon:"{% static "booking/images/pin.ico" %}",
            });
        }
        function locate(){
            document.getElementById("btnAction").disabled = true;
            document.getElementById("btnAction").innerHTML = "Processing...";
            if ("geolocation" in navigator){
                navigator.geolocation.getCurrentPosition(function(position){
                    //currentLatitude = position.coords.latitude;
                    //currentLongitude = position.coords.longitude;
                    currentLatitude= 28.449261;
                    currentLongitude= 77.315584;
                    addMarker({lat:  28.445323, lng: 77.315779});
                    addMarker({lat:  28.444657, lng: 77.319635});
                    addMarker({lat:  28.448644, lng: 77.308221});
                    personMarker({lat: currentLatitude, lng: currentLongitude});
                    document.getElementById("btnAction").style.display = 'none';
                });
            }
        }

    </script>
    <script src="https://www.gstatic.com/firebasejs/7.2.1/firebase-app.js"></script>
    <script src="https://www.gstatic.com/firebasejs/3.1.0/firebase-database.js"></script>
    <script src="{% static 'booking/js/firebase.js' %}"></script>
    <script src="{% static "booking/js/moment.js" %}"></script>
    <script src="{% static "booking/js/jquery.datetimepicker.js" %}"></script>
    <script type="text/javascript">
    $(function (){
        $("#id_start_timing").datetimepicker();
    });
    </script>
    {% comment %}
    <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyD9v4wGnOfvPj5hFvT9RFHr51RHh3VhzxE
        &callback=initMap" async defer>
    </script>
    {% endcomment %}

{% endblock %}
```

                        

**Add Some styles to make it attractive**

                        

                        
## Web Preview / Output

                        ![Parco project screenshot](https://raw.githubusercontent.com/chaudharypraveen98/Parco/master/output.JPG)
                        Web preview on deployment
