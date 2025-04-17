-- 食材相关SQL语句

-- 添加食材分类
INSERT INTO ingredient_categories (name, description, icon)
VALUES (?, ?, ?);

-- 查询食材分类列表
SELECT id, name, description, icon, created_at
FROM ingredient_categories
ORDER BY id ASC;

-- 根据ID查询食材分类
SELECT id, name, description, icon, created_at
FROM ingredient_categories
WHERE id = ?;

-- 更新食材分类
UPDATE ingredient_categories
SET name = ?, description = ?, icon = ?, updated_at = CURRENT_TIMESTAMP
WHERE id = ?;

-- 删除食材分类
DELETE FROM ingredient_categories
WHERE id = ?;

-- 添加食材
INSERT INTO ingredients (name, description, image, category_id, status, properties, alias)
VALUES (?, ?, ?, ?, ?, ?, ?);

-- 查询食材列表(带分页)
SELECT i.id, i.name, i.description, i.image, i.category_id, i.properties, i.alias, 
       i.status, i.created_at, ic.name as category_name
FROM ingredients i
LEFT JOIN ingredient_categories ic ON i.category_id = ic.id
WHERE i.status = 1
ORDER BY i.created_at DESC
LIMIT ? OFFSET ?;

-- 根据分类查询食材列表
SELECT i.id, i.name, i.description, i.image, i.category_id, i.properties, i.alias, 
       i.status, i.created_at, ic.name as category_name
FROM ingredients i
LEFT JOIN ingredient_categories ic ON i.category_id = ic.id
WHERE i.category_id = ? AND i.status = 1
ORDER BY i.name ASC;

-- 根据ID查询食材详情
SELECT i.id, i.name, i.description, i.image, i.category_id, i.properties, i.alias, 
       i.status, i.created_at, ic.name as category_name
FROM ingredients i
LEFT JOIN ingredient_categories ic ON i.category_id = ic.id
WHERE i.id = ?;

-- 根据名称模糊查询食材
SELECT i.id, i.name, i.description, i.image, i.category_id, i.properties, i.alias, 
       i.status, i.created_at, ic.name as category_name
FROM ingredients i
LEFT JOIN ingredient_categories ic ON i.category_id = ic.id
WHERE (i.name LIKE ? OR i.alias LIKE ?) AND i.status = 1
ORDER BY i.name ASC
LIMIT ? OFFSET ?;

-- 更新食材信息
UPDATE ingredients
SET name = ?, description = ?, image = ?, category_id = ?, 
    properties = ?, alias = ?, status = ?, updated_at = CURRENT_TIMESTAMP
WHERE id = ?;

-- 删除食材
DELETE FROM ingredients
WHERE id = ?;

-- 添加食材营养信息
INSERT INTO ingredient_nutrition (ingredient_id, calories, protein, fat, carbohydrate, 
                                 fiber, vitamin_a, vitamin_c, vitamin_e, vitamin_k, 
                                 calcium, iron, zinc, unit, unit_weight, data_source)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);

-- 查询食材营养信息
SELECT id, ingredient_id, calories, protein, fat, carbohydrate, fiber, 
       vitamin_a, vitamin_c, vitamin_e, vitamin_k, calcium, iron, zinc, 
       unit, unit_weight, data_source, created_at
FROM ingredient_nutrition
WHERE ingredient_id = ?;

-- 更新食材营养信息
UPDATE ingredient_nutrition
SET calories = ?, protein = ?, fat = ?, carbohydrate = ?, fiber = ?, 
    vitamin_a = ?, vitamin_c = ?, vitamin_e = ?, vitamin_k = ?, 
    calcium = ?, iron = ?, zinc = ?, unit = ?, unit_weight = ?, 
    data_source = ?, updated_at = CURRENT_TIMESTAMP
WHERE ingredient_id = ?;

-- 删除食材营养信息
DELETE FROM ingredient_nutrition
WHERE ingredient_id = ?;

-- 查询在食谱中最常用的食材
SELECT i.id, i.name, i.image, COUNT(ri.id) as usage_count
FROM ingredients i
JOIN recipe_ingredients ri ON i.id = ri.ingredient_id
WHERE i.status = 1
GROUP BY i.id
ORDER BY usage_count DESC
LIMIT ?;

-- 查询热门食材搜索
SELECT i.id, i.name, i.image, COUNT(s.id) as search_count
FROM ingredients i
JOIN searches s ON s.keyword = i.name AND s.type = 'ingredient'
WHERE i.status = 1
GROUP BY i.id
ORDER BY search_count DESC
LIMIT ?; 