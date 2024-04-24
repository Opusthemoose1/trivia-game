INSERT INTO Users (UserName, Email, Password)
VALUES 
    ('Alice', 'alice@example.com', 'password123'),
    ('Bob', 'bob@example.com', 'securepassword'),
    ('Charlie', 'charlie@example.com', 'letmein');

INSERT INTO TriviaCategories (CategoryName)
VALUES 
    ('General Knowledge'),
    ('History'),
    ('Science'),
    ('Movies'),
    ('Sports');


INSERT INTO GameModes (ModeName)
VALUES 
    ('Survival Mode'),
    ('Timed Mode');

INSERT INTO TriviaQuestions (QuestionText, CorrectAnswer, CategoryID)
VALUES 
    ('What is the capital of France?', 'Paris', 'General Knowledge'),
    ('Who invented the telephone?', 'Alexander Graham Bell', 'History'),
    ('What is the chemical symbol for water?', 'H2O', 'Science'),
    ('Who directed the movie "The Shawshank Redemption"?', 'Frank Darabont', 'Movies'),
    ('Who won the FIFA World Cup in 2018?', 'France', 'Sports');

INSERT INTO UserScores (username, Score, CategoryName, ModeID)
VALUES 
    ('Alice', 100, 'Sports', 1),
    ('Alice', 150, 'Sports', 2),
    ('Bob', 120, 'Science', 1),
    ('Bob', 90, 'Movies', 2),
    ('Charlie', 200, 'History', 1);

INSERT INTO Friends (UserID, FriendID)
VALUES
    ('Alice', 'Bob'),
    ('Alice', 'Charlie');