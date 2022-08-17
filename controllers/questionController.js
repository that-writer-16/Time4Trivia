const sqlDAL = require('../data/sqlDAL');

const Result = require('../models/result').Result;
const STATUS_CODES = require('../models/statusCodes').STATUS_CODES;

exports.getAllQuestions = async function () {
    let results = await sqlDAL.getAllQuestions();

    return results;
}

exports.getApprovedQuestions = async function () {
    let results = await sqlDAL.getApprovedQuestions();
    // console.log('Question Controller:');
    // console.log(results);
    return results;
}

exports.addQuestions = async function () {
    let result = await sqlDAL.addQuestions();

    return results;
}
