
# MP3-Sharer
Convenient website for shraring mp3 files between a group of friends
<img src='https://raw.githubusercontent.com/anmrez/anmrez/main/mp3-sharer/preview.png'>


#
## Pre-launch Setup

### • Config
  1) Rename 'example-config.ts' to 'config.ts'
  2) Set your params at 'serverParams':

    - port – server port
    - address – address of your server. This is address which is sent to email address
    - maxSize – server limit ( in megabytes )
    - connectionsLogger – loggs connections into the console ( true/false )

  3) Set your params at 'SMTPClient'
  4) Set your params at 'users':

    - username – username ( unique user is present - 'Guest' for which authorization limit is 10 minutes )
    - image – profile image ( default: 'default.png' ). You can upload your custom image to:'client/static/profile'
    - email – address to which authorization link will be sent


### • Certificate

  1) Generate certificate ( For example using openSSH for Windows ):

    openssl req -x509 -newkey rsa:4096 -sha256 -days 3650 -nodes -keyout key.key -out cert.crt -extensions san -config

  2) Move 'cert.crt' and 'key.key' into the 'cert' forler 
