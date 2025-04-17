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