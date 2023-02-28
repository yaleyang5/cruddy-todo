const fs = require('fs');
const path = require('path');
const sprintf = require('sprintf-js').sprintf;

// var counter = 0;

// Private helper functions ////////////////////////////////////////////////////

// Zero padded numbers can only be represented as strings.
// If you don't know what a zero-padded number is, read the
// Wikipedia entry on Leading Zeros and check out some of code links:
// https://www.google.com/search?q=what+is+a+zero+padded+number%3F

// zeroPaddedNumber must add zeros to the front of the number passed in
const zeroPaddedNumber = (num) => {
  return sprintf('%05d', num);
};

// the readCounter function takes a callback as its sole parameter
const readCounter = (callback) => {
  // the fs.readFile() method is invoked. It takes two parameters: a filename, and a callback
  fs.readFile(exports.counterFile, (err, fileData) => {
    if (err) {
      // *** assume that this error only happens when there is no file in project ***
      callback(null, 0);
    } else {
      // executes the callback provided passing in null as the error, and the data from the file turned into type 'number'. I surmise the counter will be coerced into a string, so it must be returned to a number.
      return callback(null, Number(fileData));
    }
  });
};

// the writeCounter function takes in two arguments
const writeCounter = (count, callback) => {
  // intialize the counerString to the result of calling zeroPaddedNumber on the count provided
  var counterString = zeroPaddedNumber(count);
  // fs.writeFile is used to write the specified data to a file. It takes three parameters, the file path where the file should be written, the data to be written to the file, and the callback to be executed when the method is executed.
  fs.writeFile(exports.counterFile, counterString, (err) => {
    if (err) {
      // if there is an error, throw this string
      throw ('error writing counter');
    } else {
      // if there is no error, invoke the callback with the padded count
      return callback(null, counterString);
    }
  });
};

// Public API - Fix this function //////////////////////////////////////////////

/*
NOTES:
1) write the counter. The counter file would be 0;
2) read the counter. That would give us the latest counter used.
3) write the counter, but pass in the read counter plus 1
*/

// pass in callback
exports.getNextUniqueId = (callback) => {
  // use the readCounter method to return the current counter number. Save the evaluated result as a variable.
  // pass that variable incremented by 1 into the writeCounter method
  // link this to another callback later
  return readCounter((err, counterNum) => {
    // check for error
    if (err) {
      throw new Error('readCounter Callback Error: could not get counterNum');
    } else {
      // call writeCounter
      writeCounter(counterNum + 1, (err, counterString) => {
        // check for error
        if (err) {
          throw new Error('writeCounter Callback Error: could not get counterString');
        } else {
          // otherwise, callback with counterString
          return callback(null, counterString);
        }
      });
    }
  });
  // // return the value of the new counter variable
  // return counter;
  //------------------------
  // increment the counter variable that this function is closed over
  // counter = counter + 1;
  // return the counter value after it is passed into zeroPaddedNumber
  // return zeroPaddedNumber(counter);
};



// Configuration -- DO NOT MODIFY //////////////////////////////////////////////

//'/Users/aidan/Programming/HackReactor/Week 4/rfp2302-cruddy-todo/datastore/counter.txt'
exports.counterFile = path.join(__dirname, 'counter.txt');
