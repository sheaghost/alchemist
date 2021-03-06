### Overview
A single-file Discord self bot.

### Disclaimer
This is only for demonstration.

### Features
  + Fast.
  + Feature-rich.
  + Constantly developed.
  + Easy to understand embed system.

### Library
This was made with [Eris](https://abal.moe/Eris). I chose this library because it
has expendable mention caching, easily understood functions, as well as no hassle when used
on a self-bot. On top of all of that, it is well known for being up-to-date, rich
with resources and support, and updated constantly.

### Updates
To get new updates, join the [server](https://discord.gg/y5mSnWhGJr).

### Environment
Your **config** (at the top of the file) contains necessary variables for the code to run.
Please make sure to fill out the following fields:
  + token
  + prefix
  + color (embeds)
  + gmail user
  + gmail pass
  + numkey (api key)

For gmail-bombing, you'd need to allow "lesser secure websites" in your gmail, so nodemailer
can login and send the emails. The first time you try to use gmail-bomb, it should give
you to the option to do this.

### Download & Run
Make sure you have the following:
  + [Node](https://nodejs.org/)
  + [VSCode](https://code.visualstudio.com/)
	
When you have your file, direct your command prompt to the file for this self bot.
Upon doing that and having node and such, run **npm i --save** then the package for all of these:
  + @erupcja/selfbot-eris
  + moment
  + discord.js
  + ms
  + node-superfetch
  + nodemailer
  + js-base64

You can do multiple downloads by doing **npm i --save {package} {package}**, like this, 
**npm i --save moment node-superfetch**.
