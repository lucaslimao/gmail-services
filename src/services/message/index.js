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

const hasAttachment = query => value => {

    _hasAttachment = true
    query = `${query} has:attachment`

    if (value) {
        query = `${query} filename:${value}`
    }

    return modules(query)

}

const read = query => (value = true) => {

    const readValue = value ? 'read' : 'unread'
    query = `${query} is:${readValue}`

    return modules(query)

}

const contains = query => value => {

    query = `${query} ${value}`
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
        read: read(query),
        contains: contains(query),
        exec: async (setRead = true, remove = false) => {

            query = query.trim()
            return await exec(query, _hasAttachment, setRead, remove)

        },
        inspect: () => {
            query = query.trim()
            return query
        }
    }

}

module.exports = modules