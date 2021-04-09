'use strict'

const {
    message
} = require('../src')

const chai = require('chai')
const expect = chai.expect

chai.config.includeStack = true

describe('Querys', async () => {

    let email = 'webjur@webjur.com.br'
    let subject = '(Arquivo Publicações)'

    it('should build query with from, subject and attachment', async () => {

        const query = await message().from(email).subject(subject).hasAttachment().inspect()

        expect(query).to.equal(`from:${email} subject:${subject} has:attachment`)

    })

    it('should return status 200', async function () {

        this.timeout(30000)

        const messages = await message().from(email).subject(subject).after('2021/04/07').before('2021/04/08').hasAttachment().exec()

        expect(messages.status).to.equal(200)

    })

    it('should delete the email and return status 200', async function () {

        this.timeout(30000)

        const setReadEmail = true
        const removeEmail = true

        const messages = await message().from(email).subject(subject).after('2021/04/07').before('2021/04/08').hasAttachment().exec(setReadEmail, removeEmail)

        expect(messages.status).to.equal(200)

    })

}, 30000)