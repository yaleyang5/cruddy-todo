const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

// add the create method to the exports object. create takes two arguments: text and a callback
exports.create = (text, callback) => {
  // pass an id and a callback into getNextUniqueId();
  // err, id, callback
  counter.getNextUniqueId((err, id) => {
    if (err) {
      throw new Error('getNextUniqueId Callback Error: could not get nextId');
    } else {
      // return nextId
      let fileName = path.join(exports.dataDir, `${id}.txt`);
      fs.writeFile(fileName, text, (err) => {
        if (err) {
          throw new Error(`could not write to ${id}.txt`);
        } else {
          callback(null, { id, text });
        }
      });
    }
    // '/Users/aidan/Programming/HackReactor/Week 4/rfp2302-cruddy-todo/datastore/index.js'
  });

  // items[id] = text;
  // console.log(items);
  // define a variable (string) to store pathName to new file (use path.join(currentDirectory, id))

  // then write file with path name, text, and callback as arguments
  // invoke the callback with two arguments, null (because there is no error if this function was executed), and an object containing the id and text
};


// export the readAll method. It takes in a callback as its sole parameter.
exports.readAll = (callback) => {
  // use readdir to create an array of all file names and iterate over the array with map
  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      throw new Error('could not readdir');
    } else {
      // map over the files array
      callback(null, files.map((id) => {
        // return an object with id and text
        // call readFile method on each file
        id = id.substring(0, 5);
        return { id, text: id};
      }));
    }
  });

  //---------------
  // define a var 'data' and initialize it to array returned by invoking the map method on the items object
  // var data = _.map(items, (text, id) => {
  //   // each element in the array will be an object of the id and the text associated with it.
  //   return { id, text };
  // });
  // invoke the callback. there is no error, so null will be the first arg. Pass in the array of data as the second argument.
  // callback(null, data);
};

// the readOne method has two parameters: the id of the target text, and a callback
exports.readOne = (id, callback) => {
  // invoke readFile with the id as the endpoint
  fs.readFile(`${exports.dataDir}/${id}.txt`, (err, text) => {
    // setTimeout(() => {console.log(`${exports.dataDir}/${id}.txt`)}, 1000);
    if (err) {
      callback(err);
    } else {
      // invoke the callback passing in null and the fileData
      callback(null, {id, text: text.toString()});
    }
  });



  // initialize the variable 'text' to the text retrieved from the items object at the id provided
  // var text = items[id];
  // if the property at the id key is undefined, pass an error into the callback
  // if (!text) {
  // callback(new Error(`No item with id: ${id}`));
  // } else {
  // if the property exists, there is no error. Pass the id and text to the callback.
  // callback(null, { id, text });
  // }
};


// the update method has three parameters: the id and text of interest, and a callback
exports.update = (id, text, callback) => {
  // use readFile, if there's fileData, execute writeFile
  fs.readFile(`${exports.dataDir}/${id}.txt`, (err, fileData) => {
    if (err) {
      callback(err);
    } else {
      if (fileData !== undefined) {
        // use writeFile to change the contents of the file at the id endpoint
        fs.writeFile(`${exports.dataDir}/${id}.txt`, text, (err) => {
          if (err) {
            callback(err);
          } else {
            callback(null, text);
          }
        });
      }
    }
  });


  // initialize a variable 'items' to the property at the id specified in the items object
  // var item = items[id];
  // if the property is undefined, pass an error into the callback
  // if (!item) {
  // callback(new Error(`No item with id: ${id}`));
  // } else {
  // otherwise, update the value of the property to the text provided
  // items[id] = text;
  // invoke the callback with no error, and an object of the id and text provided
  // callback(null, { id, text });
  // }
};


// create a delete method on the export object. This method takes the target id and a callback as parameters.
exports.delete = (id, callback) => {
  // read file at id to make sure it exists
  fs.readFile(`${exports.dataDir}/${id}.txt`, (err, fileData) => {
    if (err) {
      callback(err);
    } else {
      // if it exists, use unlink to delete the file
      fs.unlink(`${exports.dataDir}/${id}.txt`, (err) => {
        if (err) {
          callback(err);
        } else {
          callback();
        }
      });
    }
  });


  // initialize the items variable to the value stored in the items object at the id provided
  // var item = items[id];
  // delete the provided property
  // delete items[id];
  // if (!item) {
  // report an error if item not found
  // callback(new Error(`No item with id: ${id}`));
  // } else {
  // execute the callback, but no arguments are provided
  // callback();
  // }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

// export the initialize method
exports.initialize = () => {
  // The fs.existsSync() method is used to synchronously check if a file already exists in the given path or not
  // if there isn't a file already in the given path, create a directory
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
