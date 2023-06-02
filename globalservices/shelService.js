//var sys = require('sys')
//var exec = require('child_process').exec;
const { exec } = require("node:child_process");
const { stderr } = require("node:process");
const { getRestaurant } = require("./generateJsonFile");

//exec('command', function (error, stdout, stderr) {});

const shellService = async (restaurantId, token) => {
  let restaurant = await getRestaurant(restaurantId, token);
  //sshpass -pPASSWORD ssh -tt [username]@[host] 'echo PASSWORD | sudo -S -s /bin/bash -c "service snmpd stop; reboot"'
  let command = `sshpass -p wabimmo ssh pi@${restaurant?._ip} 'sudo /app/scripts/stop.sh'`;
  exec(command, (error, stdout, stderr) => {
    if (error !== null) {
      console.log(error);
    } else {
      console.log("stdout: " + stdout);
      console.log("stderr: " + stderr);
    }
  });

  //     exec('sh restart.sh'  player_ip,
  //   function (error, stdout, stderr) {
  //     if (error !== null) {
  //       console.log(error);
  //     } else {
  //     console.log('stdout: ' + stdout);
  //     console.log('stderr: ' + stderr);
  //     }
  // });
};
// const shellService = async(player) =>{
//     console.log("INSIDE")
//     shell.exec('sh /src/services/restart.sh player_ip');
// }

module.exports = {
  shellService,
};
