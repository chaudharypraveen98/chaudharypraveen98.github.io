---
title: "PokeWorld"
slug: "PokeWorld"
description: "A React project which lists all the 898 Pokemon's with their capabilities. The data is loaded using the custom services which extract data from JSON."
date: 2021-01-22
author: "Praveen Chaudhary"
tags: ["ReactJS", "HTML", "CSS", "Web development"]
previewUrl: "https://www.praveenchaudhary.in/PokeWorld/#/"
repoUrl: "https://github.com/chaudharypraveen98/PokeWorld"
image: "https://media-exp1.licdn.com/dms/image/C5603AQHRamUaMrdA9g/profile-displayphoto-shrink_400_400/0/1597315489941?e=1629936000&v=beta&t=GjvQu_r0n3F2EtGkaRYSF6pH8vRdgx5lsD1-w8dc8gY"
headerImage: "/projects/assets/img/post-bg.webp"
---

**<iframe src="https://drive.google.com/file/d/1nh2NLGOIrWHJ0Ehnitfqe3d05Df_22z7/preview" width="640" height="480" allow="autoplay"></iframe>**

**What We are going to do?**

1. Fetch the data from the json
2. Displaying on the frontend using components with styling

## Fetching the data

**Create and write a service(PokemonServices.js) which extracts the pokemon object from the json.**

```python
import pokemon from './pokemon.json';

export default class PokemonServices{
    static getpokemons() {
        return pokemon ? pokemon : [];
    }
}
```

## Components

**Pokemons(Pokemons.js)**

It will contain how the whole webpage look like. It contains the header, footer and main body containing the PokemonApp(fetching the data on request)

```python
import React, { Component } from "react";
import PokemonServices from "../services/PokemonServices";
import PokemonList from "./PokemonList";

export default class Pokemons extends Component{
    constructor(props) {
        super(props);
        this.state={
            pokemons:[]
        };
    }

    componentDidMount() {
        this.setState(()=> ({pokemons:PokemonServices.getpokemons() }))
    }

    render() {
        return(
            

)
    }
}
```

<p>**PokemonApp(PokemonApp.js)**

This component is responsible of fetching the data on load and passing it as a prop to PokemonList Component

```python
import React, {Component} from "react";
import Header from './Header'
import Pokemons from "./Pokemons";

export default class PokemonApp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: "Welcome to Pokemon World"
        };
    }

    render() {
        return(
            
                <Header title={this.state.title}/>
                

        )
    }
}
```

<p>**PokemonList(PokemonList.js)**

The data fetched is unorgainsed, this component will orgainsed in a collection(list) of pokemon.

```python
import React, {useEffect, useState} from "react";
import PokemonCard from "./PokemonCard";
import PropTypes from 'prop-types';
const postsPerPage=6;
let arrayForHoldingPosts = [];

const getPokemons = (pokemons) => {
    return(
        
            {
                pokemons.map(pokemon => 

)
            }
        
    )
};

const PokemonList = (props) => {
    const [postsToShow, setPostsToShow] = useState([]);
    const [next, setNext] = useState(3);
    const posts = props.pokemons;

    const loopWithSlice = (start, end) => {
        const slicedPosts = posts.slice(start, end);
        arrayForHoldingPosts = [...arrayForHoldingPosts, ...slicedPosts];
        setPostsToShow(arrayForHoldingPosts);
    };

    useEffect(() => {
        loopWithSlice(0, postsPerPage);
    }, []);

    const handleShowMorePosts = () => {
        loopWithSlice(next, next + postsPerPage);
        setNext(next + postsPerPage);
    };
    return(
        
            
            {
                getPokemons(arrayForHoldingPosts)
            }
            
            
                <button onClick={handleShowMorePosts} className="load-btn" id="next-btn">↓</button>
            
        

    )
};

PokemonList.defaultProps={
    pokemon:[]
}

PokemonList.propTypes={
    pokemon:PropTypes.array
}

export default PokemonList;
```

<p>**PokemonCard(PokemonCard.js)**

It contains the basic styling and structure of the pokemon card.

```python
import React from "react";
import PropTypes from 'prop-types';
import '../styles/card.scss'

const PokemonCard = (props) => (
    
        

![]()

        
            
#### {props.pokemon.pokemon_id}

            
##### {props.pokemon.pokemon_name}

            

{props.pokemon.pokemon_tags}

            [url](#)
        
    
);

PokemonCard.prototype = {
    pokemon:PropTypes.object
};

PokemonCard.defaultProps={
    pokemon:{}
};

export default PokemonCard;
```

> Fun Fact - Rhydon is the first Pokemon ever to be created

**Add some stylings to make it look impressive.**

## Deployment

For deployment, We are using the **GitHub Pages**.  [For More Info](https://github.com/gitname/react-gh-pages)

## Web Preview / Output

![PokeWorld project screenshot](https://raw.githubusercontent.com/chaudharypraveen98/PokeWorld/master/WebPreview.JPG)

*Web preview on deployment*
