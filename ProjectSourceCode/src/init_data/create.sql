
-- Table for storing user information
CREATE TABLE users (
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(70) NOT NULL
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
    Username VARCHAR(50) REFERENCES Users(username),
    Score INT NOT NULL,
    GameDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CategoryID INT REFERENCES TriviaCategories(CategoryID),
    ModeID INT REFERENCES GameModes(ModeID)
);

CREATE TABLE Friends (
    UserID VARCHAR(50) NOT NULL,
    FriendID VARCHAR(50) NOT NULL,
    FOREIGN KEY (UserID) REFERENCES Users(username),
    FOREIGN KEY (FriendID) REFERENCES Users(username),
    CONSTRAINT unique_friendship UNIQUE (UserID, FriendID)
);

