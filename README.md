## :mailbox_with_no_mail: gmail-query-services
#### lib to facilitate integration with gmail

## Prerequisites
* Node.js
* A Google account with Gmail enabled


[Turn on the Gmail API](https://developers.google.com/gmail/api/quickstart/nodejs#step_1_turn_on_the)

In resulting dialog click **DOWNLOAD CLIENT CONFIGURATION** and save the file credentials.json to your app config directory. 

## Installation
```javascript
npm i gmail-query-services
```

## Importing
```javascript
const { message } = require('../src')
```

## Overview

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
