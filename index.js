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
  '101_krishna employee',
  '108_Ananth',
  '109_Krishna Supervisor',
  '111_E Elza',
  '112_Niranjan',
  '113_pooja',
  '7_krishna',
  '93_bhuvi',
  '98_supervisor Gadgool',
];

// var tasks = []

// Users.forEach(user => {

//     tasks.push(
//         database
//             .ref()
//             .child('SAM_DB')
//             .child('LOCATIONS')
//             .child(user)
//             .orderByChild('created_at')
//             .limitToLast(1)
//             .once('value')
//             .then(users=>{
//                 users.forEach(element => {
//                     const now = moment.utc()
//                     const lastLogInTime = moment(element.val().created_at);

//                     var duration = moment.duration(now.diff(lastLogInTime));
//                     var days = duration.asDays().toFixed(2);
//                     var hours = duration.asHours().toFixed(2);
//                     var minutes = duration.asMinutes().toFixed(2);

//                     // console.log(`${user} last updated at ${element.val().created_at}`);
//                     console.log(`${user} last logged in ${minutes} minutes ago`);
//                     console.log("\n")
//                 });
//             })
//     );

//     Promise.all(tasks).then(()=>{
//         console.log('Done!!!')
//     })

// });

Users.forEach((user) => {
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
        // const days = duration.asDays().toFixed(2);
        // const hours = duration.asHours().toFixed(2);
        const minutes = duration.asMinutes().toFixed(2);

        // console.log(`${user} last updated at ${element.val().created_at}`);
        console.log(`${user} last logged in ${minutes} minutes ago`);
        console.log('\n');
      });
    });
});
