---
title: "Go Profile API"
slug: "GoProfileAPI"
description: "A Rest API built on the top of the Gorm and Fiber using Golang. It uses the json library for parsing the data from file and with the help of gorm it initialize the database."
date: 2021-04-14
author: "Praveen Chaudhary"
tags: ["go", "gorm", "fiber", "webdevelopment", "api"]
repoUrl: "https://github.com/chaudharypraveen98/GoProfileAPI"
image: "https://media-exp1.licdn.com/dms/image/C5603AQHRamUaMrdA9g/profile-displayphoto-shrink_400_400/0/1597315489941?e=1629936000&v=beta&t=GjvQu_r0n3F2EtGkaRYSF6pH8vRdgx5lsD1-w8dc8gY"
headerImage: "/projects/assets/img/post-bg.webp"
---

**What We are going to do?**

1. Creating a struct for projects
2. Fetching File from the JSON file
3. Managing Database
4. Making Api handlers
5. Creating API route
6. Running our App

### Understanding Some Important Concepts

**What is Fiber and Gorm?**

**Fiber**

Fiber is an Express inspired web framework built on top of Fasthttp, the fastest HTTP engine for Go. Designed to ease things up for fast development with zero memory allocation and performance in mind.

**Gorm**

The GORM is fantastic ORM library for Golang, aims to be developer friendly. It is an ORM library for dealing with relational databases. This gorm library is developed on the top of database/sql package.

**Top Features of Fiber Framework**

- Routing
- Middleware Support
- Low on memory footprint
- Highly performant

## Step 1 => Creating a struct for projects

We will create the struct for projects and their types.

```
package projects

import (
	"errors"
	"fmt"

	"github.com/chaudharypraveen98/GoProfileAPI/database"
	"github.com/gofiber/fiber/v2"
	"gorm.io/datatypes"
	"gorm.io/gorm"
)

type Projects struct {
	gorm.Model
	Projects datatypes.JSON `json:"projects" gorm:"foreignKey:ID"`
}

// all projects serializer
type SerialProject struct {
	Projects []SingleProject `json:"projects" gorm:"foreignKey:ID"`
}

type SingleProject struct {
	gorm.Model
	ID                  int32  `gorm:"primaryKey;autoIncrement:True;" json:"id"`
	Title               string `json:"title"`
	Desciption          string `json:"desc"`
	ProgrammingLanguage string `json:"programming_language"`
	Stars               int32  `gorm:"default:null" json:"stars"`
	Forks               int32  `gorm:"default:null" json:"forks"`
	LastUpdated         string `json:"last_updated"`
	Link                string `json:"link"`
}
.....
...
```

## Step 2 => Fetching File from the JSON file

We will fetch data from the json file

```go
func loadData() {
    ....

    // Open our jsonFile
    jsonFile, err := os.Open("data/projects.json")
    
    ....
}
```

## Step 3 => Managing Database

We will first create a database then save the data into it. We can perform Crud operation

**Initializing the database**

It will make a connection between the database and our program.

```go
func initDatabase() {
    var err error
    database.DBConn, err = gorm.Open(sqlite.Open("projects.db"), &gorm.Config{})
    if err != nil {
        panic("Failed to connect to database")
    }
    fmt.Println("Database successfully opened")
}
```

**Loading the data into the database**

It will first check the table. If, it exists then it will first drop it then recreate a new one.

```go
func loadData() {
    // initiate the database connection
    db := database.DBConn

    // Open our jsonFile
    jsonFile, err := os.Open("data/projects.json")

    // if we os.Open returns an error then handle while opening
    if err != nil {
        panic(err)
    }
    fmt.Println("Successfully Opened Projects.json")
    byteValue, _ := ioutil.ReadAll(jsonFile)
    var SerialProjectData projects.SerialProject
    json.Unmarshal(byteValue, &SerialProjectData)

    // delete tables if they exit already
    db.Migrator().DropTable(&projects.Projects{})
    db.Migrator().DropTable(&projects.SingleProject{})

    // create table using struct
    db.Migrator().CreateTable(&projects.Projects{})
    db.Migrator().CreateTable(&projects.SingleProject{})

    var allProjects projects.Projects
    json.Unmarshal(byteValue, &allProjects)

    // creating collections of all projects
    db.Create(&allProjects)

    // creating single project
    for _, project := range SerialProjectData.Projects {
        var singleProject projects.SingleProject
        singleProject.ID = project.ID
        singleProject.Title = project.Title
        singleProject.Desciption = project.Desciption
        singleProject.Forks = project.Forks
        singleProject.LastUpdated = project.LastUpdated
        singleProject.Link = project.Link
        singleProject.ProgrammingLanguage = project.ProgrammingLanguage
        db.Create(&singleProject)
    }
    defer jsonFile.Close()
}
```

## Step 4 => Making Api handlers

We will make the CRUD (Create Read Update and Delete) operation.

**Get all the Projects**

This function will provide all the projects on get request.

```go
func GetProjects(c *fiber.Ctx) error {
    db := database.DBConn
    var projects []Projects
    err := db.Find(&projects).Error
    if errors.Is(err, gorm.ErrRecordNotFound) {
        return c.SendStatus(404)
    }
    return c.JSON(projects)
}
```

**Get Single Prpject**

We can get a single project using the project id.

```go
func GetSingleProject(c *fiber.Ctx) error {
    db := database.DBConn
    id := c.Params("id")
    var SingleProject SingleProject
    err := db.First(&SingleProject, id).Error
    if errors.Is(err, gorm.ErrRecordNotFound) {
        return c.SendStatus(404)
    }
    return c.JSON(SingleProject)
}
```

**Create a Project**

This function will create a new project on Post request.

```go
// It will create a project with incremented id.
func CreateSingleProject(c *fiber.Ctx) error {
	db := database.DBConn
	inputData := SingleProject{}
	if err := c.BodyParser(&inputData); err != nil {
		fmt.Println("error = ", err)
		return c.SendStatus(500)
	}
	lastProject := SingleProject{}
	db.Last(&lastProject)
	inputData.ID = lastProject.ID + 1
	db.Create(&inputData)
	return c.SendStatus(201)
}
```

**Update a project**

It will update the previous project.

```go
func UpdateSingleProject(c *fiber.Ctx) error {
    db := database.DBConn
    id := c.Params("id")
    var SingleProject SingleProject
    db.First(&SingleProject, id)
    inputData := SingleProject
    if err := c.BodyParser(&inputData); err != nil {
        fmt.Println("error = ", err)
        return c.SendStatus(200)
    }
    fmt.Println("--------")
    fmt.Println(inputData)
    db.Save(inputData)
    return c.SendStatus(204)
}
```

**Delete a Project**

Delete a previous project with a given id

```go
func DeleteProject(c *fiber.Ctx) error {
    db := database.DBConn
    id := c.Params("id")
    var SingleProject SingleProject
    err := db.Delete(&SingleProject, id).Error
    if errors.Is(err, gorm.ErrRecordNotFound) {
        return c.SendStatus(404)
    }
    return c.SendStatus(202)
}
```

## Step 5 => Creating API route

We will make api routes which will call the respective function handlers.

```go
// router to handles url endpoints
func setRoutes(app *fiber.App) {
	app.Get("/api/v1/projects", projects.GetProjects)
	app.Get("/api/v1/projects/:id", projects.GetSingleProject)
	app.Post("/api/v1/projects/:id/update", projects.UpdateSingleProject)
	app.Post("/api/v1/projects/create", projects.CreateSingleProject)
	app.Post("/api/v1/projects/:id/delete", projects.DeleteProject)
}
```

## Running our App

First we need to install the required libraries.

```
go get -u gorm.io/gorm
go get -u gorm.io/driver/sqlite
go get github.com/gofiber/fiber/v2
```

**Declaring the Main function**

It will manage all the functions.

```go
func main() {
    app := fiber.New()
    initDatabase()
    loadData()
    database.DBConn.AutoMigrate(&projects.SingleProject{}, &projects.Projects{})
    fmt.Println("Database migrated successfully")
    fmt.Println("---------------------------")
    setRoutes(app)
    app.Listen(":3000")
}
```

**Running the project**

Now to run our server, open terminal and in our root directory run :

```
go run main.go
```

It will show something like this

```
┌──────────────────────────────────���────────────────┐ 
 │                    Fiber v2.7.1                   │ 
 │               http://127.0.0.1:3000               │ 
 │       (bound on host 0.0.0.0 and port 3000)       │ 
 │                                                   │ 
 │ Handlers ............. 7  Processes ........... 1 │ 
 │ Prefork ....... Disabled  PID .............. 6392 │ 
 └��──────────────────────────────�����──��───────────────┘
```

On startup , It will insert data from the file to the database

**API Endpoints : -**

1. Get /api/v1/projects --> Fetch all the projects
2. Get /api/v1/projects/:id --> Fetch a single project with id as a parameter
3. Post /api/v1/projects/:id/update --> Update the existing project with the help of id. Pass the body as a JSON.

Endpoint http://127.0.0.1:3000/api/v1/projects/1/update
4. JSON Body  {"title":"admin"}
5. Post /api/v1/projects/create

Endpoint http://127.0.0.1:3000/api/v1/projects/create
6. Example
7. ```
{

"title": "praveen",

"desc": "This project will shows the quotes. It has a collection of 60 quotes in initial release. It is bootstrapped with create-next-app.",

"programming_language": "JavaScript",

"stars": 0,

"forks": 0,

"last_updated": "21 hours ago",

"link": "https://github.com/chaudharypraveen98/quotes-everywhere"

}
```
8. Post /api/v1/projects/:id/delete
                                
                                    Endpoint http://127.0.0.1:3000/api/v1/projects/1/delete
9. It doesn't require json body

                        
## Web Preview / Output

                        ![GoProfileAPI project screenshot](https://raw.githubusercontent.com/chaudharypraveen98/GoProfileAPI/master/go-output-fiber.JPG)
                        Web preview on deployment
