CREATE DATABASE IF NOT EXISTS db;

-- Table for storing user information
CREATE TABLE Users (
    UserID SERIAL PRIMARY KEY ,
    UserName VARCHAR(50) NOT NULL,
    Email VARCHAR(100) NOT NULL,
    Password VARCHAR(50) NOT NULL
);



-- Table for storing trivia categories
CREATE TABLE TriviaCategories (
    CategoryID SERIAL PRIMARY KEY,
    CategoryName VARCHAR(100) NOT NULL
);

-- Table for storing game modes
CREATE TABLE GameModes (
    ModeID SERIAL PRIMARY KEY,
    ModeName VARCHAR(100) NOT NULL
);

-- Table for storing trivia questions
CREATE TABLE TriviaQuestions (
    QuestionID SERIAL PRIMARY KEY,
    QuestionText TEXT NOT NULL,
    CorrectAnswer VARCHAR(255) NOT NULL,
    CategoryID INT REFERENCES TriviaCategories(CategoryID)
);

-- Table for storing user scores
CREATE TABLE UserScores (
    ScoreID SERIAL PRIMARY KEY,
    UserID INT REFERENCES Users(UserID),
    Score INT NOT NULL,
    GameDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CategoryID INT REFERENCES TriviaCategories(CategoryID),
    ModeID INT REFERENCES GameModes(ModeID)
);

