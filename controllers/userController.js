const bcrypt = require('bcrypt')
const sqlDAL = require('../data/sqlDAL');

const Result = require('../models/result').Result;
const STATUS_CODES = require('../models/statusCodes').STATUS_CODES;


exports.getAllUsers = async function() {
    let users = await sqlDAL.getAllUsers();
    return users;
}

/**
 * @returns an array of user models
 */
exports.getUsers = async function (role = 'user') {
    let results = await sqlDAL.getUsersByRole(role);
    return results;
}

/**
 * @param {*} username 
 * @param {*} email 
 * @param {*} password 
 * @returns a Result with status/message and the new user id as data
 */
exports.createUser = async function (username, email, password) {
    let hashedPassword = await bcrypt.hash(password, 10);

    let result = await sqlDAL.createUser(username, hashedPassword, email);

    return result;
}

/**
 * @param {*} username
 * @returns The result of the update with status/message for Admin
 */
    exports.lockUser = async function (username) {
        

    let user = await sqlDAL.getUserByUsername(username);
    // console.log(user);

    // If we couldn't find the user
    if (!user) {
        return new Result(STATUS_CODES.failure, message = 'User not found.');
    }
    let result = await sqlDAL.lockUser(username);
    return result;
}

/**
 * @param {*} userId 
 * @param {*} currentPassword 
 * @param {*} newPassword 
 * @param {*} confirmNewPassword 
 * @returns The result of the update with status/message
 */
exports.updateUserPassword = async function (userId, currentPassword, newPassword, confirmNewPassword) {
    // If new passwords don't match
    if (newPassword != confirmNewPassword) {
        return { status: 'Failure', message: 'Entered passwords do not match' }
    }

    let hashedNewPassword = await bcrypt.hash(newPassword, 10);

    let user = await sqlDAL.getUserById(userId);
    // console.log(user);

    // If we couldn't find the user
    if (!user) {
        return new Result(STATUS_CODES.failure, message = 'User not found.');
    }

    // Make sure the actual password matches the one the user gave us
    let passwordsMatch = await bcrypt.compare(currentPassword, user.password);
    if (!passwordsMatch) {
        return new Result(STATUS_CODES.failure, 'Current password is invalid');
    }

    return await sqlDAL.updateUserPassword(userId, hashedNewPassword);
}

/**
 * @param {*} username 
 * @param {*} password 
 * @param {*} account_locked
 * @returns The result of the login attempt
 */
exports.login = async function (username, password, account_locked) {
    // console.log(`Logging in with username ${username}`);

    // Get User by Username
    let user = await sqlDAL.getUserByUsername(username);

    if (!user) return new Result(STATUS_CODES.failure, 'Invalid Login.');

    let passwordsMatch = await bcrypt.compare(password, user.password); // does the given password match the user's hashed password?

    if (passwordsMatch) {
        // console.log('Successful login for ' + username);
        // console.log(user);
        if(user.account_locked === "enabled"){
            return new Result(STATUS_CODES.success, 'Valid Login.', user);  
        } else {
            return new Result(STATUS_CODES.failure, 'User disabled.');  
        }
        
    } else {
        return new Result(STATUS_CODES.failure, 'Invalid Login');
    }
}

/**
 * @param {*} userId 
 * @returns the matching user model or null
 */
exports.getUserById = function (userId) {
    return sqlDAL.getUserById(userId);
}

/**
 * @param {*} userId 
 * @returns deletes the user matching the userId
 */
exports.deleteUserById = function (userId) {
    return sqlDAL.deleteUserById(userId);
}

exports.disableAccount = function (userId, username){
    return sqlDAL.disableAccount(userId, username);
}

exports.enableAccount = function (userId, username){
    return sqlDAL.enableAccount(userId, username);
}

exports.demoteAccount = function (userId, username){
    return sqlDAL.demoteAccount(userId, username);
}

exports.promoteAccount = function (userId, username){
    return sqlDAL.promoteAccount(userId, username);
}