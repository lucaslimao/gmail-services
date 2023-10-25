
const logger = {
    info: (message) => {
        console.log(message)
    },
    error: (error, message) => {
        console.log(error)
    }
}

module.exports = logger