const { exec } = require('../exec')

let _hasAttachment = false

const from = query => value => {

    if (value) {
        query = `${query} from:${value}`
    }

    return modules(query)

}

const subject = query => value => {

    if (value) {
        query = `${query} subject:${value}`
    }

    return modules(query)

}

const after = query => value => {

    if (value) {
        query = `${query} after:${value}`
    }

    return modules(query)

}

const before = query => value => {

    if (value) {
        query = `${query} before:${value}`
    }

    return modules(query)

}

const hasAttachment = query => () => {

    _hasAttachment = true
    query = `${query} has:attachment`

    return modules(query)

}

const modules = query => {

    if (!query) {
        query = ''
    }

    return {
        from: from(query),
        subject: subject(query),
        hasAttachment: hasAttachment(query),
        after: after(query),
        before: before(query),
        exec: async () => {
            query = query.trim()
            return await exec(query, _hasAttachment)
        },
        inspect: () => {
            query = query.trim()
            return query
        }
    }

}

module.exports = modules