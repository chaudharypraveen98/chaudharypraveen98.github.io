---
title: "Quotes-Everywhere"
slug: "quotes-everywhere"
description: "A NextJS project that will show a collection of 60 quotes in initial release. It is bootstrapped with create-next-app."
date: 2021-02-26
author: "Praveen Chaudhary"
tags: ["nextjs", "api", "webdevelopment"]
previewUrl: "https://www.praveenchaudhary.in/quotes-everywhere/"
repoUrl: "https://github.com/chaudharypraveen98/quotes-everywhere"
image: "https://raw.githubusercontent.com/chaudharypraveen98/QuotesTutorial/master/quotes.JPG"
headerImage: "/projects/assets/img/post-bg.webp"
---

![Quotes Everywhere](https://raw.githubusercontent.com/chaudharypraveen98/quotes-everywhere/master/QuotesEverywhere.png)

**What We are going to do?**

1. Creating a basic components.
2. Building our own api endpoints
3. Making Page using the above Components using the API

**Before moving ahead, We must be aware of what actually NextJS is ?**

**Next.js** is an open-source development framework build on top of Node.js enabling React based web applications functionalities such as server-side rendering and generating static websites.

## Step 1 -> Creating a basic components.

A **Component** is one of the core building blocks of React.

**Quote Component**

It will take quote item as a prop and render the single quote

```python
import Link from "next/link";
import styles from "../styles/Quotes.module.css";

const QuotesItem = ({ quote }) => {
    return (
    <Link href={`/quotes/${quote.id}`}>
        
        
# {quote.id}

        <h4 className={styles.quote}>
            {quote.quote.substring(0, 30) + "....."}
        </h4>
        
##### {quote.author.split(",", 1)[0]}

        
    </Link>
    );
};

export default QuotesItem;
```

**QuoteList Component**

It will contains all the quotes(i.e Quote Component) by looping through the Quote Component.

```python
import styles from "../styles/Quotes.module.css";
import QuotesItem from './QuotesItem';

const QuotesList = ({ quotes }) => {
  return (
    
      {quotes.map((quote) => (
        <QuotesItem quote={quote} key={quote.id}/>
      ))}
    
  );
};

export default QuotesList
```

**Navbar Component**

It will contains the Header of the page with title and other options.

```python
import Link from "next/link";
import styles from '../styles/Navbar.module.css'

const Navbar = () => {
  return (
    <nav className={styles.navbarContainer}>
      

- QuotesEverywhere
- Home
- About

    </nav>
  )
}

export default Navbar
```

**Meta Component**

Meta Component contains all the meta tags for the SEO performance

```python
import Head from 'next/head'

const Meta = ({ title, keywords, description }) => {
  return (
    <Head>
      <meta name='viewport' content='width=device-width, initial-scale=1' />
      <meta name='keywords' content={keywords} />
      <meta name='description' content={description} />
      <meta charSet='utf-8' />
      <link rel='icon' href='/favicon.ico' />
      <title>{title}</title>
    </Head>
  )
}

Meta.defaultProps = {
  title: 'Quotes',
  keywords: 'quotes, daily motivation, life',
  description: 'Get the latest quotes on life. love , happiness and much more',
}

export default Meta
```

**Layout Component**

It will contain the basic layout of the structure

```python
import styles from "../styles/Home.module.css";
import Navbar from "../Components/Navbar";
import Meta from '../Components/Meta';

const Layout = ({ children }) => {
  return (
    <>
      <Meta/>
      <Navbar />
      
        <main className={styles.main}>{children}</main>
      
    </>
  );
};

export default Layout;
```

## Step 2 -> Making Api to fetch data and to server

We will load the data then server to the frontend. Create a api folder inside the Page folder , then a file. The name of file is serve as the route name by default.

```python
import {quotes} from '../../../quotes'

export default function handler(req,res) {
    res.status(200).json(quotes)
}
```

This endpoint will provide all the quotes.

For specific search we need to search by parameter. Create a file with parameter like <code>[id].js</code>

```python
import {quotes} from '../../../quotes';

export default function handler({query : {id}}, res) {
    const filteredQuote = quotes.filter(quote=>quote.id==parseInt(id));
    if (filteredQuote.length>0){
        res.status(200).json(filteredQuote[0])
    } else{
        res.status(404).json({message:`Quote not found with id ${id}`})
    }
    
}
```

**Hurray! Our API is live now**

## Step 3 -> Making Page using the above Components using the API

We will use the components and api which we had created above

**Build the home page.**

We will first fetch the data using our own api then render using the Components.

```python
import Head from "next/head";
import styles from "../styles/Home.module.css";

import content from "../quotes.content.json";
import QuotesList from "./../Components/QuotesList";
import { server } from './../config/index';

export default function Home({ quotes }) {
  return (
    <>
      
        <Head>
          <title>QuotesEverywhere</title>
          <meta name="keywords" content="quotes, daily quotes, motivation" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        
# QuotesEverywhere

        {/* using styled Components */}
        <style jsx>{`
          .main-title {
            color: #43dde6;
          }
        `}</style>
        <QuotesList quotes={quotes} />
      
    </>
  );
}
export const getStaticProps = async () => {
  const res = await fetch(`${server}/api/quotes`)
  const quotes = await res.json();
  return {
    props: {
      quotes,
    },
  };
};
```

**Single Quote page**

It will show the single quote page using the component

```python
import { useRouter } from "next/router";
import content from "../../../quotes.content.json";
import Link from "next/link";
import Image from "next/image";
import styles from '../../../styles/Quotes.module.css'
import { server } from './../../../config/index';
import { quotes } from './../../../quotes';

const quote = ({ filteredQuote }) => {
  return (
    
      <Image src="/1.jpg" width={480} height={320} />
      
# Quote no {filteredQuote.id + 1}

      
## {filteredQuote.quote}

      
### Author - {filteredQuote.author}

      <Link href="/" className={styles.button}>Go Back</Link>
    
  );
};

// we are using our own api endpoints. We can also use serverSideProps to load data at run time

// getStaticProps will fetch the particular quote data and fetch data at build time
export const getStaticProps = async (context) => {
  const quoteId = context.params.id;
  const res = await fetch(`${server}/api/quotes/${quoteId}`);
  const filteredQuote = await res.json();
  return {
    props: {
      filteredQuote,
    },
  };
};

// getStaticPaths will contains all the possible id for dynamic routing
export const getStaticPaths = async () => {
  const res = await fetch(`${server}/api/quotes`);
  const quotes = await res.json();
  const quotesID = quotes.map((quote) => quote.id);
  const quotesPaths = quotesID.map((id) => ({ params: { id: id.toString() } }));
  return {
    paths: quotesPaths,
    fallback: false,
  };
};

export default quote;
```

Here we are using the nextjs router for url configuration

## Deployment

For deployment, We are using the **Vercl**.  [For More Info](https://vercel.com/)

## Web Preview / Output

<iframe src="https://drive.google.com/file/d/1nJMhuVZ2e_Z-XBzeFNz6olszqCvQRhfW/preview" width="640" height="480" allow="autoplay"></iframe>
*Web preview on deployment*
