SELECT posts.id AS post_id, title, content, img, profile_pic, date_created, username AS author_username FROM helo_posts AS posts
JOIN helo_users AS users ON users.id = posts.author_id
where lower(title) LIKE $1
ORDER BY date_created ASC;