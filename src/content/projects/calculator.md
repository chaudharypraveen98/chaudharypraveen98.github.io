---
title: "Calculator"
slug: "calculator"
description: "It is a calculator based on react JS with some custom  styling."
date: 2020-03-31
author: "Praveen Chaudhary"
tags: ["ReactJS", "HTML", "CSS", "Web development"]
previewUrl: "https://www.praveenchaudhary.in/calculator/"
repoUrl: "https://github.com/chaudharypraveen98/calculator"
image: "https://media-exp1.licdn.com/dms/image/C5603AQHRamUaMrdA9g/profile-displayphoto-shrink_400_400/0/1597315489941?e=1629936000&v=beta&t=GjvQu_r0n3F2EtGkaRYSF6pH8vRdgx5lsD1-w8dc8gY"
headerImage: "/projects/assets/img/post-bg.webp"
---

**What We are going to do?**

                        

1. Creating a react component
2. Adding keypads
3. Adding event listeners to respond on click
4. Functions to perform operations

                        
## Intialising the class

                        

**Extend a react component class.**

                        

```javascript
class Calculator extends React.Component{
    constructor(props){
        super(props);
        this.state={
            display:0,
            equation:'',
        };
    }
    ...
}
```

                        
## Basic structure of Front-end

                        

```html
render () {
    return (
                
                    Calculator
                
            
                {this.state.equation}
                {this.state.display}
            
            this.inputNo("1")} value="1">1
            this.inputNo("2")} value="2">2
            this.inputNo("3")} value="3">3
            this.inputNo("4")} value="4">4
            this.inputNo("5")} value="5">5
            this.inputNo("6")} value="6">6
            this.inputNo("7")} value="7">7
            this.inputNo("8")} value="8">8
            this.inputNo("9")} value="9">9
            this.inputNo("0")} value="0">0
            this.inputNo(".")} value=".">.
            this.operator("+")} value="+">+
            this.operator("-")} value="-">-
            this.operator("*")}  value="*">*
            this.operator("/")} value="/">/
            AC
            =
        
    );
    }
}
```

                        
                        
## Adding Function/Event Handlers

                        

**What happens when a person click a keyword?**

                        

A event is fired and it will do the arithmetic operation and update the page.

                        

```javascript
operator(value){
    let b = value;
    b=this.state.equation+b;
    this.setState({equation:b});
}
result=()=>{
    let b = eval(this.state.equation);
    this.setState({display:b,equation:''});
}
inputNo(value){
    let b = value ;
    this.setState({display:b});
    b=this.state.equation+b;
    this.setState({equation:b});
}
reset=()=>{
    this.setState({display:0,equation:''});
}
```

                        

> Fun Fact - Calculators were originally gear driven wheels, but now they use a chip

                        

**Add some stylings to make it look impressive.**

                        
## Deployment

                        

For deployment, We are using the **GitHub Pages**.  [For More Info](https://pages.github.com/)

                        
## Web Preview / Output

                        ![Calculator project screenshot](https://raw.githubusercontent.com/chaudharypraveen98/calculator/master/calculator.JPG)
                        Web preview on deployment
