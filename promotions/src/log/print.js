/**
 *
 * @param {Object} message [message to print in console]
 * @param {String} style [style to make circle around of message printed default value is "#" character]
 * @param {Number} repeat [number of times character is repeated,default value is 100]
 */
module.exports = (message, style = "#", repeat = 100) => {
  console.log(`\n\n\n${style.repeat(repeat)}`);
  console.log(message);
  console.log(`${style.repeat(repeat)}\n\n\n`);
};
