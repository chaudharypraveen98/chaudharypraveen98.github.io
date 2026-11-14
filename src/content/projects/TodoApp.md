---
title: "TodoApp"
slug: "TodoApp"
description: "A basic todo app built on react native with the help of expo client. It uses the concept of components and useState in react."
date: 2021-01-30
author: "Praveen Chaudhary"
tags: ["react-native", "appdevelopment", "expo-client", "todoapp"]
previewUrl: "https://www.praveenchaudhary.in/TodoApp/"
repoUrl: "https://github.com/chaudharypraveen98/TodoApp"
image: "https://media-exp1.licdn.com/dms/image/C5603AQHRamUaMrdA9g/profile-displayphoto-shrink_400_400/0/1597315489941?e=1629936000&v=beta&t=GjvQu_r0n3F2EtGkaRYSF6pH8vRdgx5lsD1-w8dc8gY"
headerImage: "/projects/assets/img/post-bg.webp"
---

<iframe src="https://drive.google.com/file/d/1yYAOwB1qbShHGhZyHlQJMeaHhYjtaIfD/preview" width="640" height="480" allow="autoplay"></iframe>

**What We are going to do?**

1. Creating a basic structure.
2. Adding event handler/functions to add and delete task.
3. Adding Some stylings.

## Installation of React Native Project using Expo-client

Assuming that you have Node 12 LTS or greater installed, you can use npm to install the Expo CLI command line utility:

```
npm install -g expo-cli
```

Then run the following commands to create a new React Native project called "TodoApp":

```
expo init AwesomeProject

cd AwesomeProject
npm start # you can also use: expo start
```

## Components

Create a Component folder and add these components to it.

**Header (header.js)**

It will shows the navbar/header of the app.

```python
import React, { Component } from "react";
import {
    StyleSheet,
    Text,
    View,
} from "react-native";

export default class header extends Component {
    render() {
        return (
            <View style={styles.header}>
            <Text style={styles.headerText}>Todo List</Text>
            </View>
        );
    }
}
```

**Stylings used in Header Component**

```javascript
const styles = StyleSheet.create({
    header: {
    height: 80,
    backgroundColor: "#574b90",
    paddingTop:40,
    },
    headerText:{
    textAlign:'center',
    fontSize:24,
    color:'white'
    }
});
```

**Form Component (form.js)**

This component will take the input from the user and add the task in TODO list.

```python
import React, { Component } from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Button,
} from "react-native";

export default class form extends Component {
    constructor(props) {
    super(props);
    this.state = { todo: "" };
    }
    todoTextHandler = (val) => {
    this.setState({ todo: val });
    };
    render() {
        return (
            <View>
            <TextInput
                multiline
                placeholder="write a todo"
                style={styles.todoInput}
                onChangeText={this.todoTextHandler}
            />
            <View style={styles.btn}>
                **{
                    console.log("todo", this.state.todo);
                    this.props.todoHandler(this.state.todo);
                }}
                />
            </View>
            </View>
        );
    }
}
```

<b>Stylings used in Form Component**

```javascript
const styles = StyleSheet.create({
    todoInput: {
    borderColor: "#9e579d",
    backgroundColor:'#fc85ae',
    color:'#574b90',
    borderWidth: 3,
    height: 80,
    marginHorizontal: 20,
    marginTop: 10,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    },
    btn: {
    marginTop: 20,
    paddingHorizontal: 20,
    },
});
```

**TodoItem (todoItem.js)**

This component will show all the tasks in TODO list and provide a delete button to delete them.

```python
import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export default class todoItem extends Component {
    constructor(props) {
    super(props);
    }
    render() {
    return (
        <View style={styles.singleTodoContainer}>
        <MaterialIcons
            name="delete"
            size={25}
            onPress={() => this.props.todoRemoveHandler(this.props.item.key)}
        />
        <Text style={styles.todoText}>{this.props.item.text}</Text>
        </View>
    );
    }
}
```

**Stylings used in Todo Component**

```javascript
const styles = StyleSheet.create({
    todoText: {
    flex:1,
    color: "#cabbe9",
    fontSize: 18,
    flexWrap: "wrap",
    },
    singleTodoContainer: {
    backgroundColor: "#9e579d",
    borderRadius:25,
    flexDirection: "row",
    marginVertical: 10,
    paddingVertical: 10,
    textAlign: "center",    
    },
});
```

## Editing the main App Component (App.js)

**We will be adding event handlers to delete the tasks which are done**

**Importing required libraries**

```python
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  Button,
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Alert,
  Touchable,
  ImageBackground,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import Header from "./components/header";
import TodoItem from "./components/todoItem";
import Form from "./components/form";
```

**Adding dummy tasks**

```javascript
export default function App() {
  const [todo, setTodo] = useState([
    { text: "make readme.md", key: "1" },
    { text: "update readme.md", key: "2" },
    { text: "modify readme.md", key: "3" },
    { text: "delete readme.md", key: "4" },
  ]);
```

**Adding conditionals to validate that the length of task must be 3.**

```javascript
const todoHandler = (task) => {
    if (task.length > 3) {
      setTodo((prevTodo) => {
        return [{ text: task, key: Math.random().toString() }, ...prevTodo];
      });
    } else {
      Alert.alert("OOPS!", "Todo must be 3 chars long", [
        { text: "UNDERSTOOD", onPress: () => console.log("alert closed") },
      ]);
    }
  };
```

**Event Handlers for deleting Task**

```javascript
const todoRemoveHandler = (key) => {
    setTodo((prevTodo) => {
      return prevTodo.filter((todoitem) => todoitem.key != key);
    });
  };
```

**Aligning the all components**

```
return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      <View style={styles.container}>
        {/* header */}
        <Header />
        <ImageBackground source={require('./assets/backTodo.jpg')} style={styles.image}>
          {/* form */}
          <View>
            <Form todoHandler={todoHandler} />
          </View>

          {/* container */}
          <View style={styles.todoContainer}>
            <FlatList
              data={todo}
              keyExtractor={(item) => {
                return item.key;
              }}
              renderItem={({ item }) => (
                <TodoItem item={item} todoRemoveHandler={todoRemoveHandler} />
              )}
            />
          </View>
          
          {/* credits */}
          <View style={styles.introduction}>
            <Text style={styles.centerText}>
              This app is created by Praveen Chaudhary
            </Text>
          </View>
        </ImageBackground>
      </View>
    </TouchableWithoutFeedback>
  );
}
```

**Adding styles**

```javascript
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#303a52",
  },
  todoContainer: {
    paddingHorizontal: 20,
  },
  introduction: {
    position: "absolute",
    bottom: 0,
    textAlign: "center",
    left: 0,
    right: 0,
    paddingBottom: 10,
    backgroundColor: "#574b90",
    alignSelf: "stretch",
  },
  centerText: {
    textAlign: "center",
    fontSize: 16,
    color: "#fc85ae",
  },
  image: {
    flex: 1,
    resizeMode: "cover",
  },
  btn: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  singleTodoContainer: {
    flexDirection: "row",
  },
});
```

## All App Component together

```python
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  Button,
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Alert,
  Touchable,
  ImageBackground,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import Header from "./components/header";
import TodoItem from "./components/todoItem";
import Form from "./components/form";
export default function App() {
  const [todo, setTodo] = useState([
    { text: "make readme.md", key: "1" },
    { text: "update readme.md", key: "2" },
    { text: "modify readme.md", key: "3" },
    { text: "delete readme.md", key: "4" },
  ]);

  const todoHandler = (task) => {
    if (task.length > 3) {
      setTodo((prevTodo) => {
        return [{ text: task, key: Math.random().toString() }, ...prevTodo];
      });
    } else {
      Alert.alert("OOPS!", "Todo must be 3 chars long", [
        { text: "UNDERSTOOD", onPress: () => console.log("alert closed") },
      ]);
    }
  };

  const todoRemoveHandler = (key) => {
    setTodo((prevTodo) => {
      return prevTodo.filter((todoitem) => todoitem.key != key);
    });
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      <View style={styles.container}>
        {/* header */}
        <Header />
        <ImageBackground source={require('./assets/backTodo.jpg')} style={styles.image}>
          {/* form */}
          <View>
            <Form todoHandler={todoHandler} />
          </View>

          {/* container */}
          <View style={styles.todoContainer}>
            <FlatList
              data={todo}
              keyExtractor={(item) => {
                return item.key;
              }}
              renderItem={({ item }) => (
                <TodoItem item={item} todoRemoveHandler={todoRemoveHandler} />
              )}
            />
          </View>
          
          {/* credits */}
          <View style={styles.introduction}>
            <Text style={styles.centerText}>
              This app is created by Praveen Chaudhary
            </Text>
          </View>
        </ImageBackground>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#303a52",
  },
  todoContainer: {
    paddingHorizontal: 20,
  },
  introduction: {
    position: "absolute",
    bottom: 0,
    textAlign: "center",
    left: 0,
    right: 0,
    paddingBottom: 10,
    backgroundColor: "#574b90",
    alignSelf: "stretch",
  },
  centerText: {
    textAlign: "center",
    fontSize: 16,
    color: "#fc85ae",
  },
  image: {
    flex: 1,
    resizeMode: "cover",
  },
  btn: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  singleTodoContainer: {
    flexDirection: "row",
  },
});
```

## Deployment

For deployment, We are using the **Expo**.  [For More Info](https://expo.io/)

## Web Preview / Output

![TodoApp project screenshot](https://raw.githubusercontent.com/chaudharypraveen98/TodoApp/main/assets/ss.jpeg)

*Web preview on deployment*
