use Time4Trivia;

create table if not exists Questions(
	QuestionId int NOT NULL AUTO_INCREMENT,
	Question varchar(100) NOT NULL,
	CorrectAnswer varchar(100) NOT NULL,
    IncorrectAnswer0 varchar(100) NOT NULL,
	IncorrectAnswer1 varchar(100) NOT NULL,
    IncorrectAnswer2 varchar(100) NOT NULL,
	ApprovalStatus BIT(1) NOT NULL,
    PRIMARY KEY (QuestionId)
);

Insert into Questions (QuestionId, Question, CorrectAnswer, IncorrectAnswer0, IncorrectAnswer1, IncorrectAnswer2, ApprovalStatus) values 
(4, 'What year was the game Team Fortress 2 released?', '2007', '2009', '2005', '2010', 1)

select * from questions