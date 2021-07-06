/* eslint-disable no-console */
const firebase = require('firebase');
const moment = require('moment');

const config = {
  databaseURL: 'https://trackingpoc-dbcef-default-rtdb.firebaseio.com/',
};
firebase.initializeApp(config);

const database = firebase.database();

const TIME_LIMIT_IN_MINUTES = 30;

// get_list of logged In usersID
const Users = [
  '93',
  '109',
  '148',
  // '108_Ananth',
  // '111_E Elza',
  // '101_krishna employee',
  // '112_Niranjan',
  // '113_pooja',
  // '7_krishna',
  // '98_supervisor Gadgool',
];

// var tasks = []

async function getUsersWorkInfo(userId) {
  const snapshot = await database
    .ref()
    .child('SAM_DB')
    .child('LOCATIONS')
    .child(userId)
    .orderByChild('created_at')
    .limitToLast(1)
    .once('value');
  // const users = await resp.toJson();
  const result = await snapshot.val();

  if (result) {
    // return first item of the object
    const user = result[Object.keys(result)[0]];

    const now = moment.utc();
    const lastLogInTime = moment(user.created_at);

    const duration = moment.duration(now.diff(lastLogInTime));
    const minutes = duration.asMinutes().toFixed(2);

    console.log(`${user.empId} last logged in ${minutes} minutes ago`);
    console.log('\n');

    if (minutes > TIME_LIMIT_IN_MINUTES) {
      return userId;
    }
  }
  return null;
}

async function test() {
  console.log('start');

  const promises = Users.map(async (user) => getUsersWorkInfo(user));

  const test1 = await Promise.all(promises);
  console.log(test1);

  console.log('end');
}

(async () => {
  console.time();
  await test();
  console.timeEnd();
  process.exit(1);
})();
