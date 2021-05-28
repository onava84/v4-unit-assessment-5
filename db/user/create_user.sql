INSERT INTO helo_users
(username,password,profile_pic)
VALUES
(${username}, ${password}, ${profile_pic})
returning* ;