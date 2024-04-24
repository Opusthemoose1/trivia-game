
-- Table for storing user information
CREATE TABLE users (
    username VARCHAR(50) PRIMARY KEY,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(70) NOT NULL
);



-- Table for storing trivia categories
CREATE TABLE TriviaCategories (
    CategoryName VARCHAR(100) PRIMARY KEY
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
    CategoryID VARCHAR(100) REFERENCES TriviaCategories(CategoryName)
);

-- Table for storing user scores
CREATE TABLE UserScores (
    ScoreID SERIAL PRIMARY KEY,
    username VARCHAR(50) REFERENCES Users(username),
    Score INT NOT NULL,
    GameDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CategoryName VARCHAR(100) REFERENCES TriviaCategories(CategoryName),
    ModeID INT REFERENCES GameModes(ModeID)
);

CREATE TABLE Friends (
    UserID VARCHAR(50) NOT NULL,
    FriendID VARCHAR(50) NOT NULL,
    FOREIGN KEY (UserID) REFERENCES users(username),
    FOREIGN KEY (FriendID) REFERENCES users(username),
    CONSTRAINT unique_friendship UNIQUE (UserID, FriendID)
);

