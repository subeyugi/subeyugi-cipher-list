CREATE TABLE ciphers(id INTEGER PRIMARY KEY AUTOINCREMENT, songId INTEGER , title VARCHAR(100), isSolved INTEGER, solverId INTEGER, solvedTime VARCHAR(20), details VARCHAR(5000))
INSERT INTO ciphers(id, songId, title, isSolved, solverId, solvedTime, details) VALUES (1, 1, "解読名", 1, 1, "2026/07/28 20:17", "とくにいみなし")
SELECT * FROM ciphers

DROP TABLE ciphers