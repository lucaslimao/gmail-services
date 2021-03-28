const fs = require('fs')
const readline = require('readline')
const { google } = require('googleapis')

const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly']

const TOKEN_PATH = 'config/token.json'

const exec = () => {

    fs.readFile('config/credentials.json', (err, content) => {

        if (err) return console.log('Error loading client secret file:', err)

        const credentials = JSON.parse(content)

        const { client_secret, client_id, redirect_uris } = credentials.installed

        const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0])

        fs.readFile(TOKEN_PATH, (err, token) => {
            if (err) return getNewToken(oAuth2Client)
            oAuth2Client.setCredentials(JSON.parse(token))
        }) 
        
    })   

}

const getNewToken = oAuth2Client => {

    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    })

    console.log('Authorize this app by visiting this url:', authUrl)

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    })

    rl.question('Enter the code from that page here: ', (code) => {

        rl.close()

        console.log(code)

        oAuth2Client.getToken(code, (err, token) => {

            if (err) return console.error('Error retrieving access token', err)

            oAuth2Client.setCredentials(token)
            
            fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                if (err) return console.error(err)
                console.log('Token stored to', TOKEN_PATH)
            })

        })

    })

}

module.exports = {
    exec
}