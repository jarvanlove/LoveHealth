-- 健康知识相关SQL语句

-- 添加健康知识文章
INSERT INTO health_articles (user_id, title, summary, content, cover_image, 
                            category, tags, read_time, status, is_recommended)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?);

-- 获取最后插入的文章ID
SELECT LAST_INSERT_ID() AS article_id;

-- 获取健康知识文章详情
SELECT ha.id, ha.user_id, ha.title, ha.summary, ha.content, ha.cover_image, 
       ha.category, ha.tags, ha.read_time, ha.views, ha.created_at, ha.updated_at,
       ha.status, ha.is_recommended,
       u.username, u.nickname, u.avatar,
       (SELECT COUNT(*) FROM article_likes WHERE article_id = ha.id) AS like_count,
       (SELECT COUNT(*) FROM article_collections WHERE article_id = ha.id) AS collection_count,
       (SELECT COUNT(*) FROM article_comments WHERE article_id = ha.id) AS comment_count,
       (SELECT 1 FROM article_likes WHERE article_id = ha.id AND user_id = ?) AS is_liked,
       (SELECT 1 FROM article_collections WHERE article_id = ha.id AND user_id = ?) AS is_collected
FROM health_articles ha
JOIN users u ON ha.user_id = u.id
WHERE ha.id = ? AND ha.status = 1;

-- 增加文章浏览次数
UPDATE health_articles
SET views = views + 1
WHERE id = ? AND status = 1;

-- 获取健康知识文章列表（带分页）
SELECT ha.id, ha.user_id, ha.title, ha.summary, ha.cover_image, 
       ha.category, ha.tags, ha.read_time, ha.views, ha.created_at, ha.is_recommended,
       u.username, u.nickname, u.avatar,
       (SELECT COUNT(*) FROM article_likes WHERE article_id = ha.id) AS like_count,
       (SELECT COUNT(*) FROM article_collections WHERE article_id = ha.id) AS collection_count,
       (SELECT COUNT(*) FROM article_comments WHERE article_id = ha.id) AS comment_count,
       (SELECT 1 FROM article_likes WHERE article_id = ha.id AND user_id = ?) AS is_liked,
       (SELECT 1 FROM article_collections WHERE article_id = ha.id AND user_id = ?) AS is_collected
FROM health_articles ha
JOIN users u ON ha.user_id = u.id
WHERE ha.status = 1
ORDER BY ha.created_at DESC
LIMIT ? OFFSET ?;

-- 获取推荐健康知识文章列表
SELECT ha.id, ha.user_id, ha.title, ha.summary, ha.cover_image, 
       ha.category, ha.tags, ha.read_time, ha.views, ha.created_at, ha.is_recommended,
       u.username, u.nickname, u.avatar,
       (SELECT COUNT(*) FROM article_likes WHERE article_id = ha.id) AS like_count,
       (SELECT COUNT(*) FROM article_collections WHERE article_id = ha.id) AS collection_count,
       (SELECT COUNT(*) FROM article_comments WHERE article_id = ha.id) AS comment_count,
       (SELECT 1 FROM article_likes WHERE article_id = ha.id AND user_id = ?) AS is_liked,
       (SELECT 1 FROM article_collections WHERE article_id = ha.id AND user_id = ?) AS is_collected
FROM health_articles ha
JOIN users u ON ha.user_id = u.id
WHERE ha.status = 1 AND ha.is_recommended = 1
ORDER BY ha.created_at DESC
LIMIT ? OFFSET ?;

-- 根据分类获取健康知识文章列表
SELECT ha.id, ha.user_id, ha.title, ha.summary, ha.cover_image, 
       ha.category, ha.tags, ha.read_time, ha.views, ha.created_at, ha.is_recommended,
       u.username, u.nickname, u.avatar,
       (SELECT COUNT(*) FROM article_likes WHERE article_id = ha.id) AS like_count,
       (SELECT COUNT(*) FROM article_collections WHERE article_id = ha.id) AS collection_count,
       (SELECT COUNT(*) FROM article_comments WHERE article_id = ha.id) AS comment_count,
       (SELECT 1 FROM article_likes WHERE article_id = ha.id AND user_id = ?) AS is_liked,
       (SELECT 1 FROM article_collections WHERE article_id = ha.id AND user_id = ?) AS is_collected
FROM health_articles ha
JOIN users u ON ha.user_id = u.id
WHERE ha.status = 1 AND ha.category = ?
ORDER BY ha.created_at DESC
LIMIT ? OFFSET ?;

-- 根据标签获取健康知识文章列表
SELECT ha.id, ha.user_id, ha.title, ha.summary, ha.cover_image, 
       ha.category, ha.tags, ha.read_time, ha.views, ha.created_at, ha.is_recommended,
       u.username, u.nickname, u.avatar,
       (SELECT COUNT(*) FROM article_likes WHERE article_id = ha.id) AS like_count,
       (SELECT COUNT(*) FROM article_collections WHERE article_id = ha.id) AS collection_count,
       (SELECT COUNT(*) FROM article_comments WHERE article_id = ha.id) AS comment_count,
       (SELECT 1 FROM article_likes WHERE article_id = ha.id AND user_id = ?) AS is_liked,
       (SELECT 1 FROM article_collections WHERE article_id = ha.id AND user_id = ?) AS is_collected
FROM health_articles ha
JOIN users u ON ha.user_id = u.id
WHERE ha.status = 1 AND ha.tags LIKE ?
ORDER BY ha.created_at DESC
LIMIT ? OFFSET ?;

-- 搜索健康知识文章
SELECT ha.id, ha.user_id, ha.title, ha.summary, ha.cover_image, 
       ha.category, ha.tags, ha.read_time, ha.views, ha.created_at, ha.is_recommended,
       u.username, u.nickname, u.avatar,
       (SELECT COUNT(*) FROM article_likes WHERE article_id = ha.id) AS like_count,
       (SELECT COUNT(*) FROM article_collections WHERE article_id = ha.id) AS collection_count,
       (SELECT COUNT(*) FROM article_comments WHERE article_id = ha.id) AS comment_count,
       (SELECT 1 FROM article_likes WHERE article_id = ha.id AND user_id = ?) AS is_liked,
       (SELECT 1 FROM article_collections WHERE article_id = ha.id AND user_id = ?) AS is_collected
FROM health_articles ha
JOIN users u ON ha.user_id = u.id
WHERE ha.status = 1 AND (ha.title LIKE ? OR ha.summary LIKE ? OR ha.content LIKE ? OR ha.tags LIKE ?)
ORDER BY ha.created_at DESC
LIMIT ? OFFSET ?;

-- 获取用户文章列表
SELECT ha.id, ha.user_id, ha.title, ha.summary, ha.cover_image, 
       ha.category, ha.tags, ha.read_time, ha.views, ha.created_at, ha.status, ha.is_recommended,
       u.username, u.nickname, u.avatar,
       (SELECT COUNT(*) FROM article_likes WHERE article_id = ha.id) AS like_count,
       (SELECT COUNT(*) FROM article_collections WHERE article_id = ha.id) AS collection_count,
       (SELECT COUNT(*) FROM article_comments WHERE article_id = ha.id) AS comment_count,
       (SELECT 1 FROM article_likes WHERE article_id = ha.id AND user_id = ?) AS is_liked,
       (SELECT 1 FROM article_collections WHERE article_id = ha.id AND user_id = ?) AS is_collected
FROM health_articles ha
JOIN users u ON ha.user_id = u.id
WHERE ha.user_id = ?
ORDER BY ha.created_at DESC
LIMIT ? OFFSET ?;

-- 获取用户收藏的文章列表
SELECT ha.id, ha.user_id, ha.title, ha.summary, ha.cover_image, 
       ha.category, ha.tags, ha.read_time, ha.views, ha.created_at, ha.is_recommended,
       u.username, u.nickname, u.avatar,
       (SELECT COUNT(*) FROM article_likes WHERE article_id = ha.id) AS like_count,
       (SELECT COUNT(*) FROM article_collections WHERE article_id = ha.id) AS collection_count,
       (SELECT COUNT(*) FROM article_comments WHERE article_id = ha.id) AS comment_count,
       (SELECT 1 FROM article_likes WHERE article_id = ha.id AND user_id = ?) AS is_liked,
       1 AS is_collected,
       ac.created_at AS collection_time
FROM health_articles ha
JOIN users u ON ha.user_id = u.id
JOIN article_collections ac ON ha.id = ac.article_id
WHERE ha.status = 1 AND ac.user_id = ?
ORDER BY ac.created_at DESC
LIMIT ? OFFSET ?;

-- 点赞文章
INSERT INTO article_likes (article_id, user_id)
VALUES (?, ?);

-- 取消点赞文章
DELETE FROM article_likes
WHERE article_id = ? AND user_id = ?;

-- 收藏文章
INSERT INTO article_collections (article_id, user_id)
VALUES (?, ?);

-- 取消收藏文章
DELETE FROM article_collections
WHERE article_id = ? AND user_id = ?;

-- 添加文章评论
INSERT INTO article_comments (article_id, user_id, content, parent_id)
VALUES (?, ?, ?, ?);

-- 获取最后插入的评论ID
SELECT LAST_INSERT_ID() AS comment_id;

-- 获取文章评论
SELECT ac.id, ac.article_id, ac.user_id, ac.content, ac.parent_id, ac.created_at,
       u.username, u.nickname, u.avatar,
       (SELECT COUNT(*) FROM article_comment_likes WHERE comment_id = ac.id) AS like_count,
       (SELECT 1 FROM article_comment_likes WHERE comment_id = ac.id AND user_id = ?) AS is_liked
FROM article_comments ac
JOIN users u ON ac.user_id = u.id
WHERE ac.article_id = ? AND ac.parent_id IS NULL
ORDER BY ac.created_at DESC
LIMIT ? OFFSET ?;

-- 获取评论的回复
SELECT ac.id, ac.article_id, ac.user_id, ac.content, ac.parent_id, ac.created_at,
       u.username, u.nickname, u.avatar,
       (SELECT COUNT(*) FROM article_comment_likes WHERE comment_id = ac.id) AS like_count,
       (SELECT 1 FROM article_comment_likes WHERE comment_id = ac.id AND user_id = ?) AS is_liked,
       (SELECT nickname FROM users WHERE id = ac.reply_to_user_id) AS reply_to_nickname
FROM article_comments ac
JOIN users u ON ac.user_id = u.id
WHERE ac.parent_id = ?
ORDER BY ac.created_at
LIMIT ? OFFSET ?;

-- 点赞评论
INSERT INTO article_comment_likes (comment_id, user_id)
VALUES (?, ?);

-- 取消点赞评论
DELETE FROM article_comment_likes
WHERE comment_id = ? AND user_id = ?;

-- 更新健康知识文章
UPDATE health_articles
SET title = ?, summary = ?, content = ?, cover_image = ?, 
    category = ?, tags = ?, read_time = ?, updated_at = CURRENT_TIMESTAMP
WHERE id = ? AND user_id = ?;

-- 删除健康知识文章（软删除）
UPDATE health_articles
SET status = 0, updated_at = CURRENT_TIMESTAMP
WHERE id = ? AND user_id = ?;

-- 获取健康知识分类列表
SELECT DISTINCT category, COUNT(*) AS article_count
FROM health_articles
WHERE status = 1
GROUP BY category
ORDER BY article_count DESC;

-- 获取热门健康知识标签
SELECT DISTINCT SUBSTRING_INDEX(SUBSTRING_INDEX(tags, ',', n.digit+1), ',', -1) AS tag,
       COUNT(*) AS tag_count
FROM health_articles ha
JOIN (
    SELECT 0 AS digit UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL
    SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL
    SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9
) n
WHERE ha.status = 1
AND LENGTH(ha.tags) - LENGTH(REPLACE(ha.tags, ',', '')) >= n.digit
GROUP BY tag
ORDER BY tag_count DESC
LIMIT 20;

-- 设置/取消推荐文章
UPDATE health_articles
SET is_recommended = ?, updated_at = CURRENT_TIMESTAMP
WHERE id = ?;

-- 根据用户健康数据和偏好推荐文章
SELECT ha.id, ha.user_id, ha.title, ha.summary, ha.cover_image, 
       ha.category, ha.tags, ha.read_time, ha.views, ha.created_at, ha.is_recommended,
       u.username, u.nickname, u.avatar,
       (SELECT COUNT(*) FROM article_likes WHERE article_id = ha.id) AS like_count,
       (SELECT COUNT(*) FROM article_collections WHERE article_id = ha.id) AS collection_count,
       (SELECT COUNT(*) FROM article_comments WHERE article_id = ha.id) AS comment_count,
       (SELECT 1 FROM article_likes WHERE article_id = ha.id AND user_id = ?) AS is_liked,
       (SELECT 1 FROM article_collections WHERE article_id = ha.id AND user_id = ?) AS is_collected
FROM health_articles ha
JOIN users u ON ha.user_id = u.id
JOIN user_health_data uhd ON uhd.user_id = ?
WHERE ha.status = 1 
AND (
    ha.tags LIKE CONCAT('%', REPLACE(uhd.health_goals, ',', '%'), '%') OR
    ha.tags LIKE CONCAT('%', REPLACE(uhd.health_concerns, ',', '%'), '%')
)
ORDER BY 
    CASE WHEN ha.is_recommended = 1 THEN 0 ELSE 1 END,
    ha.created_at DESC
LIMIT ? OFFSET ?; 