use Time4Trivia;

-- Insert Initial Data
insert into Users  (username, password, email) values ('admin', '$2b$10$8Zq3JH4WY6CRwQmitid6V.9oFlM/RKo3ATcXqGWdoXoW14SmAJ7d6', 'admin@test.com');
insert into Users (username, password, email) values ('test', '$2b$10$GlNz68MNngzHKC1Vc4FaDu2zRGnFqXvt3Q69ke1OAnJF9Ml1l/jBm', 'test@test.com');
insert into Users (username, password, email) values ('phil', '$2b$10$GlNz68MNngzHKC1Vc4FaDu2zRGnFqXvt3Q69ke1OAnJF9Ml1l/jBm', 'phil@gmail.com');

insert into Roles (Role, RoleDescription) values ('user', 'standard user role');
insert into Roles (Role, RoleDescription) values ('admin', 'site admins');

set @userId = (select UserId from Users where username = 'test');
set @roleId = (select RoleId from Roles where Role = 'user');
insert into UserRoles (UserId, RoleId) values (@userId, @roleId);

set @userId = (select UserId from Users where username = 'phil');
set @roleId = (select RoleId from Roles where Role = 'user');
insert into UserRoles (UserId, RoleId) values (@userId, @roleId);

set @userId = (select UserId from Users where username = 'admin');
set @roleId = (select RoleId from Roles where Role = 'admin');
insert into UserRoles (UserId, RoleId) values (@userId, @roleId);

Insert into Questions (Question, CorrectAnswer, IncorrectAnswer0, IncorrectAnswer1, IncorrectAnswer2, ApprovalStatus) values ('What year was the game Team Fortress 2 released?', '2007', '2009', '2005', '2010', 1)
Insert into Questions (Question, CorrectAnswer, IncorrectAnswer0, IncorrectAnswer1, IncorrectAnswer2, ApprovalStatus) values ('In which series of games do you collect souls to empower you and buy weaponry and armor with?', 'Souls', 'Final Fantasy', 'Monster Hunter', 'The Legend of Zelda', 1)
Insert into Questions (Question, CorrectAnswer, IncorrectAnswer0, IncorrectAnswer1, IncorrectAnswer2, ApprovalStatus) values ('What is the original name of Final Fantasy XV?', 'Final Fantasy Versus XIII', 'Final Fantasy: Reborn', 'Final Fantasy XVI', 'Final Fantasy XIII-3', 1)
Insert into Questions (Question, CorrectAnswer, IncorrectAnswer0, IncorrectAnswer1, IncorrectAnswer2, ApprovalStatus) values ('In Portal 2, the iconic character GLaDOS is turned into:', 'A potato', 'A tomato', 'A lemon', 'An apple', 1)
Insert into Questions (Question, CorrectAnswer, IncorrectAnswer0, IncorrectAnswer1, IncorrectAnswer2, ApprovalStatus) values ('Which of these is NOT a team available in the game Pokemon Go?', 'Team Rocket', 'Team Instinct', 'Team Valor', 'Team Mystic', 1)
Insert into Questions (Question, CorrectAnswer, IncorrectAnswer0, IncorrectAnswer1, IncorrectAnswer2, ApprovalStatus) values ('Which of these Counter-Strike maps is a bomb defuse scenario?', 'Prodigy', '747', 'Havana', 'Oilrig', 1)
Insert into Questions (Question, CorrectAnswer, IncorrectAnswer0, IncorrectAnswer1, IncorrectAnswer2, ApprovalStatus) values ('What year was the game Overwatch revealed?', '2014', '2015', '2011', '2008', 1)
Insert into Questions (Question, CorrectAnswer, IncorrectAnswer0, IncorrectAnswer1, IncorrectAnswer2, ApprovalStatus) values ('In Touhou: Embodiment of Scarlet Devil, what song plays during Flandre Scarlets boss fight?', 'U.N. Owen Was Her', 'Septette for the Dead Princess', 'Flowering Night', 'Pierrot of the Star-Spangled Banner', 1)
Insert into Questions (Question, CorrectAnswer, IncorrectAnswer0, IncorrectAnswer1, IncorrectAnswer2, ApprovalStatus) values ('What is the full name of the protagonist from the SNES game Clock Tower?', 'Jennifer Simpson', 'Jennifer Barrows', 'Jennifer Cartwright', 'Jennifer Maxwell', 1)
Insert into Questions (Question, CorrectAnswer, IncorrectAnswer0, IncorrectAnswer1, IncorrectAnswer2, ApprovalStatus) values ('Which of these is NOT the name of a team leader in Pokemon GO?', 'Leif', 'Blanche', 'Spark', 'Candela', 1)

-- test data
-- select * from users;
-- select * from roles;
-- select * from userroles;

select u.userid, u.username, r.role
from users u 
	left join userroles ur on u.userid = ur.userid
	left join roles r on r.roleid = ur.roleid;