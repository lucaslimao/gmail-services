const config = require('config')

const { google } = require('googleapis')
const logger = require('../../utils')

const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly']

const client_id = config.get('client_id')
const client_secret = config.get('client_secret')
const redirect_uri = config.get('redirect_uri')
const refresh_token = config.get('refresh_token')

let gmail = null

const logPrefix = 'EXEC'

const attachment = async (messageId, payload) => {

    try {

        logger.info(`${logPrefix} :: has attachment`)
    
        const partPromise = payload.parts.map(
            async part => {

                if (part.filename !== '') {

                    logger.info(`${logPrefix} :: ${part.filename}`)

                    const attachment = await gmail.users.messages.attachments.get({ messageId: messageId, userId: 'me', id: part.body.attachmentId })
                    part.body.attachment = attachment
                    
                }

            }

        )

        await Promise.all(partPromise)

        logger.info(`${logPrefix} :: has attachment :: success`)

        return payload

    } catch (error) {
        throw error
    }

}

const exec = async (query, hasAttachment) => {

    try {

        logger.info(`${logPrefix} :: query :: ${query}`)

        const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uri)

        const auth = {
            refresh_token: refresh_token
        }
        
        oAuth2Client.setCredentials(auth)

        gmail = google.gmail({ version: 'v1', auth: oAuth2Client })

        const { data } = await gmail.users.messages.list({ userId: 'me', labelIds: 'INBOX', q: query })

        let messages = []
        
        if (data.resultSizeEstimate > 0) messages = data.messages

        const messagePromise = messages.map(
            async message => {

                logger.info(`${logPrefix} :: message :: ${message.id}`)

                const { data } = await gmail.users.messages.get({ id: message.id, userId: 'me' })

                let payload = data.payload

                if (hasAttachment) {
                    payload = await attachment(message.id, payload)
                }

                return { ...message, ...payload }

            }
        )

        messages = await Promise.all(messagePromise)

        logger.info(`${logPrefix} :: query :: success`)

        return {
            status: 200,
            ...data,
            messages: messages
        }

    } catch (error) {

        logger.error(error, `${logPrefix} :: Error when trying to run query`)

        return { 
            status: 500,
            error: error
        }

    }
    
}

module.exports = {
    exec
}