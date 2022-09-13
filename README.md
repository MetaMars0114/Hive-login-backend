This is the backend for the downvote control tool. 

# installing and running

> npm i 

Create a mysql database called "downvote_control_tool"

You'll find the sql script to create the database and the tables in the file `database.sql`

Then create a file called `.env` and place it at the root.

In in put data in this format :

```
DB_USERNAME=username
DB_PASSWORD=password
ENCRYPTION_PW=encryptionpassword
```

The encryption password should be 32 char long

then edit the file `config.js` in `/bin` and change the `account_username` field to the accounts you have chosen to hold the posting authorities.

You also need to go on https://hivesigner.com/, register the account and set these redirect URIs :

```
http://localhost:4002/auth/conf
https://yourdomain.com/auth/conf
```

Once that's done you should be ready to go, to run the backend just run 

> npm run start 

If you use pm2 you can do 

> pm2 start npm -- start

# This is part of a stack

This should be used along with the bot :

https://github.com/drov0/downvote-control-tool-bot

And the front end :

https://github.com/drov0/downvote-control-tools-front