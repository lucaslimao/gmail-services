const fs = require('fs')

const { google } = require('googleapis')
const logger = require('../../utils')

const env = process.env

const TOKEN_PATH = env.TOKEN_PATH
const CREDENTIALS_PATH = env.CREDENTIALS_PATH

let TIMEOUT = env.TIMEOUT || 5000 
TIMEOUT = isNaN(env.TIMEOUT) ? Number(env.TIMEOUT) : env.TIMEOUT

let gmail = null

const logPrefix = 'EXEC'

const parts = async (messageId, payload) => {

    try {

        logger.info(`${logPrefix} :: has attachment`)
    
        const partPromise = payload.parts.map(
            async part => {

                if (part.body.size > 0 && part.filename !== '') {

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

const exec = async (query, hasAttachment, setRead, remove) => {

    try {

        logger.info(`${logPrefix} :: query :: ${query}`)

        const content = await fs.readFileSync(CREDENTIALS_PATH)
    
        const credentials = JSON.parse(content)
    
        const { client_secret, client_id, redirect_uris } = credentials.installed
    
        const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0])

        const token = await fs.readFileSync(TOKEN_PATH)

        oAuth2Client.setCredentials(JSON.parse(token))

        gmail = google.gmail({ version: 'v1', auth: oAuth2Client, timeout: TIMEOUT })

        const { data } = await gmail.users.messages.list({ userId: 'me', labelIds: 'INBOX', q: query })

        let messages = []
        let emailsToModify = []
        let emailsToDelete = []
        
        if (data.resultSizeEstimate > 0) messages = data.messages

        const messagePromise = messages.map(
            async message => {

                let payload = {}

                try {

                    logger.info(`${logPrefix} :: message :: ${message.id}`)

                    const { data } = await gmail.users.messages.get({ id: message.id, userId: 'me', format: 'FULL' })

                    payload = data.payload

                    payload = await parts(message.id, payload)

                    if (setRead) {
                        emailsToModify = [...emailsToModify, message.id]
                    }

                    if (remove) {
                        emailsToDelete = [...emailsToDelete, message.id]
                    }

                } catch (error) {
                    logger.error(error, `${logPrefix} :: Error when trying read the email`)
                }

                return { ...message, ...payload }

            }
        )

        messages = await Promise.all(messagePromise)

        if (setRead && emailsToModify.length > 0) {

            logger.info(`${logPrefix} :: mark as read`)
            const requestBody = { 
                ids: emailsToModify, 
                removeLabelIds: ['UNREAD'], 
                addLabelIds: [] 
            }

            await gmail.users.messages.batchModify({ auth: oAuth2Client, userId: 'me', requestBody })

        }

        if (remove && emailsToDelete.length > 0) {
            
            logger.info(`${logPrefix} :: delete email`)
            const requestBody = { 
                ids: emailsToDelete
            }

            await gmail.users.messages.batchDelete({ auth: oAuth2Client, userId: 'me', requestBody })

        }

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