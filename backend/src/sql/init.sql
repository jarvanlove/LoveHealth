 -- 如果数据库不存在，则创建数据库
CREATE DATABASE IF NOT EXISTS love_health CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 使用数据库
USE love_health;

-- 用户表
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `username` VARCHAR(50) NOT NULL COMMENT '用户名',
  `password` VARCHAR(255) NOT NULL COMMENT '密码',
  `email` VARCHAR(100) DEFAULT NULL COMMENT '邮箱',
  `phone` VARCHAR(20) DEFAULT NULL COMMENT '手机号',
  `avatar` VARCHAR(255) DEFAULT NULL COMMENT '头像',
  `status` TINYINT(1) NOT NULL DEFAULT 1 COMMENT '状态: 0-禁用, 1-正常',
  `is_deleted` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否删除: 0-否, 1-是',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_username` (`username`),
  UNIQUE KEY `idx_email` (`email`),
  UNIQUE KEY `idx_phone` (`phone`),
  KEY `idx_is_deleted` (`is_deleted`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

-- 用户详情表
CREATE TABLE IF NOT EXISTS `user_profiles` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '详情ID',
  `user_id` INT UNSIGNED NOT NULL COMMENT '用户ID',
  `nickname` VARCHAR(50) DEFAULT NULL COMMENT '昵称',
  `gender` TINYINT(1) DEFAULT NULL COMMENT '性别: 0-女, 1-男, 2-其他',
  `birthday` DATE DEFAULT NULL COMMENT '生日',
  `height` DECIMAL(5,2) DEFAULT NULL COMMENT '身高(cm)',
  `weight` DECIMAL(5,2) DEFAULT NULL COMMENT '体重(kg)',
  `bio` TEXT DEFAULT NULL COMMENT '个人简介',
  `preference` JSON DEFAULT NULL COMMENT '饮食偏好',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_user_id` (`user_id`),
  CONSTRAINT `fk_profile_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户详情表';

-- 食材分类表
CREATE TABLE IF NOT EXISTS `ingredient_categories` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '分类ID',
  `name` VARCHAR(50) NOT NULL COMMENT '分类名称',
  `description` VARCHAR(255) DEFAULT NULL COMMENT '分类描述',
  `parent_id` INT UNSIGNED DEFAULT NULL COMMENT '父级分类ID',
  `sort_order` INT DEFAULT 0 COMMENT '排序',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_parent_id` (`parent_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='食材分类表';

-- 食材表
CREATE TABLE IF NOT EXISTS `ingredients` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '食材ID',
  `name` VARCHAR(100) NOT NULL COMMENT '食材名称',
  `category_id` INT UNSIGNED DEFAULT NULL COMMENT '分类ID',
  `description` TEXT DEFAULT NULL COMMENT '描述',
  `image` VARCHAR(255) DEFAULT NULL COMMENT '图片',
  `storage_method` TEXT DEFAULT NULL COMMENT '存储方法',
  `purchase_tips` TEXT DEFAULT NULL COMMENT '购买技巧',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_category_id` (`category_id`),
  CONSTRAINT `fk_ingredient_category` FOREIGN KEY (`category_id`) REFERENCES `ingredient_categories` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='食材表';

-- 食材营养成分表
CREATE TABLE IF NOT EXISTS `ingredient_nutrition` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '营养成分ID',
  `ingredient_id` INT UNSIGNED NOT NULL COMMENT '食材ID',
  `calories` DECIMAL(10,2) DEFAULT NULL COMMENT '热量(kcal/100g)',
  `protein` DECIMAL(10,2) DEFAULT NULL COMMENT '蛋白质(g/100g)',
  `fat` DECIMAL(10,2) DEFAULT NULL COMMENT '脂肪(g/100g)',
  `carbohydrate` DECIMAL(10,2) DEFAULT NULL COMMENT '碳水化合物(g/100g)',
  `fiber` DECIMAL(10,2) DEFAULT NULL COMMENT '膳食纤维(g/100g)',
  `vitamin` JSON DEFAULT NULL COMMENT '维生素含量',
  `mineral` JSON DEFAULT NULL COMMENT '矿物质含量',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_ingredient_id` (`ingredient_id`),
  CONSTRAINT `fk_nutrition_ingredient` FOREIGN KEY (`ingredient_id`) REFERENCES `ingredients` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='食材营养成分表';

-- 食谱表
CREATE TABLE IF NOT EXISTS `recipes` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '食谱ID',
  `title` VARCHAR(100) NOT NULL COMMENT '标题',
  `user_id` INT UNSIGNED NOT NULL COMMENT '创建用户ID',
  `description` TEXT DEFAULT NULL COMMENT '描述',
  `cover_image` VARCHAR(255) DEFAULT NULL COMMENT '封面图片',
  `cooking_time` INT DEFAULT NULL COMMENT '烹饪时间(分钟)',
  `difficulty` TINYINT(1) DEFAULT 1 COMMENT '难度: 1-简单, 2-中等, 3-困难',
  `tags` JSON DEFAULT NULL COMMENT '标签',
  `category` VARCHAR(50) DEFAULT NULL COMMENT '分类',
  `status` TINYINT(1) DEFAULT 1 COMMENT '状态: 0-草稿, 1-发布',
  `views` INT UNSIGNED DEFAULT 0 COMMENT '浏览次数',
  `likes` INT UNSIGNED DEFAULT 0 COMMENT '点赞次数',
  `collections` INT UNSIGNED DEFAULT 0 COMMENT '收藏次数',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_category` (`category`),
  CONSTRAINT `fk_recipe_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='食谱表';

-- 食谱步骤表
CREATE TABLE IF NOT EXISTS `recipe_steps` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '步骤ID',
  `recipe_id` INT UNSIGNED NOT NULL COMMENT '食谱ID',
  `step_number` INT NOT NULL COMMENT '步骤序号',
  `description` TEXT NOT NULL COMMENT '步骤描述',
  `image` VARCHAR(255) DEFAULT NULL COMMENT '步骤图片',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_recipe_id` (`recipe_id`),
  CONSTRAINT `fk_step_recipe` FOREIGN KEY (`recipe_id`) REFERENCES `recipes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='食谱步骤表';

-- 食谱食材关联表
CREATE TABLE IF NOT EXISTS `recipe_ingredients` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '关联ID',
  `recipe_id` INT UNSIGNED NOT NULL COMMENT '食谱ID',
  `ingredient_id` INT UNSIGNED NOT NULL COMMENT '食材ID',
  `amount` VARCHAR(50) DEFAULT NULL COMMENT '用量',
  `unit` VARCHAR(20) DEFAULT NULL COMMENT '单位',
  `note` VARCHAR(255) DEFAULT NULL COMMENT '备注',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_recipe_ingredient` (`recipe_id`,`ingredient_id`),
  KEY `idx_ingredient_id` (`ingredient_id`),
  CONSTRAINT `fk_ri_recipe` FOREIGN KEY (`recipe_id`) REFERENCES `recipes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_ri_ingredient` FOREIGN KEY (`ingredient_id`) REFERENCES `ingredients` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='食谱食材关联表';

-- 社区帖子表
CREATE TABLE IF NOT EXISTS `posts` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '帖子ID',
  `user_id` INT UNSIGNED NOT NULL COMMENT '用户ID',
  `title` VARCHAR(100) NOT NULL COMMENT '标题',
  `content` TEXT NOT NULL COMMENT '内容',
  `images` JSON DEFAULT NULL COMMENT '图片列表',
  `topic` VARCHAR(50) DEFAULT NULL COMMENT '话题',
  `location` VARCHAR(100) DEFAULT NULL COMMENT '位置',
  `status` TINYINT(1) DEFAULT 1 COMMENT '状态: 0-草稿, 1-发布',
  `views` INT UNSIGNED DEFAULT 0 COMMENT '浏览次数',
  `likes` INT UNSIGNED DEFAULT 0 COMMENT '点赞次数',
  `comments` INT UNSIGNED DEFAULT 0 COMMENT '评论次数',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_topic` (`topic`),
  CONSTRAINT `fk_post_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='社区帖子表';

-- 评论表
CREATE TABLE IF NOT EXISTS `comments` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '评论ID',
  `user_id` INT UNSIGNED NOT NULL COMMENT '用户ID',
  `content` TEXT NOT NULL COMMENT '内容',
  `target_type` VARCHAR(20) NOT NULL COMMENT '目标类型: post, recipe, comment',
  `target_id` INT UNSIGNED NOT NULL COMMENT '目标ID',
  `parent_id` INT UNSIGNED DEFAULT NULL COMMENT '父评论ID',
  `likes` INT UNSIGNED DEFAULT 0 COMMENT '点赞次数',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_target` (`target_type`,`target_id`),
  KEY `idx_parent_id` (`parent_id`),
  CONSTRAINT `fk_comment_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='评论表';

-- 收藏表
CREATE TABLE IF NOT EXISTS `collections` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '收藏ID',
  `user_id` INT UNSIGNED NOT NULL COMMENT '用户ID',
  `target_type` VARCHAR(20) NOT NULL COMMENT '目标类型: post, recipe, ingredient',
  `target_id` INT UNSIGNED NOT NULL COMMENT '目标ID',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_user_target` (`user_id`,`target_type`,`target_id`),
  KEY `idx_target` (`target_type`,`target_id`),
  CONSTRAINT `fk_collection_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='收藏表';

-- 点赞表
CREATE TABLE IF NOT EXISTS `likes` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '点赞ID',
  `user_id` INT UNSIGNED NOT NULL COMMENT '用户ID',
  `target_type` VARCHAR(20) NOT NULL COMMENT '目标类型: post, recipe, comment',
  `target_id` INT UNSIGNED NOT NULL COMMENT '目标ID',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_user_target` (`user_id`,`target_type`,`target_id`),
  KEY `idx_target` (`target_type`,`target_id`),
  CONSTRAINT `fk_like_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='点赞表';

-- 用户关注表
CREATE TABLE IF NOT EXISTS `user_follows` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '关注ID',
  `user_id` INT UNSIGNED NOT NULL COMMENT '用户ID',
  `followed_id` INT UNSIGNED NOT NULL COMMENT '被关注用户ID',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_user_followed` (`user_id`,`followed_id`),
  KEY `idx_followed_id` (`followed_id`),
  CONSTRAINT `fk_follow_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_follow_followed` FOREIGN KEY (`followed_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户关注表';

-- 消息表
CREATE TABLE IF NOT EXISTS `messages` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '消息ID',
  `from_id` INT UNSIGNED DEFAULT NULL COMMENT '发送者ID',
  `to_id` INT UNSIGNED NOT NULL COMMENT '接收者ID',
  `type` VARCHAR(20) NOT NULL COMMENT '消息类型: system, like, comment, follow',
  `content` TEXT DEFAULT NULL COMMENT '消息内容',
  `target_type` VARCHAR(20) DEFAULT NULL COMMENT '目标类型',
  `target_id` INT UNSIGNED DEFAULT NULL COMMENT '目标ID',
  `is_read` TINYINT(1) DEFAULT 0 COMMENT '是否已读: 0-未读, 1-已读',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_to_id` (`to_id`),
  KEY `idx_from_id` (`from_id`),
  CONSTRAINT `fk_message_from` FOREIGN KEY (`from_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_message_to` FOREIGN KEY (`to_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='消息表';

-- AI对话记录表
CREATE TABLE IF NOT EXISTS `ai_chat_records` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '记录ID',
  `user_id` INT UNSIGNED NOT NULL COMMENT '用户ID',
  `session_id` VARCHAR(50) DEFAULT NULL COMMENT '会话ID',
  `query` TEXT NOT NULL COMMENT '用户问题',
  `response` TEXT NOT NULL COMMENT 'AI回答',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_session_id` (`session_id`),
  CONSTRAINT `fk_chat_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='AI对话记录表';


-- 以下是健康模块相关表 --

-- 用户健康数据表
CREATE TABLE IF NOT EXISTS `user_health_data` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '记录ID',
  `user_id` INT UNSIGNED NOT NULL COMMENT '用户ID',
  `gender` TINYINT(1) DEFAULT NULL COMMENT '性别: 0-女, 1-男, 2-其他',
  `birth_date` DATE DEFAULT NULL COMMENT '出生日期',
  `height` DECIMAL(5,2) DEFAULT NULL COMMENT '身高(cm)',
  `weight` DECIMAL(5,2) DEFAULT NULL COMMENT '体重(kg)',
  `bmi` DECIMAL(5,2) DEFAULT NULL COMMENT 'BMI指数',
  `health_goals` JSON DEFAULT NULL COMMENT '健康目标',
  `health_concerns` JSON DEFAULT NULL COMMENT '健康问题',
  `activity_level` TINYINT(1) DEFAULT 1 COMMENT '活动水平: 1-低, 2-中, 3-高',
  `dietary_preferences` JSON DEFAULT NULL COMMENT '饮食偏好',
  `allergies` JSON DEFAULT NULL COMMENT '过敏源',
  `sleep_hours` DECIMAL(3,1) DEFAULT NULL COMMENT '平均睡眠时间(小时)',
  `step_target` INT DEFAULT 10000 COMMENT '每日步数目标',
  `water_target` INT DEFAULT 2000 COMMENT '每日饮水目标(ml)',
  `calorie_target` INT DEFAULT 2000 COMMENT '每日卡路里目标',
  `is_deleted` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否删除: 0-否, 1-是',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_user_id` (`user_id`),
  KEY `idx_is_deleted` (`is_deleted`),
  CONSTRAINT `fk_uhealth_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户健康数据表';

-- 体重记录表
CREATE TABLE IF NOT EXISTS `weight_records` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '记录ID',
  `user_id` INT UNSIGNED NOT NULL COMMENT '用户ID',
  `weight` DECIMAL(5,2) NOT NULL COMMENT '体重(kg)',
  `bmi` DECIMAL(5,2) DEFAULT NULL COMMENT 'BMI指数',
  `note` VARCHAR(255) DEFAULT NULL COMMENT '备注',
  `is_deleted` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否删除: 0-否, 1-是',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '记录时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_created_at` (`created_at`),
  KEY `idx_is_deleted` (`is_deleted`),
  CONSTRAINT `fk_weight_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='体重记录表';

-- 每日活动记录表
CREATE TABLE IF NOT EXISTS `daily_activities` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '记录ID',
  `user_id` INT UNSIGNED NOT NULL COMMENT '用户ID',
  `date` DATE NOT NULL COMMENT '日期',
  `steps` INT DEFAULT 0 COMMENT '步数',
  `distance` DECIMAL(5,2) DEFAULT 0 COMMENT '距离(km)',
  `calories_burned` INT DEFAULT 0 COMMENT '消耗卡路里',
  `active_minutes` INT DEFAULT 0 COMMENT '活动时间(分钟)',
  `sleep_hours` DECIMAL(3,1) DEFAULT NULL COMMENT '睡眠时间(小时)',
  `water_intake` INT DEFAULT 0 COMMENT '饮水量(ml)',
  `heart_rate` INT DEFAULT NULL COMMENT '平均心率',
  `is_deleted` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否删除: 0-否, 1-是',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_user_date` (`user_id`, `date`),
  KEY `idx_date` (`date`),
  KEY `idx_is_deleted` (`is_deleted`),
  CONSTRAINT `fk_activity_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='每日活动记录表';

-- 饮食记录表
CREATE TABLE IF NOT EXISTS `meal_records` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '记录ID',
  `user_id` INT UNSIGNED NOT NULL COMMENT '用户ID',
  `meal_type` VARCHAR(20) NOT NULL COMMENT '餐食类型: breakfast, lunch, dinner, snack',
  `meal_date` DATETIME NOT NULL COMMENT '用餐时间',
  `food_items` JSON NOT NULL COMMENT '食物项目',
  `calories` INT DEFAULT 0 COMMENT '卡路里',
  `protein` DECIMAL(5,2) DEFAULT 0 COMMENT '蛋白质(g)',
  `carbs` DECIMAL(5,2) DEFAULT 0 COMMENT '碳水化合物(g)',
  `fat` DECIMAL(5,2) DEFAULT 0 COMMENT '脂肪(g)',
  `fiber` DECIMAL(5,2) DEFAULT 0 COMMENT '膳食纤维(g)',
  `sugar` DECIMAL(5,2) DEFAULT 0 COMMENT '糖(g)',
  `sodium` DECIMAL(5,2) DEFAULT 0 COMMENT '钠(mg)',
  `notes` TEXT DEFAULT NULL COMMENT '备注',
  `image_url` VARCHAR(255) DEFAULT NULL COMMENT '图片URL',
  `is_deleted` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否删除: 0-否, 1-是',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_meal_date` (`meal_date`),
  KEY `idx_meal_type` (`meal_type`),
  KEY `idx_is_deleted` (`is_deleted`),
  CONSTRAINT `fk_meal_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='饮食记录表';

-- 健康指标记录表
CREATE TABLE IF NOT EXISTS `health_metrics` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '记录ID',
  `user_id` INT UNSIGNED NOT NULL COMMENT '用户ID',
  `metric_date` DATE NOT NULL COMMENT '记录日期',
  `blood_pressure_sys` INT DEFAULT NULL COMMENT '收缩压(mmHg)',
  `blood_pressure_dia` INT DEFAULT NULL COMMENT '舒张压(mmHg)',
  `heart_rate` INT DEFAULT NULL COMMENT '心率(bpm)',
  `blood_glucose` DECIMAL(5,2) DEFAULT NULL COMMENT '血糖(mmol/L)',
  `cholesterol_total` DECIMAL(5,2) DEFAULT NULL COMMENT '总胆固醇(mmol/L)',
  `cholesterol_hdl` DECIMAL(5,2) DEFAULT NULL COMMENT '高密度脂蛋白(mmol/L)',
  `cholesterol_ldl` DECIMAL(5,2) DEFAULT NULL COMMENT '低密度脂蛋白(mmol/L)',
  `triglycerides` DECIMAL(5,2) DEFAULT NULL COMMENT '甘油三酯(mmol/L)',
  `oxygen_level` DECIMAL(5,2) DEFAULT NULL COMMENT '血氧水平(%)',
  `notes` TEXT DEFAULT NULL COMMENT '备注',
  `is_deleted` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否删除: 0-否, 1-是',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_metric_date` (`metric_date`),
  KEY `idx_is_deleted` (`is_deleted`),
  CONSTRAINT `fk_metrics_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='健康指标记录表';

-- 健康目标表
CREATE TABLE IF NOT EXISTS `health_goals` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '目标ID',
  `user_id` INT UNSIGNED NOT NULL COMMENT '用户ID',
  `goal_type` VARCHAR(50) NOT NULL COMMENT '目标类型: weight, steps, water, nutrition等',
  `target_value` DECIMAL(10,2) NOT NULL COMMENT '目标值',
  `start_date` DATE NOT NULL COMMENT '开始日期',
  `target_date` DATE NOT NULL COMMENT '目标日期',
  `current_value` DECIMAL(10,2) DEFAULT NULL COMMENT '当前值',
  `status` VARCHAR(20) NOT NULL DEFAULT 'in_progress' COMMENT '状态: not_started, in_progress, completed, failed',
  `note` TEXT DEFAULT NULL COMMENT '备注',
  `is_deleted` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否删除: 0-否, 1-是',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_goal_type` (`goal_type`),
  KEY `idx_status` (`status`),
  KEY `idx_is_deleted` (`is_deleted`),
  CONSTRAINT `fk_goal_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='健康目标表';


-- 插入初始管理员用户 (密码: admin123)
INSERT INTO `users` (`username`, `password`, `email`, `status`)
VALUES ('admin', '$2a$10$X7aPRV1XN6bBQx8y1oGjMeiR0pLfpL5ZrIlJGoIbi/WfO8T3Dgj9i', 'admin@lovehealth.com', 1);

-- 插入初始食材分类
INSERT INTO `ingredient_categories` (`name`, `description`, `parent_id`, `sort_order`)
VALUES 
('蔬菜水果', '各种新鲜蔬菜和水果', NULL, 1),
('肉禽蛋', '各种肉类、禽类和蛋类', NULL, 2),
('水产海鲜', '各种鱼类和海鲜', NULL, 3),
('米面杂粮', '各种米、面和杂粮', NULL, 4),
('调味品', '各种调味料和香料', NULL, 5),
('叶菜类', '各种绿叶蔬菜', 1, 1),
('根茎类', '各种根茎类蔬菜', 1, 2),
('瓜果类', '各种瓜果类蔬菜', 1, 3),
('浆果类', '各种浆果', 1, 4),
('热带水果', '各种热带水果', 1, 5);