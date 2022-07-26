// sqlDAL is responsible to for all interactions with mysql for Membership
const User = require('../models/user').User;
const Result = require('../models/result').Result;
const STATUS_CODES = require('../models/statusCodes').STATUS_CODES;
const Question = require('../models/question').Question;

const mysql = require('mysql2/promise');
const sqlConfig = {
    host: 'localhost',
    user: 'kia',
    password: 'Pro@430',
    database: 'Time4Trivia',
    multipleStatements: true
};

/**
 * @returns and array of user models
 */
exports.getAllUsers = async function () {
    users = [];

    const con = await mysql.createConnection(sqlConfig);

    try {
        let sql = `select * from Users;`;

        const [userResults, ] = await con.query(sql);

        // console.log('getAllUsers: user results');
        // console.log(userResults);

        for(key in userResults){
            let u = userResults[key];

            let sql = `select UserId, Role from UserRoles ur join Roles r on ur.RoleId = r.RoleId where ur.UserId = ${u.UserId}`;
            // console.log(sql);
            const [roleResults, ] = await con.query(sql);

            // console.log('getAllUsers: role results');
            // console.log(roleResults);

            let roles = [];
            for(key in roleResults){
                let role = roleResults[key];
                roles.push(role.Role);
            }
            users.push(new User(u.UserId, u.Username, u.Email, u.Password, roles, u.account_locked));
        }
    } catch (err) {
        console.log(err);
    }finally{
        con.end();
    }

    return users;
}

/**
 * @returns and array of user models
 */
exports.getUsersByRole = async function (role) {
    users = [];

    const con = await mysql.createConnection(sqlConfig);

    try {
        let sql = `select * from Users u join UserRoles ur on u.UserId = ur.userId join Roles r on ur.RoleId = r.RoleId where r.Role = '${role}'`;

        const [userResults, ] = await con.query(sql);

        for(key in userResults){
            let u = userResults[key];

            let sql = `select UserId, Role from UserRoles ur join Roles r on ur.RoleId = r.RoleId where ur.UserId = ${u.UserId}`;
            // console.log(sql);
            const [roleResults, ] = await con.query(sql);

            let roles = [];
            for(key in roleResults){
                let role = roleResults[key];
                roles.push(role.Role);
            }
            users.push(new User(u.UserId, u.Username, u.Email, u.Password, roles, u.account_locked));
        }
    } catch (err) {
        console.log(err);
    }finally{
        con.end();
    }

    return users;
}

/**
 * @param {*} userId the userId of the user to find
 * @returns a User model or null if not found
 */
exports.getUserById = async function (userId) {
    let user = null;

    const con = await mysql.createConnection(sqlConfig);

    try {
        let sql = `select * from Users where UserId = ${userId}`;
        
        const [userResults, ] = await con.query(sql);

        for(key in userResults){
            let u = userResults[key];

            let sql = `select UserId, Role from UserRoles ur join Roles r on ur.RoleId = r.RoleId where ur.UserId = ${u.UserId}`;
            // console.log(sql);
            const [roleResults, ] = await con.query(sql);

            let roles = [];
            for(key in roleResults){
                let role = roleResults[key];
                roles.push(role.Role);
            }
            user = new User(u.UserId, u.Username, u.Email, u.Password, roles, u.account_locked);
        }
    } catch (err) {
        console.log(err);
    }finally{
        con.end();
    }

    return user;
}

exports.deleteUserById = async function (userId) {
    let result = new Result();

    const con = await mysql.createConnection(sqlConfig);

    try {
        let sql = `delete from UserRoles where UserId = ${userId}`;
        let result = await con.query(sql);

        sql = `delete from Users where UserId = ${userId}`;
        result = await con.query(sql);

        result.status = STATUS_CODES.success;
        result.message = `User ${userId} deleted!`;
    } catch (err) {
        console.log(err);
        result.status = STATUS_CODES.failure;
        result.message = err.message;
    }finally{
        con.end();
    }

    return result;
}

/**
 * @param {*} username the username of the user to find
 * @returns a User model or null if not found
 */
exports.getUserByUsername = async function (username) {
    let user = null;

    const con = await mysql.createConnection(sqlConfig);

    try {
        let sql = `select * from Users where Username = '${username}'`;
        
        const [userResults, ] = await con.query(sql);

        for(key in userResults){
            let u = userResults[key];

            let sql = `select UserId, Role from UserRoles ur join Roles r on ur.RoleId = r.RoleId where ur.UserId = ${u.UserId}`;
            const [roleResults, ] = await con.query(sql);

            let roles = [];
            for(key in roleResults){
                let role = roleResults[key];
                roles.push(role.Role);
            }
            user = new User(u.UserId, u.Username, u.Email, u.Password, roles, u.account_locked);
        }
    } catch (err) {
        console.log(err);
    }finally{
        con.end();
    }

    return user;
}

/**
 * @param {*} userId the userId of the user to find roles for
 * @returns an array of role names
 */
exports.getRolesByUserId = async function (userId) {
    results = [];

    const con = await mysql.createConnection(sqlConfig);

    try {
        let sql = `select UserId, Role from UserRoles ur join Roles r on ur.RoleId = r.RoleId where UserId = ${userId}`;

        const [results, ] = await con.query(sql);

        for(key in results){
            let role = results[key];
            results.push(role.Role);
        }
    } catch (err) {
        console.log(err);
    }finally{
        con.end();
    }

    return results;
}

/**
 * @param {*} username 
 * @param {*} hashedPassword 
 * @param {*} email 
 * @returns a result object with status/message
 */
exports.createUser = async function (username, hashedPassword, email) {
    let result = new Result();

    const con = await mysql.createConnection(sqlConfig);

    try {
        let sql = `insert into Users (Username, Email, Password) values ('${username}', '${email}', '${hashedPassword}')`;
        const userResult = await con.query(sql);

        let newUserId = userResult[0].insertId;

        sql = `insert into UserRoles (UserId, RoleId) values (${newUserId}, 1)`;
        await con.query(sql);

        result.status = STATUS_CODES.success;
        result.message = 'Account Created with User Id: ' + newUserId;
        result.data = newUserId;
        return result;
    } catch (err) {
        console.log(err);

        result.status = STATUS_CODES.failure;
        result.message = err.message;
        return result;
    }finally{
        con.end();
    }
}

/**
 * @param {*} userId 
 * @param {*} hashedPassword 
 * @returns a result object with status/message
 */
exports.updateUserPassword = async function (userId, hashedPassword) {
    let result = new Result();

    const con = await mysql.createConnection(sqlConfig);

    try {
        let sql = `update Users set password = '${hashedPassword}' where UserId = '${userId}'`;
        const userResult = await con.query(sql);

        result.status = STATUS_CODES.success;
        result.message = 'Account updated';
        return result;
    } catch (err) {
        console.log(err);

        result.status = STATUS_CODES.failure;
        result.message = err.message;
        return result;
    }
}

/**
 * @param {*} username
 * @returns a result object with status/message
 */
exports.lockUser = async function (username) {
    let result = new Result();

    const con = await mysql.createConnection(sqlConfig);

    try {
        let sql = `update Users set account_locked = 'disabled' where username = '${username}'`;
        const userResult = await con.query(sql);

        result.status = STATUS_CODES.success;
        result.message = 'Account updated';
        return result;
    } catch (err) {
        console.log(err);

        result.status = STATUS_CODES.failure;
        result.message = err.message;
        return result;
    }
}

exports.getAllQuestions = async function () {
    questions = [];
    const con = await mysql.createConnection(sqlConfig);

    try{
        let sql = `select * from Questions;`;
        const [questionResults, ] = await con.query(sql);

        for(key in questionResults){
            let q = questions[key];
            let sql = `select Question, CorrectAnswer, IncorrectAnswer0, IncorrectAnswer1, IncorrectAnswer2, ApprovalStatus from Questions;`;
            const [questionResults, ] = await con.query(sql);

            questions.push(new Question(q.Question, q.CorrectAnswer, q.IncorrectAnswer0, q.IncorrectAnswer1, q.IncorrectAnswer2, q.ApprovalStatus))
        }
    } catch (err){
        console.log(err);
    }finally {
        con.end();
    }
    return questions;
}

exports.getApprovedQuestions = async function () {
    questions = [];
    const con = await mysql.createConnection(sqlConfig);

    try{
        let sql = `select * from Questions where ApprovalStatus = 1;`;
        const [questionResults, ] = await con.query(sql);
        for(key in questionResults){
            let q = questionResults[key];
            questions.push(new Question(q.Question, q.CorrectAnswer, q.IncorrectAnswer0, q.IncorrectAnswer1, q.IncorrectAnswer2))
        } 
    } catch (err){
        console.log(err);
    }finally {
        con.end();
    }
    return questions;
}

exports.addQuestion = async function (question, correctAnswer, incorrectAnswer0, incorrectAnswer1, incorrectAnswer2) {
    // Todo Finish
    let result = new Result();
    const con = await mysql.createConnection(sqlConfig);
    
    try{
        let sql = `Insert into Questions (Question, CorrectAnswer, IncorrectAnswer0, IncorrectAnswer1, IncorrectAnswer2, ApprovalStatus) values ('${question}', '${correctAnswer}', '${incorrectAnswer0}', '${incorrectAnswer1}', '${incorrectAnswer2}', 0)`
        await con.query(sql);
        result.status = STATUS_CODES.success;
        result.message = 'Question added.';
        result.data = '';
    }catch (err){
        console.log(err);

        result.status = STATUS_CODES.failure;
        result.message = err.message;
    }finally{
        con.end();
    }
    return result;
}

exports.disableAccount = async function (userId, username){
    let result = new Result();

    const con = await mysql.createConnection(sqlConfig);

    try{
        let sql = `update Users set account_locked = 'disabled' where UserId = '${userId}`;
        const userResult = await con.query(sql);
        result.message = `${username} has been disabled.`;
        return result;
        
    }catch(err){
        console.log(err);
        result.status = STATUS_CODES.failure;
        result.message = err.message;
    }finally{
        con.end();
    }
}

exports.enableAccount = async function (userId, username){
    let result = new Result();

    const con = await mysql.createConnection(sqlConfig);

    try{
        let sql = `update Users set account_locked = 'enabled' where UserId = '${userId}`;
        const userResult = await con.query(sql);
        result.message = `${username} has been enabled.`;
        return result;
        
    }catch(err){
        console.log(err);
        result.status = STATUS_CODES.failure;
        result.message = err.message;
    }finally{
        con.end();
    }
}

exports.demoteAccount = async function (userId){
    let result = new Result();

    const con = await mysql.createConnection(sqlConfig);

    try{
        let sql = `update UserRoles set  = 1 where UserId = '${userId}`;
        const userResult = await con.query(sql);
        result.message = `${username} has been demoted.`;
        return result;
        
    }catch(err){
        console.log(err);
        result.status = STATUS_CODES.failure;
        result.message = err.message;
    }finally{
        con.end();
    }
}

exports.promoteAccount = async function (userId){
    let result = new Result();

    const con = await mysql.createConnection(sqlConfig);

    try{
        let sql = `update UserRoles set  = 1 where UserId = '${userId}`;
        const userResult = await con.query(sql);
        result.message = `${username} has been promoted.`;
        return result;
        
    }catch(err){
        console.log(err);
        result.status = STATUS_CODES.failure;
        result.message = err.message;
    }finally{
        con.end();
    }
}

exports.getScores = async function (){
    // TODO finish
}