class Question{
    constructor(question, correctAnswer, incorrectAnswer0, incorrectAnswer1, incorrectAnswer2, approvalStatus){
        this.question = question;
        this.correctAnswer = correctAnswer;
        this.incorrectAnswer0 = incorrectAnswer0;
        this.incorrectAnswer1 = incorrectAnswer1;
        this.incorrectAnswer2 = incorrectAnswer2;
        this.approvalStatus = approvalStatus;
    }
}

exports.Question = Question;