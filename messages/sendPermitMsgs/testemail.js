

recipients = {
    'jontwilson@gmail.com': [
        {
            type: 'EMAIL',
            phone: null,
            name: 'BIALIK, BARRY',
            permit_num: '22-03872PZ',
            notification_type: 'Affordable, Major'
        },
        {
            type: 'EMAIL',
            phone: null,
            name: 'BLUE RIDGE ORTHODONTICS',
            permit_num: '22-03885PZ',
            notification_type: 'Minor'
        }
    ]
}

const pug = require('pug');
const path = require('path');

const compiledFunction = pug.compileFile(path.join(__dirname, '/email.pug'));



try {
    for  (const emailAddr of Object.keys(recipients)) {
        const recipient = {};
        recipient.listOfTopics = recipients[emailAddr];
        recipient.unsub_url = "http://yahoo.com"
        const htmlEmail = compiledFunction(recipient);
        console.log(htmlEmail)
    }

} catch (e) {
    console.log(e)
}

recipientdata = {
    listOfTopics: [
      {
        type: 'EMAIL',
        phone: null,
        name: 'BIALIK, BARRY',
        permit_num: '22-03872PZ',
        notification_type: 'Affordable'
      },
      {
        type: 'EMAIL',
        phone: null,
        name: 'BIALIK, BARRY',
        permit_num: '22-03872PZ',
        notification_type: 'Major'
      },
      {
        type: 'EMAIL',
        phone: null,
        name: 'BLUE RIDGE ORTHODONTICS',
        permit_num: '22-03885PZ',
        notification_type: 'Minor'
      }
    ],
    unsub_url: 'http://wax9.com'
  }