const sendE = require('./sendE'); // Send em

const recipients = {
  'user@ashevillenc.gov':
  [
    {
      type: 'EMAIL',
      email: 'user@ashevillenc.gov',
      phone: null,
      name: '300 Batauga Street Subdivision',
      permit_num: '19-99999PZ',
    },
    {
      type: 'EMAIL',
      email: 'user@ashevillenc.gov',
      phone: null,
      name: '30 Watauga Street Subdivision',
      permit_num: '19-03813PZ',
    },
  ],
  'buser@ashevillenc.gov':
  [
    {
      type: 'EMAIL',
      email: 'buser@ashevillenc.gov',
      phone: null,
      name: '300 Batauga Street Subdivision',
      permit_num: '19-99999PZ',
    },
    {
      type: 'EMAIL',
      email: 'buser@ashevillenc.gov',
      phone: null,
      name: '30 Watauga Street Subdivision',
      permit_num: '19-03813PZ',
    },
  ],
  'cuser@ashevillenc.gov':
  [
    {
      type: 'EMAIL',
      email: 'cuser@ashevillenc.gov',
      phone: null,
      name: '300 Batauga Street Subdivision',
      permit_num: '19-99999PZ',
    },
    {
      type: 'EMAIL',
      email: 'cuser@ashevillenc.gov',
      phone: null,
      name: '30 Watauga Street Subdivision',
      permit_num: '19-03813PZ',
    },
  ],
  'duser@ashevillenc.gov':
  [
    {
      type: 'EMAIL',
      email: 'duser@ashevillenc.gov',
      phone: null,
      name: '300 Batauga Street Subdivision',
      permit_num: '19-99999PZ',
    },
    {
      type: 'EMAIL',
      email: 'duser@ashevillenc.gov',
      phone: null,
      name: '30 Watauga Street Subdivision',
      permit_num: '19-03813PZ',
    },
  ],
};

sendE(recipients);
