const pug = require('pug');
const path = require('path');
// PUG
const compiledFunction = pug.compileFile(path.join(__dirname, '/email.pug'));

// Render a set of data
console.log(compiledFunction({
  recipient:
        [ { type: 'EMAIL',
            email: 'jontwilson1@gmail.com',
            phone: null,
            name: '45 South French Broad Ave',
            permit_num: '19-01846PZ' },
            { type: 'EMAIL',
            email: 'jontwilson1@gmail.com',
            phone: null,
            name: 'Givens Estates Friendship Park',
            permit_num: '19-02031PZ' },
            { type: 'EMAIL',
            email: 'jontwilson1@gmail.com',
            phone: null,
            name: 'Local Buggy',
            permit_num: '19-01722PZ' },
            { type: 'EMAIL',
            email: 'jontwilson1@gmail.com',
            phone: null,
            name: 'Verde Vista Phase II',
            permit_num: '19-01854PZ' } ]


}));
