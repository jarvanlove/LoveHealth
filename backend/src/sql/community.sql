-- 社区相关SQL语句

-- 发布动态
INSERT INTO posts (user_id, content, images, tags, location, status)
VALUES (?, ?, ?, ?, ?, ?);

-- 获取动态ID
SELECT LAST_INSERT_ID() AS post_id;

-- 获取动态列表（分页）
SELECT p.id, p.content, p.images, p.tags, p.location, p.created_at, p.updated_at, p.status,
       u.id AS user_id, u.nickname, u.avatar,
       (SELECT COUNT(*) FROM post_likes WHERE post_id = p.id) AS like_count,
       (SELECT COUNT(*) FROM post_comments WHERE post_id = p.id) AS comment_count,
       (SELECT COUNT(*) FROM post_collects WHERE post_id = p.id) AS collect_count,
       (SELECT 1 FROM post_likes WHERE post_id = p.id AND user_id = ?) AS is_liked,
       (SELECT 1 FROM post_collects WHERE post_id = p.id AND user_id = ?) AS is_collected
FROM posts p
JOIN users u ON p.user_id = u.id
WHERE p.status = 1
ORDER BY p.created_at DESC
LIMIT ? OFFSET ?;

-- 获取关注用户的动态列表（分页）
SELECT p.id, p.content, p.images, p.tags, p.location, p.created_at, p.updated_at, p.status,
       u.id AS user_id, u.nickname, u.avatar,
       (SELECT COUNT(*) FROM post_likes WHERE post_id = p.id) AS like_count,
       (SELECT COUNT(*) FROM post_comments WHERE post_id = p.id) AS comment_count,
       (SELECT COUNT(*) FROM post_collects WHERE post_id = p.id) AS collect_count,
       (SELECT 1 FROM post_likes WHERE post_id = p.id AND user_id = ?) AS is_liked,
       (SELECT 1 FROM post_collects WHERE post_id = p.id AND user_id = ?) AS is_collected
FROM posts p
JOIN users u ON p.user_id = u.id
JOIN user_follows f ON p.user_id = f.followed_id AND f.follower_id = ?
WHERE p.status = 1
ORDER BY p.created_at DESC
LIMIT ? OFFSET ?;

-- 获取热门动态列表（分页）
SELECT p.id, p.content, p.images, p.tags, p.location, p.created_at, p.updated_at, p.status,
       u.id AS user_id, u.nickname, u.avatar,
       (SELECT COUNT(*) FROM post_likes WHERE post_id = p.id) AS like_count,
       (SELECT COUNT(*) FROM post_comments WHERE post_id = p.id) AS comment_count,
       (SELECT COUNT(*) FROM post_collects WHERE post_id = p.id) AS collect_count,
       (SELECT 1 FROM post_likes WHERE post_id = p.id AND user_id = ?) AS is_liked,
       (SELECT 1 FROM post_collects WHERE post_id = p.id AND user_id = ?) AS is_collected
FROM posts p
JOIN users u ON p.user_id = u.id
WHERE p.status = 1
ORDER BY (like_count + comment_count * 2) DESC, p.created_at DESC
LIMIT ? OFFSET ?;

-- 根据标签搜索动态
SELECT p.id, p.content, p.images, p.tags, p.location, p.created_at, p.updated_at, p.status,
       u.id AS user_id, u.nickname, u.avatar,
       (SELECT COUNT(*) FROM post_likes WHERE post_id = p.id) AS like_count,
       (SELECT COUNT(*) FROM post_comments WHERE post_id = p.id) AS comment_count,
       (SELECT COUNT(*) FROM post_collects WHERE post_id = p.id) AS collect_count,
       (SELECT 1 FROM post_likes WHERE post_id = p.id AND user_id = ?) AS is_liked,
       (SELECT 1 FROM post_collects WHERE post_id = p.id AND user_id = ?) AS is_collected
FROM posts p
JOIN users u ON p.user_id = u.id
WHERE p.status = 1 AND p.tags LIKE ?
ORDER BY p.created_at DESC
LIMIT ? OFFSET ?;

-- 搜索动态
SELECT p.id, p.content, p.images, p.tags, p.location, p.created_at, p.updated_at, p.status,
       u.id AS user_id, u.nickname, u.avatar,
       (SELECT COUNT(*) FROM post_likes WHERE post_id = p.id) AS like_count,
       (SELECT COUNT(*) FROM post_comments WHERE post_id = p.id) AS comment_count,
       (SELECT COUNT(*) FROM post_collects WHERE post_id = p.id) AS collect_count,
       (SELECT 1 FROM post_likes WHERE post_id = p.id AND user_id = ?) AS is_liked,
       (SELECT 1 FROM post_collects WHERE post_id = p.id AND user_id = ?) AS is_collected
FROM posts p
JOIN users u ON p.user_id = u.id
WHERE p.status = 1 AND (p.content LIKE ? OR p.tags LIKE ?)
ORDER BY p.created_at DESC
LIMIT ? OFFSET ?;

-- 获取动态详情
SELECT p.id, p.content, p.images, p.tags, p.location, p.created_at, p.updated_at, p.status,
       u.id AS user_id, u.nickname, u.avatar,
       (SELECT COUNT(*) FROM post_likes WHERE post_id = p.id) AS like_count,
       (SELECT COUNT(*) FROM post_comments WHERE post_id = p.id) AS comment_count,
       (SELECT COUNT(*) FROM post_collects WHERE post_id = p.id) AS collect_count,
       (SELECT 1 FROM post_likes WHERE post_id = p.id AND user_id = ?) AS is_liked,
       (SELECT 1 FROM post_collects WHERE post_id = p.id AND user_id = ?) AS is_collected
FROM posts p
JOIN users u ON p.user_id = u.id
WHERE p.id = ? AND p.status = 1;

-- 获取动态评论列表
SELECT c.id, c.post_id, c.user_id, c.content, c.parent_id, c.created_at,
       u.nickname, u.avatar,
       (SELECT nickname FROM users WHERE id = (SELECT user_id FROM post_comments WHERE id = c.parent_id)) AS reply_to_nickname,
       (SELECT COUNT(*) FROM post_comment_likes WHERE comment_id = c.id) AS like_count,
       (SELECT 1 FROM post_comment_likes WHERE comment_id = c.id AND user_id = ?) AS is_liked
FROM post_comments c
JOIN users u ON c.user_id = u.id
WHERE c.post_id = ?
ORDER BY c.created_at ASC
LIMIT ? OFFSET ?;

-- 添加动态评论
INSERT INTO post_comments (post_id, user_id, content, parent_id)
VALUES (?, ?, ?, ?);

-- 点赞动态
INSERT INTO post_likes (post_id, user_id)
VALUES (?, ?);

-- 取消点赞动态
DELETE FROM post_likes
WHERE post_id = ? AND user_id = ?;

-- 收藏动态
INSERT INTO post_collects (post_id, user_id)
VALUES (?, ?);

-- 取消收藏动态
DELETE FROM post_collects
WHERE post_id = ? AND user_id = ?;

-- 点赞评论
INSERT INTO post_comment_likes (comment_id, user_id)
VALUES (?, ?);

-- 取消点赞评论
DELETE FROM post_comment_likes
WHERE comment_id = ? AND user_id = ?;

-- 更新动态
UPDATE posts
SET content = ?, images = ?, tags = ?, location = ?, updated_at = CURRENT_TIMESTAMP
WHERE id = ? AND user_id = ?;

-- 删除动态（软删除）
UPDATE posts
SET status = 0, updated_at = CURRENT_TIMESTAMP
WHERE id = ? AND user_id = ?;

-- 删除评论
DELETE FROM post_comments
WHERE id = ? AND user_id = ?;

-- 获取用户动态列表
SELECT p.id, p.content, p.images, p.tags, p.location, p.created_at, p.updated_at, p.status,
       u.id AS user_id, u.nickname, u.avatar,
       (SELECT COUNT(*) FROM post_likes WHERE post_id = p.id) AS like_count,
       (SELECT COUNT(*) FROM post_comments WHERE post_id = p.id) AS comment_count,
       (SELECT COUNT(*) FROM post_collects WHERE post_id = p.id) AS collect_count,
       (SELECT 1 FROM post_likes WHERE post_id = p.id AND user_id = ?) AS is_liked,
       (SELECT 1 FROM post_collects WHERE post_id = p.id AND user_id = ?) AS is_collected
FROM posts p
JOIN users u ON p.user_id = u.id
WHERE p.user_id = ? AND p.status = 1
ORDER BY p.created_at DESC
LIMIT ? OFFSET ?;

-- 获取用户收藏的动态列表
SELECT p.id, p.content, p.images, p.tags, p.location, p.created_at, p.updated_at, p.status,
       u.id AS user_id, u.nickname, u.avatar,
       (SELECT COUNT(*) FROM post_likes WHERE post_id = p.id) AS like_count,
       (SELECT COUNT(*) FROM post_comments WHERE post_id = p.id) AS comment_count,
       (SELECT COUNT(*) FROM post_collects WHERE post_id = p.id) AS collect_count,
       (SELECT 1 FROM post_likes WHERE post_id = p.id AND user_id = ?) AS is_liked,
       1 AS is_collected
FROM posts p
JOIN users u ON p.user_id = u.id
JOIN post_collects pc ON p.id = pc.post_id AND pc.user_id = ?
WHERE p.status = 1
ORDER BY pc.created_at DESC
LIMIT ? OFFSET ?;

-- 获取用户点赞的动态列表
SELECT p.id, p.content, p.images, p.tags, p.location, p.created_at, p.updated_at, p.status,
       u.id AS user_id, u.nickname, u.avatar,
       (SELECT COUNT(*) FROM post_likes WHERE post_id = p.id) AS like_count,
       (SELECT COUNT(*) FROM post_comments WHERE post_id = p.id) AS comment_count,
       (SELECT COUNT(*) FROM post_collects WHERE post_id = p.id) AS collect_count,
       1 AS is_liked,
       (SELECT 1 FROM post_collects WHERE post_id = p.id AND user_id = ?) AS is_collected
FROM posts p
JOIN users u ON p.user_id = u.id
JOIN post_likes pl ON p.id = pl.post_id AND pl.user_id = ?
WHERE p.status = 1
ORDER BY pl.created_at DESC
LIMIT ? OFFSET ?;

-- 获取热门标签
SELECT tag, COUNT(*) AS count
FROM (
    SELECT SUBSTRING_INDEX(SUBSTRING_INDEX(t.tags, ',', n.n), ',', -1) AS tag
    FROM posts t
    JOIN (
        SELECT 1 AS n UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL
        SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL
        SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9 UNION ALL SELECT 10
    ) n ON LENGTH(REPLACE(t.tags, ',', '')) <= LENGTH(t.tags) - n.n
    WHERE t.status = 1
) tags
GROUP BY tag
ORDER BY count DESC
LIMIT ?; 