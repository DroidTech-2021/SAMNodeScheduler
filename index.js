/* eslint-disable no-console */
const firebase = require('firebase');
const moment = require('moment');
const got = require('got');

const config = {
  databaseURL: 'https://trackingpoc-dbcef-default-rtdb.firebaseio.com/',
};
firebase.initializeApp(config);

const database = firebase.database();

const TIME_LIMIT_IN_MINUTES = 30;

// get_list of logged In usersID

// var tasks = []

const formattedUsers = {
  unresponsive: [],
  active: [],
};

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

    // eslint-disable-next-line camelcase
    const { created_at, address, ..._user } = user;

    if (minutes > TIME_LIMIT_IN_MINUTES) {
      formattedUsers.unresponsive.push(userId);
      return userId;
    }
    formattedUsers.active.push(_user);
    return user;
  }
  return null;
}

async function processUsers(users) {
  console.log('start');

  const promises = users.map(async (user) => getUsersWorkInfo(user));

  const test1 = await Promise.all(promises);
  console.log(test1);

  // todo: Call API to notify supervisor
  const { body, statusCode } = await got.post('http://localhost:5000/api/v1/zones/verifyUserLocations', {
    json: {
      activeUsers: formattedUsers.active,
      unresponsiveUsers: formattedUsers.unresponsive,
    },
    responseType: 'json',
  });
  console.info(body.data);
  console.info(statusCode);
  console.info(formattedUsers);
  console.log('end');
}

(async () => {
  console.time();
  const url = 'http://localhost:5000/api/v1/timesheet/active';
  const res = await got(url);
  const result = JSON.parse(res.body);

//  test
// const Users = [
//   '93',
//   '109',
//   '148',
//   // '108_Ananth',
//   // '111_E Elza',
//   // '101_krishna employee',
//   // '112_Niranjan',
//   // '113_pooja',
//   // '7_krishna',
//   // '98_supervisor Gadgool',
// ];

  // const result = Users;

  if (result.length) {
    await processUsers(result);

    // await processUsers(res.body);
    console.timeEnd();
  }
  process.exit(1);
})();
