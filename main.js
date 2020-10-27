// Update this constant with your ServiceNow credentials
const options = {
  url: 'https://dev67265.service-now.com/',
  username: 'admin',
  password: 'J@rri1129',
  serviceNowTable: 'change_request'
};


// Import built-in Node.js package path.
const path = require('path');

var getCallback = function myCallbackFunction( data, error) {
    if (error) {
      console.error(`\nError returned from GET request\n${JSON.stringify(error)}`);
    }
    console.log(`\nResponse returned from GET request:\n${JSON.stringify(data)}`)
  }
var postCallback = function myCallbackFunction( data, error) {
    if (error) {
      console.error(`\nError returned from POST request\n${JSON.stringify(error)}`);
    }
    console.log(`\nResponse returned from POST request:\n${JSON.stringify(data)}`)
  }
/**
 * Import the ServiceNowConnector class from local Node.js module connector.js.
 *   and assign it to constant ServiceNowConnector.
 * When importing local modules, IAP requires an absolute file reference.
 * Built-in module path's join method constructs the absolute filename.
 */
const ServiceNowConnector = require(path.join(__dirname, './connector.js'));

/**
 * This is a [JSDoc comment]{@link http://usejsdoc.org/tags-description.html}.
 * See http://usejsdoc.org/tags-description.html.
 *
 * @callback iapCallback
 * @description A [callback function]{@link
 *   https://developer.mozilla.org/en-US/docs/Glossary/Callback_function}
 *   is a function passed into another function as an argument, which is
 *   then invoked inside the outer function to complete some kind of
 *   routine or action.
 *
 * @param {*} responseData - When no errors are caught, return data as a
 *   single argument to callback function.
 * @param {error} [errorMessage] - If an error is caught, return error
 *   message in optional second argument to callback function.
 */

/**
 * @function mainOnObject
 * @description Instantiates an object from the imported ServiceNowConnector class
 *   and tests the object's get and post methods.
 */
function mainOnObject() {
  // Instantiate an object from class ServiceNowConnector.
  const connector = new ServiceNowConnector(options);
  // Test the object's get and post methods.
  // You must write the arguments for get and post.
  connector.get(getCallback);
  connector.post(postCallback);
}

// Call mainOnObject to run it.
mainOnObject();