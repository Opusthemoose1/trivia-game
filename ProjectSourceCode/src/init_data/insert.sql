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
    ('What is the capital of France?', 'Paris', 1),
    ('Who invented the telephone?', 'Alexander Graham Bell', 2),
    ('What is the chemical symbol for water?', 'H2O', 3),
    ('Who directed the movie "The Shawshank Redemption"?', 'Frank Darabont', 4),
    ('Who won the FIFA World Cup in 2018?', 'France', 5);

INSERT INTO UserScores (UserID, Score, CategoryID, ModeID)
VALUES 
    (1, 100, 1, 1),
    (1, 150, 2, 2),
    (2, 120, 1, 1),
    (2, 90, 4, 2),
    (3, 200, 3, 1);
