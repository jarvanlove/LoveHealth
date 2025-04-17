-- 用户健康数据相关SQL语句

-- 添加或更新用户基本健康数据
INSERT INTO user_health_data (
    user_id, gender, birth_date, height, weight, bmi,
    health_goals, health_concerns, activity_level, dietary_preferences,
    allergies, sleep_hours, step_target, water_target, calorie_target
)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
ON DUPLICATE KEY UPDATE
    gender = VALUES(gender),
    birth_date = VALUES(birth_date),
    height = VALUES(height),
    weight = VALUES(weight),
    bmi = VALUES(bmi),
    health_goals = VALUES(health_goals),
    health_concerns = VALUES(health_concerns),
    activity_level = VALUES(activity_level),
    dietary_preferences = VALUES(dietary_preferences),
    allergies = VALUES(allergies),
    sleep_hours = VALUES(sleep_hours),
    step_target = VALUES(step_target),
    water_target = VALUES(water_target),
    calorie_target = VALUES(calorie_target),
    updated_at = CURRENT_TIMESTAMP;

-- 获取用户健康数据
SELECT 
    uhd.user_id, uhd.gender, uhd.birth_date, uhd.height, uhd.weight, uhd.bmi,
    uhd.health_goals, uhd.health_concerns, uhd.activity_level, 
    uhd.dietary_preferences, uhd.allergies, uhd.sleep_hours,
    uhd.step_target, uhd.water_target, uhd.calorie_target,
    uhd.created_at, uhd.updated_at,
    TIMESTAMPDIFF(YEAR, uhd.birth_date, CURDATE()) AS age
FROM user_health_data uhd
WHERE uhd.user_id = ?;

-- 添加用户体重记录
INSERT INTO weight_records (user_id, weight, bmi, note)
VALUES (?, ?, ?, ?);

-- 获取用户体重历史记录
SELECT id, user_id, weight, bmi, note, created_at
FROM weight_records
WHERE user_id = ?
ORDER BY created_at DESC
LIMIT ? OFFSET ?;

-- 获取用户最近一周体重变化
SELECT 
    DATE(created_at) AS record_date,
    weight,
    bmi
FROM weight_records
WHERE user_id = ? 
AND created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
ORDER BY created_at;

-- 获取用户最近一个月体重变化
SELECT 
    DATE(created_at) AS record_date,
    weight,
    bmi
FROM weight_records
WHERE user_id = ? 
AND created_at >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH)
ORDER BY created_at;

-- 获取用户体重变化统计
SELECT 
    MIN(weight) AS min_weight,
    MAX(weight) AS max_weight,
    AVG(weight) AS avg_weight,
    (
        SELECT weight 
        FROM weight_records 
        WHERE user_id = ? 
        ORDER BY created_at DESC 
        LIMIT 1
    ) AS current_weight,
    (
        SELECT weight 
        FROM weight_records 
        WHERE user_id = ? 
        ORDER BY created_at 
        LIMIT 1
    ) AS initial_weight,
    (
        (SELECT weight FROM weight_records WHERE user_id = ? ORDER BY created_at DESC LIMIT 1) - 
        (SELECT weight FROM weight_records WHERE user_id = ? ORDER BY created_at LIMIT 1)
    ) AS weight_change
FROM weight_records
WHERE user_id = ?;

-- 添加用户每日活动记录
INSERT INTO daily_activities (
    user_id, date, steps, distance, calories_burned, 
    active_minutes, sleep_hours, water_intake, heart_rate
)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
ON DUPLICATE KEY UPDATE
    steps = VALUES(steps),
    distance = VALUES(distance),
    calories_burned = VALUES(calories_burned),
    active_minutes = VALUES(active_minutes),
    sleep_hours = VALUES(sleep_hours),
    water_intake = VALUES(water_intake),
    heart_rate = VALUES(heart_rate),
    updated_at = CURRENT_TIMESTAMP;

-- 获取用户每日活动记录
SELECT 
    id, user_id, date, steps, distance, calories_burned, 
    active_minutes, sleep_hours, water_intake, heart_rate,
    created_at, updated_at
FROM daily_activities
WHERE user_id = ? AND date = ?;

-- 获取用户最近7天活动记录
SELECT 
    date, steps, distance, calories_burned, 
    active_minutes, sleep_hours, water_intake, heart_rate
FROM daily_activities
WHERE user_id = ? 
AND date BETWEEN DATE_SUB(CURDATE(), INTERVAL 6 DAY) AND CURDATE()
ORDER BY date;

-- 获取用户最近30天活动记录
SELECT 
    date, steps, distance, calories_burned, 
    active_minutes, sleep_hours, water_intake, heart_rate
FROM daily_activities
WHERE user_id = ? 
AND date BETWEEN DATE_SUB(CURDATE(), INTERVAL 29 DAY) AND CURDATE()
ORDER BY date;

-- 获取用户活动统计数据
SELECT 
    AVG(steps) AS avg_steps,
    AVG(distance) AS avg_distance,
    AVG(calories_burned) AS avg_calories_burned,
    AVG(active_minutes) AS avg_active_minutes,
    AVG(sleep_hours) AS avg_sleep_hours,
    AVG(water_intake) AS avg_water_intake,
    AVG(heart_rate) AS avg_heart_rate,
    MAX(steps) AS max_steps,
    MAX(distance) AS max_distance,
    MAX(calories_burned) AS max_calories_burned,
    MAX(active_minutes) AS max_active_minutes,
    SUM(steps) AS total_steps,
    SUM(distance) AS total_distance,
    SUM(calories_burned) AS total_calories_burned,
    SUM(active_minutes) AS total_active_minutes,
    COUNT(*) AS record_count
FROM daily_activities
WHERE user_id = ?
AND date BETWEEN ? AND ?;

-- 添加用户饮食记录
INSERT INTO meal_records (
    user_id, meal_type, meal_date, food_items, calories, protein, carbs, fat, 
    fiber, sugar, sodium, notes, image_url
)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);

-- 获取最后插入的饮食记录ID
SELECT LAST_INSERT_ID() AS meal_id;

-- 获取用户饮食记录列表
SELECT 
    id, user_id, meal_type, meal_date, food_items, 
    calories, protein, carbs, fat, fiber, sugar, sodium, 
    notes, image_url, created_at
FROM meal_records
WHERE user_id = ? 
AND DATE(meal_date) = ?
ORDER BY meal_date DESC;

-- 获取用户最近的饮食记录
SELECT 
    id, user_id, meal_type, meal_date, food_items, 
    calories, protein, carbs, fat, fiber, sugar, sodium, 
    notes, image_url, created_at
FROM meal_records
WHERE user_id = ?
ORDER BY meal_date DESC
LIMIT ? OFFSET ?;

-- 获取用户每日营养摄入统计
SELECT 
    DATE(meal_date) AS record_date,
    SUM(calories) AS total_calories,
    SUM(protein) AS total_protein,
    SUM(carbs) AS total_carbs,
    SUM(fat) AS total_fat,
    SUM(fiber) AS total_fiber,
    SUM(sugar) AS total_sugar,
    SUM(sodium) AS total_sodium,
    COUNT(*) AS meal_count
FROM meal_records
WHERE user_id = ?
AND meal_date BETWEEN ? AND ?
GROUP BY DATE(meal_date)
ORDER BY record_date;

-- 添加用户健康指标记录
INSERT INTO health_metrics (
    user_id, metric_date, blood_pressure_sys, blood_pressure_dia, 
    heart_rate, blood_glucose, cholesterol_total, cholesterol_hdl, 
    cholesterol_ldl, triglycerides, oxygen_level, notes
)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);

-- 获取用户健康指标记录
SELECT 
    id, user_id, metric_date, blood_pressure_sys, blood_pressure_dia, 
    heart_rate, blood_glucose, cholesterol_total, cholesterol_hdl, 
    cholesterol_ldl, triglycerides, oxygen_level, notes, created_at
FROM health_metrics
WHERE user_id = ?
ORDER BY metric_date DESC
LIMIT ? OFFSET ?;

-- 获取用户最近的健康指标
SELECT 
    id, user_id, metric_date, blood_pressure_sys, blood_pressure_dia, 
    heart_rate, blood_glucose, cholesterol_total, cholesterol_hdl, 
    cholesterol_ldl, triglycerides, oxygen_level, notes, created_at
FROM health_metrics
WHERE user_id = ?
ORDER BY metric_date DESC
LIMIT 1;

-- 添加用户健康目标
INSERT INTO health_goals (
    user_id, goal_type, target_value, start_date, target_date, 
    current_value, status, note
)
VALUES (?, ?, ?, ?, ?, ?, 'in_progress', ?);

-- 获取用户健康目标列表
SELECT 
    id, user_id, goal_type, target_value, start_date, target_date, 
    current_value, status, note, created_at, updated_at
FROM health_goals
WHERE user_id = ?
ORDER BY created_at DESC;

-- 更新用户健康目标进度
UPDATE health_goals
SET current_value = ?, 
    status = ?,
    updated_at = CURRENT_TIMESTAMP
WHERE id = ? AND user_id = ?;

-- 获取用户活动记录统计（按周）
SELECT 
    YEARWEEK(date, 1) AS year_week,
    MIN(date) AS week_start,
    MAX(date) AS week_end,
    AVG(steps) AS avg_steps,
    SUM(steps) AS total_steps,
    AVG(distance) AS avg_distance,
    SUM(distance) AS total_distance,
    AVG(calories_burned) AS avg_calories_burned,
    SUM(calories_burned) AS total_calories_burned,
    AVG(active_minutes) AS avg_active_minutes,
    SUM(active_minutes) AS total_active_minutes,
    AVG(sleep_hours) AS avg_sleep_hours,
    AVG(water_intake) AS avg_water_intake,
    COUNT(*) AS record_count
FROM daily_activities
WHERE user_id = ?
AND date BETWEEN DATE_SUB(CURDATE(), INTERVAL 8 WEEK) AND CURDATE()
GROUP BY YEARWEEK(date, 1)
ORDER BY year_week DESC;

-- 获取用户活动记录统计（按月）
SELECT 
    DATE_FORMAT(date, '%Y-%m') AS year_month,
    MIN(date) AS month_start,
    MAX(date) AS month_end,
    AVG(steps) AS avg_steps,
    SUM(steps) AS total_steps,
    AVG(distance) AS avg_distance,
    SUM(distance) AS total_distance,
    AVG(calories_burned) AS avg_calories_burned,
    SUM(calories_burned) AS total_calories_burned,
    AVG(active_minutes) AS avg_active_minutes,
    SUM(active_minutes) AS total_active_minutes,
    AVG(sleep_hours) AS avg_sleep_hours,
    AVG(water_intake) AS avg_water_intake,
    COUNT(*) AS record_count
FROM daily_activities
WHERE user_id = ?
AND date BETWEEN DATE_SUB(CURDATE(), INTERVAL 12 MONTH) AND CURDATE()
GROUP BY DATE_FORMAT(date, '%Y-%m')
ORDER BY year_month DESC; 