import getDbConnection from './util/db.js';

export async function handler(event, context) {
    const noteClient = await notePool.connect();
    for (const message of event.Records) {
        await noteClient.query(`
        INSERT INTO aux.sesbounces(data)VALUES($1);
        `, [message]);
        console.log(message);
    };
    return {};
}



// export function handler(event, context, callback) {
//     const notePool = getDbConnection('note');

//     let message = event.Records[0].Sns.Message;
//     // sometimes the message comes in as a string instead of a JSON object and needs to be converted
//     if (!isObject(message)) {
//         message = JSON.parse(event.Records[0].Sns.Message.replace(/\'/gi,''));
//     }
//     let messageType = message.notificationType;

//     let bounceType;
//     let emails;

//     if (messageType === "Bounce") {
//         bounceType = message.bounce.bounceType;
//         emails = message.bounce.bouncedRecipients;
//     } else {
//         bounceType = '';
//         if (messageType === 'Complaint') {
//             emails = message.complaint.complainedRecipients;
//         }
//     }

//     if (messageType === "Complaint" || (messageType === "Bounce" && bounceType === "Permanent")) {
//         // delete or disable

//         // loop through and get the bad email addreesses
//         emails.forEach(function (item) {
//             console.log(item)
//             // // TODO: Call the delete/disable endpoints for each application here and/or create a list of email addresses to send to the admin
//             // //console.log(item.emailAddress);
//             // let data = '{ "query": "mutation{ deleteUserPreference(email: \\"' + item.emailAddress + '\\" ) { deletedEmail error} } "}';
//             // //console.log(data)
//             // let options = {
//             //     hostname: 'notify-api.ashevillenc.gov',
//             //     port: 443,
//             //     path: '/graphql',
//             //     method: 'POST',
//             //     headers: {
//             //         'Content-Type': 'application/json'
//             //     }
//             // }

//             // let req = request(options, (res)    => {
//             //     console.log('statusCode:'  + res.statusCode)

//             //     res.on('data', (d) => {
//             //         process.stdout.write(d)
//             //     })
//             // })

//             // req.on('error', (error) => {
//             //     console.error(error)
//             // })

//             // req.write(data)
//             // req.end()
//             // //  curl -k -X POST -H "Content-Type: application/json" --data '{ "query": "mutation{ deleteUserPreference(email: " + item.emailAddress +" ) { deletedEmail error} }" }' https://dev-notify.ashevillenc.gov/graphql
//         });

//     }
//     callback(null, "Success");
// }

// Helper function to test if a variable is an object
// const isObject = function (a) {
//     return (!!a) && (a.constructor === Object);
// };