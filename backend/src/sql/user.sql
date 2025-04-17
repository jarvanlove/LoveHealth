-- 用户相关SQL语句

-- 用户注册
INSERT INTO users (username, password, nickname, phone, avatar, status)
VALUES (?, ?, ?, ?, ?, 1);

-- 获取用户ID
SELECT LAST_INSERT_ID() AS user_id;

-- 根据用户名或手机号查询用户
SELECT id, username, password, nickname, phone, avatar, bio, gender, 
       birth_date, created_at, updated_at, status
FROM users
WHERE (username = ? OR phone = ?) AND status = 1;

-- 根据ID查询用户信息
SELECT id, username, nickname, phone, avatar, bio, gender, 
       birth_date, created_at, updated_at, status,
       (SELECT COUNT(*) FROM user_follows WHERE followed_id = users.id) AS follower_count,
       (SELECT COUNT(*) FROM user_follows WHERE follower_id = users.id) AS following_count,
       (SELECT COUNT(*) FROM posts WHERE user_id = users.id AND status = 1) AS post_count,
       (SELECT COUNT(*) FROM recipes WHERE user_id = users.id AND status = 1) AS recipe_count,
       (SELECT 1 FROM user_follows WHERE follower_id = ? AND followed_id = users.id) AS is_followed
FROM users
WHERE id = ? AND status = 1;

-- 修改用户基本信息
UPDATE users
SET nickname = ?, avatar = ?, bio = ?, gender = ?, birth_date = ?, updated_at = CURRENT_TIMESTAMP
WHERE id = ?;

-- 修改用户密码
UPDATE users
SET password = ?, updated_at = CURRENT_TIMESTAMP
WHERE id = ?;

-- 修改用户手机号
UPDATE users
SET phone = ?, updated_at = CURRENT_TIMESTAMP
WHERE id = ?;

-- 关注用户
INSERT INTO user_follows (follower_id, followed_id)
VALUES (?, ?);

-- 取消关注
DELETE FROM user_follows
WHERE follower_id = ? AND followed_id = ?;

-- 获取关注列表
SELECT u.id, u.username, u.nickname, u.avatar, u.bio, f.created_at AS followed_at,
       (SELECT COUNT(*) FROM user_follows WHERE followed_id = u.id) AS follower_count,
       (SELECT COUNT(*) FROM user_follows WHERE follower_id = u.id) AS following_count,
       (SELECT COUNT(*) FROM posts WHERE user_id = u.id AND status = 1) AS post_count,
       (SELECT 1 FROM user_follows WHERE follower_id = ? AND followed_id = u.id) AS is_followed
FROM users u
JOIN user_follows f ON u.id = f.followed_id
WHERE f.follower_id = ? AND u.status = 1
ORDER BY f.created_at DESC
LIMIT ? OFFSET ?;

-- 获取粉丝列表
SELECT u.id, u.username, u.nickname, u.avatar, u.bio, f.created_at AS followed_at,
       (SELECT COUNT(*) FROM user_follows WHERE followed_id = u.id) AS follower_count,
       (SELECT COUNT(*) FROM user_follows WHERE follower_id = u.id) AS following_count,
       (SELECT COUNT(*) FROM posts WHERE user_id = u.id AND status = 1) AS post_count,
       (SELECT 1 FROM user_follows WHERE follower_id = ? AND followed_id = u.id) AS is_followed
FROM users u
JOIN user_follows f ON u.id = f.follower_id
WHERE f.followed_id = ? AND u.status = 1
ORDER BY f.created_at DESC
LIMIT ? OFFSET ?;

-- 搜索用户
SELECT u.id, u.username, u.nickname, u.avatar, u.bio,
       (SELECT COUNT(*) FROM user_follows WHERE followed_id = u.id) AS follower_count,
       (SELECT COUNT(*) FROM user_follows WHERE follower_id = u.id) AS following_count,
       (SELECT COUNT(*) FROM posts WHERE user_id = u.id AND status = 1) AS post_count,
       (SELECT 1 FROM user_follows WHERE follower_id = ? AND followed_id = u.id) AS is_followed
FROM users u
WHERE u.status = 1 AND (u.username LIKE ? OR u.nickname LIKE ? OR u.phone LIKE ?)
ORDER BY follower_count DESC
LIMIT ? OFFSET ?;

-- 添加用户健康数据
INSERT INTO user_health_data (user_id, height, weight, bmi, activity_level, health_goals)
VALUES (?, ?, ?, ?, ?, ?);

-- 更新用户健康数据
UPDATE user_health_data
SET height = ?, weight = ?, bmi = ?, activity_level = ?, health_goals = ?, updated_at = CURRENT_TIMESTAMP
WHERE user_id = ?;

-- 获取用户健康数据
SELECT user_id, height, weight, bmi, activity_level, health_goals, created_at, updated_at
FROM user_health_data
WHERE user_id = ?;

-- 添加用户饮食偏好
INSERT INTO user_preferences (user_id, diet_type, allergies, disliked_ingredients, liked_ingredients, cuisine_preferences)
VALUES (?, ?, ?, ?, ?, ?);

-- 更新用户饮食偏好
UPDATE user_preferences
SET diet_type = ?, allergies = ?, disliked_ingredients = ?, liked_ingredients = ?, cuisine_preferences = ?, updated_at = CURRENT_TIMESTAMP
WHERE user_id = ?;

-- 获取用户饮食偏好
SELECT user_id, diet_type, allergies, disliked_ingredients, liked_ingredients, cuisine_preferences, created_at, updated_at
FROM user_preferences
WHERE user_id = ?;

-- 获取推荐关注的用户
SELECT u.id, u.username, u.nickname, u.avatar, u.bio,
       (SELECT COUNT(*) FROM user_follows WHERE followed_id = u.id) AS follower_count,
       (SELECT COUNT(*) FROM user_follows WHERE follower_id = u.id) AS following_count,
       (SELECT COUNT(*) FROM posts WHERE user_id = u.id AND status = 1) AS post_count,
       0 AS is_followed,
       COUNT(DISTINCT f2.followed_id) AS common_follows
FROM users u
JOIN user_follows f1 ON f1.followed_id = u.id
JOIN user_follows f2 ON f2.follower_id = f1.follower_id
WHERE f2.followed_id IN (SELECT followed_id FROM user_follows WHERE follower_id = ?)
AND u.id != ?
AND u.status = 1
AND NOT EXISTS (SELECT 1 FROM user_follows WHERE follower_id = ? AND followed_id = u.id)
GROUP BY u.id
ORDER BY common_follows DESC, follower_count DESC
LIMIT ?;

-- 添加用户设备信息
INSERT INTO user_devices (user_id, device_id, device_type, push_token, last_login_at)
VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP);

-- 更新用户设备信息
UPDATE user_devices
SET push_token = ?, last_login_at = CURRENT_TIMESTAMP
WHERE user_id = ? AND device_id = ?;

-- 获取用户设备信息
SELECT user_id, device_id, device_type, push_token, created_at, last_login_at
FROM user_devices
WHERE user_id = ?;

-- 删除用户设备信息
DELETE FROM user_devices
WHERE user_id = ? AND device_id = ?;

-- 添加用户搜索历史
INSERT INTO user_search_history (user_id, search_type, search_content)
VALUES (?, ?, ?);

-- 获取用户搜索历史
SELECT id, user_id, search_type, search_content, created_at
FROM user_search_history
WHERE user_id = ?
ORDER BY created_at DESC
LIMIT ?;

-- 清空用户搜索历史
DELETE FROM user_search_history
WHERE user_id = ?;

-- 删除单条搜索历史
DELETE FROM user_search_history
WHERE id = ? AND user_id = ?; 