create database if not exists Time4Trivia;

use Time4Trivia;

drop table if exists UserRoles;
drop table if exists Users;
drop table if exists Roles;

create table if not exists Users(
	UserId int NOT NULL AUTO_INCREMENT,
	Username varchar(100) NOT NULL,
	Password varchar(100) NOT NULL,
	Email varchar(100) NOT NULL,
	PRIMARY KEY (UserId),
	CONSTRAINT Users_UniqueEmail UNIQUE(Email),
	CONSTRAINT Users_UniqueUsername UNIQUE(Username)
);

create table if not exists Roles(
	RoleId int NOT NULL AUTO_INCREMENT,
	Role varchar(100) NOT NULL,
	RoleDescription text NOT NULL,
	PRIMARY KEY (RoleId),
	CONSTRAINT Roles_UniqueRole UNIQUE(Role)
);

create table if not exists UserRoles(
	UserId int,
	RoleId int,
	PRIMARY KEY (UserId, RoleId),
    foreign key (UserId) references Users(UserId),
    foreign key (RoleId) references Roles(RoleId)
);