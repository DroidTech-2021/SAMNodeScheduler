/* eslint-disable no-console */
const firebase = require('firebase');
const moment = require('moment');

const config = {
  databaseURL: 'https://trackingpoc-dbcef-default-rtdb.firebaseio.com/',
};
firebase.initializeApp(config);

const database = firebase.database();

// get_list of logged In usersID
const Users = [
  '93',
  '109',
  '148',
  '108',
  '111_E Elza',
  '101_krishna employee',
  '112_Niranjan',
  '113_pooja',
  '7_krishna',
  '98_supervisor Gadgool',
];

// var tasks = []

// Users.forEach(user => {

// Users.forEach((user) => {
//   database
//     .ref()
//     .child('SAM_DB')
//     .child('LOCATIONS')
//     .child(user)
//     .orderByChild('created_at')
//     .limitToLast(1)
//     .once('value')
//     .then((users) => {
//       users.forEach((element) => {
//         const now = moment.utc();
//         const lastLogInTime = moment(element.val().created_at);

//         const duration = moment.duration(now.diff(lastLogInTime));
//         // const days = duration.asDays().toFixed(2);
//         // const hours = duration.asHours().toFixed(2);
//         const minutes = duration.asMinutes().toFixed(2);

//         // console.log(`${user} last updated at ${element.val().created_at}`);
//         console.log(`${user} last logged in ${minutes} minutes ago`);
//         console.log('\n');
//       });
//     });
// });

async function getClockedInUsersInfo(clockedInUsers) {
  const unresponsiveUsers = [];
  await clockedInUsers.forEach((user) => {
    database
      .ref()
      .child('SAM_DB')
      .child('LOCATIONS')
      .child(user)
      .orderByChild('created_at')
      .limitToLast(1)
      .once('value')
      .then((users) => {
        users.forEach((element) => {
          const now = moment.utc();
          const lastLogInTime = moment(element.val().created_at);

          const duration = moment.duration(now.diff(lastLogInTime));
          const minutes = duration.asMinutes().toFixed(2);

          console.log(`${user} last logged in ${minutes} minutes ago`);
          unresponsiveUsers.push(user);
          console.log('\n');
        });
      });
  });
  console.log(unresponsiveUsers);
}

async function test() {
  console.log('start');

  const items = await getClockedInUsersInfo(Users);

  console.log(items);
  console.log('end');
}

(async () => {
  await test();
})();
