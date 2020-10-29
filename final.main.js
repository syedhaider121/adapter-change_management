// Import built-in Node.js package path.
const path = require('path');

/**
 * Import the ServiceNowConnector class from local Node.js module connector.js
 *   and assign it to constant ServiceNowConnector.
 * When importing local modules, IAP requires an absolute file reference.
 * Built-in module path's join method constructs the absolute filename.
 */
const ServiceNowConnector = require(path.join(__dirname, '/connector.js'));

/**
 * Import built-in Node.js package events' EventEmitter class and
 * assign it to constant EventEmitter. We will create a child class
 * from this class.
 */
const EventEmitter = require('events').EventEmitter;

/**
 * The ServiceNowAdapter class.
 *
 * @summary ServiceNow Change Request Adapter
 * @description This class contains IAP adapter properties and methods that IAP
 *   brokers and products can execute. This class inherits the EventEmitter
 *   class.
 */
class ServiceNowAdapter extends EventEmitter {

  /**
   * Here we document the ServiceNowAdapter class' callback. It must follow IAP's
   *   data-first convention.
   * @callback ServiceNowAdapter~requestCallback
   * @param {(object|string)} responseData - The entire REST API response.
   * @param {error} [errorMessage] - An error thrown by REST API call.
   */
   
  /**
   * Here we document the adapter properties.
   * @typedef {object} ServiceNowAdapter~adapterProperties - Adapter
   *   instance's properties object.
   * @property {string} url - ServiceNow instance URL.
   * @property {object} auth - ServiceNow instance credentials.
   * @property {string} auth.username - Login username.
   * @property {string} auth.password - Login password.
   * @property {string} serviceNowTable - The change request table name.
   */

  /**
   * @memberof ServiceNowAdapter
   * @constructs
   *
   * @description Instantiates a new instance of the Itential ServiceNow Adapter.
   * @param {string} id - Adapter instance's ID.
   * @param {ServiceNowAdapter~adapterProperties} adapterProperties - Adapter instance's properties object.
   */
  constructor(id, adapterProperties) {
    // Call super or parent class' constructor.
    super();
    // Copy arguments' values to object properties.
    this.id = id;
    this.props = adapterProperties;
    // Instantiate an object from the connector.js module and assign it to an object property.
    this.connector = new ServiceNowConnector({
      url: this.props.url,
      username: this.props.auth.username,
      password: this.props.auth.password,
      serviceNowTable: this.props.serviceNowTable
    });
  }

  /**
   * @memberof ServiceNowAdapter
   * @method connect
   * @summary Connect to ServiceNow
   * @description Complete a single healthcheck and emit ONLINE or OFFLINE.
   *   IAP calls this method after instantiating an object from the class.
   *   There is no need for parameters because all connection details
   *   were passed to the object's constructor and assigned to object property this.props.
   */
  connect(callback) {
    // As a best practice, Itential recommends isolating the health check action
    // in its own method.

    this.healthcheck(callback);
  }

  /**
   * @memberof ServiceNowAdapter
   * @method healthcheck
   * @summary Check ServiceNow Health
   * @description Verifies external system is available and healthy.
   *   Calls method emitOnline if external system is available.
   *
   * @param {ServiceNowAdapter~requestCallback} [callback] - The optional callback
   *   that handles the response.
   */
  healthcheck(callback) {
    this.getRecord((result, error) => {
    /**
        * For this lab, complete the if else conditional
        * statements that check if an error exists
        * or the instance was hibernating. You must write
        * the blocks for each branch.
        */
    if (error) {
        /**
        * Write this block.
        * If an error was returned, we need to emit OFFLINE.
        * Log the returned error using IAP's global log object
        * at an error severity. In the log message, record
        * this.id so an administrator will know which ServiceNow
        * adapter instance wrote the log message in case more
        * than one instance is configured.
        * If an optional IAP callback function was passed to
        * healthcheck(), execute it passing the error seen as an argument
        * for the callback's errorMessage parameter.
        */
        this.emitOffline();
        log.error("ServiceNow: Instance has issue for Id: " + this.id + " with error: "+  error);
    } else {
        /**
        * Write this block.
        * If no runtime problems were detected, emit ONLINE.
        * Log an appropriate message using IAP's global log object
        * at a debug severity.
        * If an optional IAP callback function was passed to
        * healthcheck(), execute it passing this function's result
        * parameter as an argument for the callback function's
        * responseData parameter.
        */
        this.emitOnline();
        log.info("ServiceNow: Instance has no issues for Id: " + this.id + " with result: "+  JSON.stringify(result));
    }
    });
  }

  /**
   * @memberof ServiceNowAdapter
   * @method emitOffline
   * @summary Emit OFFLINE
   * @description Emits an OFFLINE event to IAP indicating the external
   *   system is not available.
   */
  emitOffline() {
    this.emitStatus('OFFLINE');
    log.warn('ServiceNow: Instance is unavailable.');
  }

  /**
   * @memberof ServiceNowAdapter
   * @method emitOnline
   * @summary Emit ONLINE
   * @description Emits an ONLINE event to IAP indicating external
   *   system is available.
   */
  emitOnline() {
    this.emitStatus('ONLINE');
    log.info('ServiceNow: Instance is available.');
  }

  /**
   * @memberof ServiceNowAdapter
   * @method emitStatus
   * @summary Emit an Event
   * @description Calls inherited emit method. IAP requires the event
   *   and an object identifying the adapter instance.
   *
   * @param {string} status - The event to emit.
   */
  emitStatus(status) {
    this.emit(status, { id: this.id });
  }

  /**
   * @memberof ServiceNowAdapter
   * @method getRecord
   * @summary Get ServiceNow Record
   * @description Retrieves a record from ServiceNow.
   *
   * @param {ServiceNowAdapter~requestCallback} callback - The callback that
   *   handles the response.
   */
  getRecord(callback) {
    /**
     * Write the body for this function.
     * The function is a wrapper for this.connector's get() method.
     * Note how the object was instantiated in the constructor().
     * get() takes a callback function.
     */

    this.connector.get((result, error) => {
     if (error) {
         if (callback){
             callback.errorMessage = error;
         }
        log.error("ServiceNow: For GET call, adaptor instance has issue for Id: " + this.id + " with error: "+  error);
    } else {
        if (result && result.body){
           var data= JSON.parse(result.body);
           let returnData = new Array();
           for (var i in data.result) {
            var rawData = data.result[i];
            var filteredResult = Object.keys(rawData).reduce((object, key) => {
                if (key == "number" ||key == "active" ||key == "priority" ||key == "description" ||key == "work_start"  ||key == "work_end"  ||key == "sys_id"  ) {
                    if (key == "number" ){
                        object['change_ticket_number'] = rawData[key]
                    }else if (key == "sys_id"){
                        object['change_ticket_key'] = rawData[key]
                    }else {
                        object[key] = rawData[key];
                    }
                }
                return object
                }, {});
                returnData[i] = filteredResult;
            }
            if (callback){
                callback.responseData = returnData;
            }
         }
        log.debug("ServiceNow: For GET call, adaptor instance has no issues for Id: " + this.id + " with result: "+  JSON.stringify(result));
    }
    });
  }

  /**
   * @memberof ServiceNowAdapter
   * @method postRecord
   * @summary Create ServiceNow Record
   * @description Creates a record in ServiceNow.
   *
   * @param {ServiceNowAdapter~requestCallback} callback - The callback that
   *   handles the response.
   */
  postRecord(callback) {
    /**
     * Write the body for this function.
     * The function is a wrapper for this.connector's post() method.
     * Note how the object was instantiated in the constructor().
     * post() takes a callback function.
     */
     this.connector.post((result, error) => {
     if (error) {
         if (callback){
             callback.errorMessage = error;
         }
        log.error("ServiceNow: For GET call, adaptor instance has issue for Id: " + this.id + " with error: "+  error);
     } else {
        if (result && result.body){
            var data= JSON.parse(result.body) ;
            var rawData = data.result;
            var returnData = Object.keys(rawData).reduce((object, key) => {
                if (key == "number" ||key == "active" ||key == "priority" ||key == "description" ||key == "work_start"  ||key == "work_end"  ||key == "sys_id"  ) {
                    if (key == "number" ){
                        object['change_ticket_number'] = rawData[key]
                    }else if (key == "sys_id"){
                        object['change_ticket_key'] = rawData[key]
                    }else {
                        object[key] = rawData[key];
                    }
                }
                return object
                }, {});
            if (callback){
                callback.responseData = returnData;
            }
         }
        log.debug("ServiceNow: For GET call, adaptor instance has no issues for Id: " + this.id + " with result: "+  JSON.stringify(result));
    }
    });
  }
}

module.exports = ServiceNowAdapter;