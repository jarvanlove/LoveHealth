-- 食谱相关SQL语句

-- 添加食谱
INSERT INTO recipes (user_id, title, description, cover_image, prep_time, cook_time, servings, 
                    calories, protein, carbs, fat, difficulty, category, tags, status)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1);

-- 获取食谱ID
SELECT LAST_INSERT_ID() AS recipe_id;

-- 添加食谱步骤
INSERT INTO recipe_steps (recipe_id, step_number, description, image)
VALUES (?, ?, ?, ?);

-- 添加食谱原料
INSERT INTO recipe_ingredients (recipe_id, ingredient_name, amount, unit)
VALUES (?, ?, ?, ?);

-- 获取食谱详情
SELECT r.id, r.user_id, r.title, r.description, r.cover_image, 
       r.prep_time, r.cook_time, r.servings, r.calories, r.protein, r.carbs, r.fat,
       r.difficulty, r.category, r.tags, r.created_at, r.updated_at, r.status,
       u.username, u.nickname, u.avatar,
       (SELECT COUNT(*) FROM recipe_likes WHERE recipe_id = r.id) AS like_count,
       (SELECT COUNT(*) FROM recipe_collections WHERE recipe_id = r.id) AS collection_count,
       (SELECT COUNT(*) FROM recipe_comments WHERE recipe_id = r.id) AS comment_count,
       (SELECT 1 FROM recipe_likes WHERE recipe_id = r.id AND user_id = ?) AS is_liked,
       (SELECT 1 FROM recipe_collections WHERE recipe_id = r.id AND user_id = ?) AS is_collected
FROM recipes r
JOIN users u ON r.user_id = u.id
WHERE r.id = ? AND r.status = 1;

-- 获取食谱步骤
SELECT step_number, description, image
FROM recipe_steps
WHERE recipe_id = ?
ORDER BY step_number;

-- 获取食谱原料
SELECT ingredient_name, amount, unit
FROM recipe_ingredients
WHERE recipe_id = ?
ORDER BY id;

-- 获取食谱列表（带分页）
SELECT r.id, r.user_id, r.title, r.description, r.cover_image, 
       r.prep_time, r.cook_time, r.calories, r.difficulty, r.category, r.tags,
       r.created_at, r.status,
       u.username, u.nickname, u.avatar,
       (SELECT COUNT(*) FROM recipe_likes WHERE recipe_id = r.id) AS like_count,
       (SELECT COUNT(*) FROM recipe_collections WHERE recipe_id = r.id) AS collection_count,
       (SELECT COUNT(*) FROM recipe_comments WHERE recipe_id = r.id) AS comment_count,
       (SELECT 1 FROM recipe_likes WHERE recipe_id = r.id AND user_id = ?) AS is_liked,
       (SELECT 1 FROM recipe_collections WHERE recipe_id = r.id AND user_id = ?) AS is_collected
FROM recipes r
JOIN users u ON r.user_id = u.id
WHERE r.status = 1
ORDER BY r.created_at DESC
LIMIT ? OFFSET ?;

-- 根据分类获取食谱列表
SELECT r.id, r.user_id, r.title, r.description, r.cover_image, 
       r.prep_time, r.cook_time, r.calories, r.difficulty, r.category, r.tags,
       r.created_at, r.status,
       u.username, u.nickname, u.avatar,
       (SELECT COUNT(*) FROM recipe_likes WHERE recipe_id = r.id) AS like_count,
       (SELECT COUNT(*) FROM recipe_collections WHERE recipe_id = r.id) AS collection_count,
       (SELECT COUNT(*) FROM recipe_comments WHERE recipe_id = r.id) AS comment_count,
       (SELECT 1 FROM recipe_likes WHERE recipe_id = r.id AND user_id = ?) AS is_liked,
       (SELECT 1 FROM recipe_collections WHERE recipe_id = r.id AND user_id = ?) AS is_collected
FROM recipes r
JOIN users u ON r.user_id = u.id
WHERE r.status = 1 AND r.category = ?
ORDER BY r.created_at DESC
LIMIT ? OFFSET ?;

-- 根据标签获取食谱列表
SELECT r.id, r.user_id, r.title, r.description, r.cover_image, 
       r.prep_time, r.cook_time, r.calories, r.difficulty, r.category, r.tags,
       r.created_at, r.status,
       u.username, u.nickname, u.avatar,
       (SELECT COUNT(*) FROM recipe_likes WHERE recipe_id = r.id) AS like_count,
       (SELECT COUNT(*) FROM recipe_collections WHERE recipe_id = r.id) AS collection_count,
       (SELECT COUNT(*) FROM recipe_comments WHERE recipe_id = r.id) AS comment_count,
       (SELECT 1 FROM recipe_likes WHERE recipe_id = r.id AND user_id = ?) AS is_liked,
       (SELECT 1 FROM recipe_collections WHERE recipe_id = r.id AND user_id = ?) AS is_collected
FROM recipes r
JOIN users u ON r.user_id = u.id
WHERE r.status = 1 AND r.tags LIKE ?
ORDER BY r.created_at DESC
LIMIT ? OFFSET ?;

-- 搜索食谱
SELECT r.id, r.user_id, r.title, r.description, r.cover_image, 
       r.prep_time, r.cook_time, r.calories, r.difficulty, r.category, r.tags,
       r.created_at, r.status,
       u.username, u.nickname, u.avatar,
       (SELECT COUNT(*) FROM recipe_likes WHERE recipe_id = r.id) AS like_count,
       (SELECT COUNT(*) FROM recipe_collections WHERE recipe_id = r.id) AS collection_count,
       (SELECT COUNT(*) FROM recipe_comments WHERE recipe_id = r.id) AS comment_count,
       (SELECT 1 FROM recipe_likes WHERE recipe_id = r.id AND user_id = ?) AS is_liked,
       (SELECT 1 FROM recipe_collections WHERE recipe_id = r.id AND user_id = ?) AS is_collected
FROM recipes r
JOIN users u ON r.user_id = u.id
WHERE r.status = 1 AND (r.title LIKE ? OR r.description LIKE ? OR r.tags LIKE ?)
ORDER BY r.created_at DESC
LIMIT ? OFFSET ?;

-- 获取热门食谱
SELECT r.id, r.user_id, r.title, r.description, r.cover_image, 
       r.prep_time, r.cook_time, r.calories, r.difficulty, r.category, r.tags,
       r.created_at, r.status,
       u.username, u.nickname, u.avatar,
       (SELECT COUNT(*) FROM recipe_likes WHERE recipe_id = r.id) AS like_count,
       (SELECT COUNT(*) FROM recipe_collections WHERE recipe_id = r.id) AS collection_count,
       (SELECT COUNT(*) FROM recipe_comments WHERE recipe_id = r.id) AS comment_count,
       (SELECT 1 FROM recipe_likes WHERE recipe_id = r.id AND user_id = ?) AS is_liked,
       (SELECT 1 FROM recipe_collections WHERE recipe_id = r.id AND user_id = ?) AS is_collected
FROM recipes r
JOIN users u ON r.user_id = u.id
WHERE r.status = 1
ORDER BY like_count DESC, collection_count DESC
LIMIT ? OFFSET ?;

-- 获取用户关注的人发布的食谱
SELECT r.id, r.user_id, r.title, r.description, r.cover_image, 
       r.prep_time, r.cook_time, r.calories, r.difficulty, r.category, r.tags,
       r.created_at, r.status,
       u.username, u.nickname, u.avatar,
       (SELECT COUNT(*) FROM recipe_likes WHERE recipe_id = r.id) AS like_count,
       (SELECT COUNT(*) FROM recipe_collections WHERE recipe_id = r.id) AS collection_count,
       (SELECT COUNT(*) FROM recipe_comments WHERE recipe_id = r.id) AS comment_count,
       (SELECT 1 FROM recipe_likes WHERE recipe_id = r.id AND user_id = ?) AS is_liked,
       (SELECT 1 FROM recipe_collections WHERE recipe_id = r.id AND user_id = ?) AS is_collected
FROM recipes r
JOIN users u ON r.user_id = u.id
WHERE r.status = 1 AND r.user_id IN (SELECT followed_id FROM user_follows WHERE follower_id = ?)
ORDER BY r.created_at DESC
LIMIT ? OFFSET ?;

-- 获取用户发布的食谱
SELECT r.id, r.user_id, r.title, r.description, r.cover_image, 
       r.prep_time, r.cook_time, r.calories, r.difficulty, r.category, r.tags,
       r.created_at, r.status,
       u.username, u.nickname, u.avatar,
       (SELECT COUNT(*) FROM recipe_likes WHERE recipe_id = r.id) AS like_count,
       (SELECT COUNT(*) FROM recipe_collections WHERE recipe_id = r.id) AS collection_count,
       (SELECT COUNT(*) FROM recipe_comments WHERE recipe_id = r.id) AS comment_count,
       (SELECT 1 FROM recipe_likes WHERE recipe_id = r.id AND user_id = ?) AS is_liked,
       (SELECT 1 FROM recipe_collections WHERE recipe_id = r.id AND user_id = ?) AS is_collected
FROM recipes r
JOIN users u ON r.user_id = u.id
WHERE r.status = 1 AND r.user_id = ?
ORDER BY r.created_at DESC
LIMIT ? OFFSET ?;

-- 获取用户收藏的食谱
SELECT r.id, r.user_id, r.title, r.description, r.cover_image, 
       r.prep_time, r.cook_time, r.calories, r.difficulty, r.category, r.tags,
       r.created_at, r.status,
       u.username, u.nickname, u.avatar,
       (SELECT COUNT(*) FROM recipe_likes WHERE recipe_id = r.id) AS like_count,
       (SELECT COUNT(*) FROM recipe_collections WHERE recipe_id = r.id) AS collection_count,
       (SELECT COUNT(*) FROM recipe_comments WHERE recipe_id = r.id) AS comment_count,
       (SELECT 1 FROM recipe_likes WHERE recipe_id = r.id AND user_id = ?) AS is_liked,
       1 AS is_collected,
       rc.created_at AS collection_time
FROM recipes r
JOIN users u ON r.user_id = u.id
JOIN recipe_collections rc ON r.id = rc.recipe_id
WHERE r.status = 1 AND rc.user_id = ?
ORDER BY rc.created_at DESC
LIMIT ? OFFSET ?;

-- 添加食谱评论
INSERT INTO recipe_comments (recipe_id, user_id, content, parent_id)
VALUES (?, ?, ?, ?);

-- 获取评论ID
SELECT LAST_INSERT_ID() AS comment_id;

-- 获取食谱评论
SELECT c.id, c.recipe_id, c.user_id, c.content, c.parent_id, c.created_at,
       u.username, u.nickname, u.avatar,
       (SELECT COUNT(*) FROM recipe_comment_likes WHERE comment_id = c.id) AS like_count,
       (SELECT 1 FROM recipe_comment_likes WHERE comment_id = c.id AND user_id = ?) AS is_liked
FROM recipe_comments c
JOIN users u ON c.user_id = u.id
WHERE c.recipe_id = ? AND c.parent_id IS NULL
ORDER BY c.created_at DESC
LIMIT ? OFFSET ?;

-- 获取评论的回复
SELECT c.id, c.recipe_id, c.user_id, c.content, c.parent_id, c.created_at,
       u.username, u.nickname, u.avatar,
       (SELECT COUNT(*) FROM recipe_comment_likes WHERE comment_id = c.id) AS like_count,
       (SELECT 1 FROM recipe_comment_likes WHERE comment_id = c.id AND user_id = ?) AS is_liked,
       (SELECT nickname FROM users WHERE id = c.reply_to_user_id) AS reply_to_nickname
FROM recipe_comments c
JOIN users u ON c.user_id = u.id
WHERE c.parent_id = ?
ORDER BY c.created_at
LIMIT ? OFFSET ?;

-- 点赞食谱
INSERT INTO recipe_likes (recipe_id, user_id)
VALUES (?, ?);

-- 取消点赞食谱
DELETE FROM recipe_likes
WHERE recipe_id = ? AND user_id = ?;

-- 收藏食谱
INSERT INTO recipe_collections (recipe_id, user_id)
VALUES (?, ?);

-- 取消收藏食谱
DELETE FROM recipe_collections
WHERE recipe_id = ? AND user_id = ?;

-- 点赞评论
INSERT INTO recipe_comment_likes (comment_id, user_id)
VALUES (?, ?);

-- 取消点赞评论
DELETE FROM recipe_comment_likes
WHERE comment_id = ? AND user_id = ?;

-- 获取食谱分类列表
SELECT DISTINCT category, COUNT(*) AS recipe_count
FROM recipes
WHERE status = 1
GROUP BY category
ORDER BY recipe_count DESC;

-- 获取热门标签
SELECT DISTINCT SUBSTRING_INDEX(SUBSTRING_INDEX(tags, ',', n.digit+1), ',', -1) AS tag,
       COUNT(*) AS tag_count
FROM recipes r
JOIN (
    SELECT 0 AS digit UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL
    SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL
    SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9
) n
WHERE r.status = 1
AND LENGTH(r.tags) - LENGTH(REPLACE(r.tags, ',', '')) >= n.digit
GROUP BY tag
ORDER BY tag_count DESC
LIMIT 20;

-- 更新食谱基本信息
UPDATE recipes
SET title = ?, description = ?, cover_image = ?, prep_time = ?, cook_time = ?, 
    servings = ?, calories = ?, protein = ?, carbs = ?, fat = ?, 
    difficulty = ?, category = ?, tags = ?, updated_at = CURRENT_TIMESTAMP
WHERE id = ? AND user_id = ?;

-- 删除食谱步骤
DELETE FROM recipe_steps
WHERE recipe_id = ?;

-- 删除食谱原料
DELETE FROM recipe_ingredients
WHERE recipe_id = ?;

-- 删除食谱（软删除）
UPDATE recipes
SET status = 0, updated_at = CURRENT_TIMESTAMP
WHERE id = ? AND user_id = ?;

-- 获取根据用户健康数据和偏好推荐的食谱
SELECT r.id, r.user_id, r.title, r.description, r.cover_image, 
       r.prep_time, r.cook_time, r.calories, r.protein, r.carbs, r.fat, 
       r.difficulty, r.category, r.tags, r.created_at, r.status,
       u.username, u.nickname, u.avatar,
       (SELECT COUNT(*) FROM recipe_likes WHERE recipe_id = r.id) AS like_count,
       (SELECT COUNT(*) FROM recipe_collections WHERE recipe_id = r.id) AS collection_count,
       (SELECT COUNT(*) FROM recipe_comments WHERE recipe_id = r.id) AS comment_count,
       (SELECT 1 FROM recipe_likes WHERE recipe_id = r.id AND user_id = ?) AS is_liked,
       (SELECT 1 FROM recipe_collections WHERE recipe_id = r.id AND user_id = ?) AS is_collected
FROM recipes r
JOIN users u ON r.user_id = u.id
JOIN user_preferences up ON up.user_id = ?
JOIN user_health_data uhd ON uhd.user_id = ?
WHERE r.status = 1
AND (up.diet_type IS NULL OR r.tags LIKE CONCAT('%', up.diet_type, '%'))
AND (up.allergies IS NULL OR r.tags NOT LIKE CONCAT('%', REPLACE(up.allergies, ',', '%'), '%'))
ORDER BY 
    CASE 
        WHEN uhd.health_goals LIKE '%减肥%' THEN r.calories
        WHEN uhd.health_goals LIKE '%增肌%' THEN -r.protein
        ELSE (r.like_count + r.collection_count)
    END,
    (r.like_count + r.collection_count) DESC
LIMIT ? OFFSET ?; 