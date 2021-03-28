## :mailbox_with_no_mail: gmail-query-services
#### lib to facilitate integration with gmail

## Prerequisites
* Node.js
* A Google account with Gmail enabled


[Turn on the Gmail API](https://developers.google.com/gmail/api/quickstart/nodejs#step_1_turn_on_the)

In resulting dialog click **DOWNLOAD CLIENT CONFIGURATION** and save the file credentials.json to app config directory. 

## Installation
```javascript
npm i gmail-query-services
```

## Importing
```javascript
const { authorizer, message } = require('../src')
```

## Authorizer
In the first time, you need run the authorizer first, to generate the token file.
Run authorizer, get the uri that service return in console, put in you browser, get the code retunr by gmail.
Put de code in console, press enter.
Should apear a message, "Token stored to...".

That's all.

```javascript
const { authorizer } = require('../src')
authorizer.exec()
```

## Overview

### Response body
If successful, the response body contains data with the same structure on the gmail [documentation](https://developers.google.com/gmail/api/reference/rest/v1/users.messages#resource:-message).

But in the Part body, we add the attachment, if the part has a attachment.
The attachment structure is the same on the gmail [documentation](https://developers.google.com/gmail/api/reference/rest/v1/users.messages.attachments#resource:-messagepartbody)

### Query functions

##### from
```javascript
await message().from(email).exec()
```

##### subject
```javascript
await message().subject(subject).exec()
```

##### hasAttachment
```javascript
await message().from(email).hasAttachment().exec()
```

##### after
```javascript
await message().from(email).after(date).exec()
```

##### before
```javascript
await message().from(email).before(date).exec()
```
