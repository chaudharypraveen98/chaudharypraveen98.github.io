---
title: "Scraping Stackoverflow with Rust"
slug: "stackoverflow-scraping-with-rust"
description: "A scraper that will extract question, link and title from stackoverflow. This scraper is inspired from Kadekillary Scarper with updated libraries and some more features added."
date: 2021-06-11
author: "Praveen Chaudhary"
tags: ["rust", "reqwest", "selectrs", "scraping"]
previewUrl: "https://drive.google.com/file/d/1SjQ0U1JZF6nn74PgpHDnurwvjEGGl-VH/preview"
repoUrl: "https://github.com/chaudharypraveen98/stackoverflow-scraping-with-rust"
image: "https://media-exp1.licdn.com/dms/image/C5603AQHRamUaMrdA9g/profile-displayphoto-shrink_400_400/0/1597315489941?e=1629936000&v=beta&t=GjvQu_r0n3F2EtGkaRYSF6pH8vRdgx5lsD1-w8dc8gY"
headerImage: "/projects/assets/img/post-bg.webp"
---

![stackoverflow-scraping-with-rust](https://raw.githubusercontent.com/chaudharypraveen98/stackoverflow-scraping-with-rust/master/Rust%20Scraping.png)

**What We are going to do?**

1. Getting argument from the command line using Clap library
2. Make a request using the Reqwest library
3. Scraping using the Selectrs library

**Libraries required : -**

1. [Reqwest](https://crates.io/crates/reqwest) => An ergonomic, batteries-included HTTP Client for Rust.
2. [Select](https://crates.io/crates/select) => A Rust library to extract useful data from HTML documents, suitable for web scraping
3. [Clap](https://crates.io/crates/clap) => A simple-to-use, efficient, and full-featured library for parsing command line arguments and subcommands.
4. [Rand](https://crates.io/crates/rand) => Easy random value generation and usage via the Rng, SliceRandom and IteratorRandom traits

**Installing Libraries**

**Simple add the following libraries in Cargo.toml**

```
[dependencies]
reqwest = { version = "0.10", features = ["json"] }
tokio = { version = "0.2", features = ["full"] }
select = "0.6.0-alpha.1"
clap = "2.33.3"
rand = "0.8.4"
```

**Before moving ahead, We must be aware of Css selectors**

**What are selectors/locators?**

A **CSS Selector** is a combination of an element selector and a value which identifies the web element within a web page.

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

## Step 1 -> Getting argument from the command line using Clap library

We are using the Clap library to get the argument from the command line.

Thare are three cases

1. Only tag is provided => We will get only the posts from the input tag with default no of post i.e 16
2. Only count is supplies => We will get only input number of post from any random topic using the Rand library
3. Both count and tag => We will get input number of post of input tag

First we initialize the command line app names StackOverflow Scraper. Then mention all the three cases with there short and long name.

```javascript
fn main() {
    let matches = App::new("StackOverflow Scraper")
        .version("1.0")
        .author("Praveen Chaudhary <chaudharypraveen98@gmail.com>")
        .about("It will scrape questions from stackoverflow depending on the tag.")
        .arg(
            Arg::with_name("tag")
                .short("t")
                .long("tag")
                .takes_value(true)
                .help("takes tag and scrape according to this"),
        )
        .arg(
            Arg::with_name("count")
                .short("c")
                .long("count")
                .takes_value(true)
                .help("gives n count of posts"),
        )
        .get_matches();
        ....
        ....
```

Once we have mentioned all the cases. Now we need to extract the argument value using the match which help us to find a particular pattern

```javascript
fn main() {
                                .....
                                .....
                            
                                if matches.is_present("tag") && matches.is_present("count") {
                                    let url = format!(
                                        "https://stackoverflow.com/questions/tagged/{}?tab=Votes",
                                        matches.value_of("tag").unwrap()
                                    );
                                    let count: i32 = matches.value_of("count").unwrap().parse::<i32>().unwrap();
                                    stackoverflow_post(&url, count as usize);
                                } else if matches.is_present("tag") {
                                    let url = format!(
                                        "https://stackoverflow.com/questions/tagged/{}?tab=Votes",
                                        matches.value_of("tag").unwrap()
                                    );
                                    stackoverflow_post(&url, 16);
                                } else if matches.is_present("count") {
                                    let url = get_random_url();
                                    let count: i32 = matches.value_of("count").unwrap().parse::<i32>().unwrap();
                                    stackoverflow_post(&url, count as usize);
                                } else {        
                                    let url = get_random_url();        
                                    stackoverflow_post(&url, 16);
                                }
                            }
```

In the above code, we have used the <tt>stackoverflow_post</tt> function. We will learn about this in **Step 3**

## Step 2 -> Make a request using the Reqwest library

We will use the reqwest library to make a get request to the stackoverflow website customized with the input tag

```javascript
#[tokio::main]
async fn hacker_news(url: &str, count: usize) -> Result<(), reqwest::Error> {
    let resp = reqwest::get(url).await?;
    ....
```

## Step 3 -> Scraping using the Selectrs library

We will use the css selectors to get the question post from the stackoverflow

```javascript
#[tokio::main]
async fn hacker_news(url: &str, count: usize) -> Result<(), reqwest::Error> {
    ..... 
    ..... 

    let document = Document::from(&*resp.text().await?);

    for node in document.select(Class("mln24")).take(count) {
        let question = node.select(Class("excerpt")).next().unwrap().text();
        let title_element = node.select(Class("question-hyperlink")).next().unwrap();
        let title = title_element.text();
        let question_link = title_element.attr("href").unwrap();
        let votes = node.select(Class("vote-count-post")).next().unwrap().text();
        let views = node.select(Class("views")).next().unwrap().text();
        let striped_views = views.trim();
        let tags = node
            .select(Attr("class", "post-tag grid--cell"))
            .map(|tag| tag.text())
            .collect::<Vec<_>>();
        let answer = node
            .select(Or(
                Attr("class", "status answered-accepted").descendant(Name("strong")),
                Attr("class", "status answered").descendant(Name("strong")),
            ))
            .next()
            .unwrap()
            .text();
        println!("Question       => {}", question);
        println!("Question-link  => https://stackoverflow.com{}",question_link);
        println!("Question-title => {}", title);
        println!("Votes          => {}", votes);
        println!("Views          => {}", striped_views);
        println!("Tags           => {}", tags.join(" ,"));
        println!("Answers        => {}", answer);
        println!("-------------------------------------------------------------\n");
    }
    Ok(())
}
```

## Complete Code

```javascript
extern crate clap;
extern crate reqwest;
extern crate select;
extern crate tokio;

use clap::{App, Arg};
use rand::seq::SliceRandom;
use select::document::Document;
use select::predicate::{Attr, Class, Name, Or, Predicate};

fn main() {
    let matches = App::new("StackOverflow Scraper")
        .version("1.0")
        .author("Praveen Chaudhary <chaudharypraveen98@gmail.com>")
        .about("It will scrape questions from stackoverflow depending on the tag.")
        .arg(
            Arg::with_name("tag")
                .short("t")
                .long("tag")
                .takes_value(true)
                .help("takes tag and scrape according to this"),
        )
        .arg(
            Arg::with_name("count")
                .short("c")
                .long("count")
                .takes_value(true)
                .help("gives n count of posts"),
        )
        .get_matches();

    if matches.is_present("tag") && matches.is_present("count") {
        let url = format!(
            "https://stackoverflow.com/questions/tagged/{}?tab=Votes",
            matches.value_of("tag").unwrap()
        );
        let count: i32 = matches.value_of("count").unwrap().parse::<i32>().unwrap();
        hacker_news(&url, count as usize);
    } else if matches.is_present("tag") {
        let url = format!(
            "https://stackoverflow.com/questions/tagged/{}?tab=Votes",
            matches.value_of("tag").unwrap()
        );
        hacker_news(&url, 16);
    } else if matches.is_present("count") {
        let url = get_random_url();
        let count: i32 = matches.value_of("count").unwrap().parse::<i32>().unwrap();
        hacker_news(&url, count as usize);
    } else {        
        let url = get_random_url();        
        hacker_news(&url, 16);
    }
}

#[tokio::main]
async fn hacker_news(url: &str, count: usize) -> Result<(), reqwest::Error> {
    let resp = reqwest::get(url).await?;
    // println!("body = {:?}", resp.text().await?);
    // assert!(resp.status().is_success());
    let document = Document::from(&*resp.text().await?);

    for node in document.select(Class("mln24")).take(count) {
        let question = node.select(Class("excerpt")).next().unwrap().text();
        let title_element = node.select(Class("question-hyperlink")).next().unwrap();
        let title = title_element.text();
        let question_link = title_element.attr("href").unwrap();
        let votes = node.select(Class("vote-count-post")).next().unwrap().text();
        let views = node.select(Class("views")).next().unwrap().text();
        let striped_views = views.trim();
        let tags = node
            .select(Attr("class", "post-tag grid--cell"))
            .map(|tag| tag.text())
            .collect::<Vec<_>>();
        let answer = node
            .select(Or(
                Attr("class", "status answered-accepted").descendant(Name("strong")),
                Attr("class", "status answered").descendant(Name("strong")),
            ))
            .next()
            .unwrap()
            .text();
        println!("Question       => {}", question);
        println!("Question-link  => https://stackoverflow.com{}",question_link);
        println!("Question-title => {}", title);
        println!("Votes          => {}", votes);
        println!("Views          => {}", striped_views);
        println!("Tags           => {}", tags.join(" ,"));
        println!("Answers        => {}", answer);
        println!("-------------------------------------------------------------\n");
    }
    Ok(())
}

// Getting random tag
fn get_random_url() -> String {
    let default_tags = vec!["python", "rust", "c#", "android", "html", "javascript"];
    let random_tag = default_tags.choose(&mut rand::thread_rng()).unwrap();
    let url = format!(
        "https://stackoverflow.com/questions/tagged/{}?tab=Votes",
        random_tag
    );
    url.to_string()
}
```

## How to run our scraper?

1. Build the executable by cargo build
2. Run by ./target/debug/stackoverflow-scraping-with-rust -t <tag> -c <count>
< tag > is the topic from which you want to scrape < count > is the number of posts/threads to be scraped. Note the maximum limit is 16
Like this ./target/debug/stackoverflow-scraping-with-rust -t java -c 1

## Deployment

You can deploy on [Heroku](https://www.heroku.com/) with the help of [Circle CI](https://circleci.com/)

You can read more about on [CircleCI Blog](https://circleci.com/blog/rust-cd/)

## Web Preview / Output

[https://drive.google.com/file/d/1SjQ0U1JZF6nn74PgpHDnurwvjEGGl-VH/preview](https://drive.google.com/file/d/1SjQ0U1JZF6nn74PgpHDnurwvjEGGl-VH/preview)

*Web preview on deployment*
