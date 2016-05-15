# mega-chat

Do not let these large letters at the top confuse you. They were hiding a modest chat server, which is enough to communicate with friends.

Before start using it you need **download** it:
```
git clone https://github.com/most-effect/mega-chat.git
```

Then, change directory:
```
cd mega-chat
```

Then, to start using it you need:
1. initialize and start the server <br>
2. initialize and start the chat
###1. Initialize and start the server
```
cd server && npm i && npm start
```

So the next time to start the server while in the server directory, just type:
`npm start`

###2. Initialize and start the chat
```
cd chat && npm install http-server -g && http-server -o
```
So the next time to start the chat while in the chat directory, just type:
`http-server -o`

You can find more information about "http-server" [here.](https://www.npmjs.com/package/http-server)

***
This is one of the projects developed on JavaScript course from loftschool.com
