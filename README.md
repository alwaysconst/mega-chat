# mega-chat

This is a simple chat server, which is enough to communicate with friends.

Before start you need **download** the chat:
```
git clone https://github.com/most-effect/mega-chat.git
```

Then go to the chat directory:
```
cd mega-chat
```

Then you need:<br>
1. initialize and start the server <br>
2. initialize and start the chat
###1. Initialize and start the server
```
cd server && npm i && npm start
```

Next time, to start the server, go into the server directory and just type a string:
`npm start`

###2. Initialize and start the chat
```
cd chat && npm install http-server -g && http-server -o
```
Next time, to open the chat, also go into the chat directory and type a string:
`http-server -o`

You can find more information about "http-server" [here.](https://www.npmjs.com/package/http-server)

***
This is one of the projects developed on JavaScript course from loftschool.com
