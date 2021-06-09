# Quote Formatter / Generator

This little project of mine is a Quote Formatter and Generator. It has as the name says capabilites for both generating and formatting provided quotes. It is simple to setup due to it consisting of an HTML and JS File only and the HTML Code is simply for the Canvas API to display the quote before the user can download it.

## Setup

Simply download or clone the source and if you downloaded both files in a batch - unzip them. If you didn't - make sure they're in the same folder! Then open the HTML File in your preferred browser and make sure that both JavaScript is enabled in the browser and you have internet connection, since the data is being pulled from 2 Quote APIs: [Storm Consultancy Quotes](http://quotes.stormconsultancy.co.uk) and [TypeFit Quotes](https://type.fit/api/quotes).

## Usage
### Generation
There are 2 ways of using this tool. One way is just generating quotes. For this you can click through the quotes (by clicking on top of them with the left mouse button) and save the ones you like by Right-Click > Save Image. Each time you reroll - both Quote and Theme are randomly generated. If you want to keep either one of those persistent, you have to cache it, by typing:  
```js
cacheQuote(); /* For Quote */  
cacheTheme(); /* For Theme */  
```  
Into the Browser Console! Once you've done that further clicking will only change the non-cached part! If you want to unfreeze something you can do so, by typing:  
```js
state.quote.cached = false;  /* For Quote */  
state.theme.cached = false;  /* For Theme */  
```  
In Future, there might be some simpler ways of achieving these actions such as keybindings.  

### Formatting
The second way of using this tool is to format an existing quote. For that you are required to use the WebConsole and stick to following format (it will be filled out with Dummie Information, which you'll have to replace):
```json
formatQuote({  
	"author": "Noone",  
	"quote": "Nothing",  
	"number": 1  
});  
```

This will diplay the Quote on the Canvas! In case you want to keep that Quote (once you click, it gets replaced by a random quote out of the internet) you want to freeze the quote as described above and then you can click to swap the themes til you arrived where you want to be!

### Input Data

The data you have to input are:  
- author => Quote Author  
- quote => The Quote Text  
- number => The Quote Number / ID  

The Author and Quote take any string of reasonable size for a quote, when overflowing (when you have way too many words - you'll notice when that happens) it will scale down until it's barely or not readable! Number takes a Natural Number (Integer > 0) indicating the Quote ID or the Number of Day this Quote was posted on, usually used in a QOTD Scenario where Quotes are numbered after Days.

## Credits

I did the whole Programming and `@tari#8244` and `@Krista#4475` helped with Design Questions and Decisions! This whole project was dedicated to the [Progammers Palace Server](http://www.programmerspalace.com) - Thanks for providing an awesome community to learn, teach and chill in!
