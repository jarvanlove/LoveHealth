/**
 * 参数验证工具
 * 用于验证API请求参数的合法性
 */

const Joi = require('joi');

/**
 * 验证错误类
 */
class ValidationError extends Error {
  constructor(message, details) {
    super(message);
    this.name = 'ValidationError';
    this.details = details;
    this.status = 400; // Bad Request
  }
}

/**
 * 验证工具对象
 */
const validator = {
  /**
   * 验证请求参数
   * @param {Object} schema Joi验证模式
   * @param {String} type 验证类型 ('body', 'query', 'params')
   * @returns {Function} Express中间件
   */
  validate(schema, type = 'body') {
    return (req, res, next) => {
      const data = req[type];
      const { error, value } = schema.validate(data, { 
        abortEarly: false,
        stripUnknown: true,
        errors: { 
          wrap: { 
            label: false 
          } 
        }
      });

      if (error) {
        const details = error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message
        }));

        return res.status(400).json({
          success: false,
          code: 'VALIDATION_ERROR',
          message: '请求参数验证失败',
          details
        });
      }

      // 将验证后的数据替换到请求对象中
      req[type] = value;
      next();
    };
  },

  /**
   * 手动验证数据
   * @param {Object} data 待验证的数据
   * @param {Object} schema Joi验证模式
   * @throws {ValidationError} 如果验证失败
   * @returns {Object} 验证通过的数据
   */
  validateData(data, schema) {
    const { error, value } = schema.validate(data, { 
      abortEarly: false,
      stripUnknown: true,
      errors: { 
        wrap: { 
          label: false 
        } 
      }
    });

    if (error) {
      const details = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));
      
      throw new ValidationError('数据验证失败', details);
    }

    return value;
  },

  /**
   * 预定义的验证规则
   */
  rules: {
    /**
     * ID验证规则
     */
    id: Joi.number().integer().positive().required().messages({
      'number.base': 'ID必须是数字',
      'number.integer': 'ID必须是整数',
      'number.positive': 'ID必须是正数',
      'any.required': 'ID不能为空'
    }),

    /**
     * 分页参数验证规则
     */
    pagination: Joi.object({
      page: Joi.number().integer().min(1).default(1).messages({
        'number.base': '页码必须是数字',
        'number.integer': '页码必须是整数',
        'number.min': '页码不能小于1'
      }),
      pageSize: Joi.number().integer().min(1).max(100).default(10).messages({
        'number.base': '每页条数必须是数字',
        'number.integer': '每页条数必须是整数',
        'number.min': '每页条数不能小于1',
        'number.max': '每页条数不能大于100'
      })
    }),

    /**
     * 用户名验证规则
     */
    username: Joi.string().alphanum().min(3).max(30).required().messages({
      'string.base': '用户名必须是字符串',
      'string.alphanum': '用户名只能包含字母和数字',
      'string.min': '用户名长度不能小于{#limit}个字符',
      'string.max': '用户名长度不能超过{#limit}个字符',
      'any.required': '用户名不能为空'
    }),

    /**
     * 密码验证规则
     */
    password: Joi.string().min(6).max(30).pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{6,}$')).required().messages({
      'string.base': '密码必须是字符串',
      'string.min': '密码长度不能小于{#limit}个字符',
      'string.max': '密码长度不能超过{#limit}个字符',
      'string.pattern.base': '密码必须包含至少一个大写字母、一个小写字母和一个数字',
      'any.required': '密码不能为空'
    }),

    /**
     * 邮箱验证规则
     */
    email: Joi.string().email().required().messages({
      'string.base': '邮箱必须是字符串',
      'string.email': '邮箱格式不正确',
      'any.required': '邮箱不能为空'
    }),

    /**
     * 手机号验证规则
     */
    phone: Joi.string().pattern(new RegExp('^1[3-9]\\d{9}$')).required().messages({
      'string.base': '手机号必须是字符串',
      'string.pattern.base': '手机号格式不正确',
      'any.required': '手机号不能为空'
    }),

    /**
     * 日期验证规则
     */
    date: Joi.date().iso().messages({
      'date.base': '日期格式不正确',
      'date.format': '日期必须是有效的ISO格式(YYYY-MM-DD)'
    }),

    /**
     * URL验证规则
     */
    url: Joi.string().uri().messages({
      'string.base': 'URL必须是字符串',
      'string.uri': 'URL格式不正确'
    }),

    /**
     * 搜索关键词验证规则
     */
    keyword: Joi.string().min(1).max(50).allow('').messages({
      'string.base': '关键词必须是字符串',
      'string.min': '关键词长度不能小于{#limit}个字符',
      'string.max': '关键词长度不能超过{#limit}个字符'
    }),

    /**
     * 排序字段验证规则
     */
    sortField: Joi.string().messages({
      'string.base': '排序字段必须是字符串'
    }),

    /**
     * 排序方向验证规则
     */
    sortOrder: Joi.string().valid('asc', 'desc').default('desc').messages({
      'string.base': '排序方向必须是字符串',
      'any.only': '排序方向必须是 asc 或 desc'
    })
  },

  /**
   * 通用验证模式
   */
  schemas: {
    /**
     * 用户注册验证模式
     */
    userRegister: Joi.object({
      username: Joi.string().alphanum().min(3).max(30).required().messages({
        'string.base': '用户名必须是字符串',
        'string.alphanum': '用户名只能包含字母和数字',
        'string.min': '用户名长度不能小于{#limit}个字符',
        'string.max': '用户名长度不能超过{#limit}个字符',
        'any.required': '用户名不能为空'
      }),
      password: Joi.string().min(6).max(30).pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{6,}$')).required().messages({
        'string.base': '密码必须是字符串',
        'string.min': '密码长度不能小于{#limit}个字符',
        'string.max': '密码长度不能超过{#limit}个字符',
        'string.pattern.base': '密码必须包含至少一个大写字母、一个小写字母和一个数字',
        'any.required': '密码不能为空'
      }),
      email: Joi.string().email().required().messages({
        'string.base': '邮箱必须是字符串',
        'string.email': '邮箱格式不正确',
        'any.required': '邮箱不能为空'
      }),
      phone: Joi.string().pattern(new RegExp('^1[3-9]\\d{9}$')).required().messages({
        'string.base': '手机号必须是字符串',
        'string.pattern.base': '手机号格式不正确',
        'any.required': '手机号不能为空'
      })
    }),

    /**
     * 用户登录验证模式
     */
    userLogin: Joi.object({
      username: Joi.string().required().messages({
        'string.base': '用户名必须是字符串',
        'any.required': '用户名不能为空'
      }),
      password: Joi.string().required().messages({
        'string.base': '密码必须是字符串',
        'any.required': '密码不能为空'
      })
    }),

    /**
     * 分页查询验证模式
     */
    pagination: Joi.object({
      page: Joi.number().integer().min(1).default(1).messages({
        'number.base': '页码必须是数字',
        'number.integer': '页码必须是整数',
        'number.min': '页码不能小于1'
      }),
      pageSize: Joi.number().integer().min(1).max(100).default(10).messages({
        'number.base': '每页条数必须是数字',
        'number.integer': '每页条数必须是整数',
        'number.min': '每页条数不能小于1',
        'number.max': '每页条数不能大于100'
      }),
      keyword: Joi.string().allow('').max(50).default('').messages({
        'string.base': '关键词必须是字符串',
        'string.max': '关键词长度不能超过{#limit}个字符'
      }),
      sortField: Joi.string().default('created_at').messages({
        'string.base': '排序字段必须是字符串'
      }),
      sortOrder: Joi.string().valid('asc', 'desc').default('desc').messages({
        'string.base': '排序方向必须是字符串',
        'any.only': '排序方向必须是 asc 或 desc'
      })
    }),

    /**
     * ID参数验证模式
     */
    idParam: Joi.object({
      id: Joi.number().integer().positive().required().messages({
        'number.base': 'ID必须是数字',
        'number.integer': 'ID必须是整数',
        'number.positive': 'ID必须是正数',
        'any.required': 'ID不能为空'
      })
    }),

    /**
     * 健康文章验证模式
     */
    healthArticle: Joi.object({
      title: Joi.string().min(2).max(100).required().messages({
        'string.base': '标题必须是字符串',
        'string.min': '标题长度不能小于{#limit}个字符',
        'string.max': '标题长度不能超过{#limit}个字符',
        'any.required': '标题不能为空'
      }),
      summary: Joi.string().min(10).max(200).required().messages({
        'string.base': '摘要必须是字符串',
        'string.min': '摘要长度不能小于{#limit}个字符',
        'string.max': '摘要长度不能超过{#limit}个字符',
        'any.required': '摘要不能为空'
      }),
      content: Joi.string().min(50).required().messages({
        'string.base': '内容必须是字符串',
        'string.min': '内容长度不能小于{#limit}个字符',
        'any.required': '内容不能为空'
      }),
      coverImage: Joi.string().uri().required().messages({
        'string.base': '封面图片必须是字符串',
        'string.uri': '封面图片必须是有效的URL',
        'any.required': '封面图片不能为空'
      }),
      category: Joi.string().required().messages({
        'string.base': '分类必须是字符串',
        'any.required': '分类不能为空'
      }),
      tags: Joi.array().items(Joi.string()).min(1).max(5).required().messages({
        'array.base': '标签必须是数组',
        'array.min': '至少需要一个标签',
        'array.max': '标签数量不能超过{#limit}个',
        'any.required': '标签不能为空'
      }),
      readTime: Joi.number().integer().min(1).required().messages({
        'number.base': '阅读时间必须是数字',
        'number.integer': '阅读时间必须是整数',
        'number.min': '阅读时间不能小于{#limit}分钟',
        'any.required': '阅读时间不能为空'
      }),
      isRecommended: Joi.boolean().default(false).messages({
        'boolean.base': '推荐标志必须是布尔值'
      }),
      status: Joi.string().valid('draft', 'published', 'archived').default('draft').messages({
        'string.base': '状态必须是字符串',
        'any.only': '状态必须是 draft, published 或 archived 之一'
      })
    }),

    /**
     * 评论验证模式
     */
    comment: Joi.object({
      content: Joi.string().min(1).max(500).required().messages({
        'string.base': '评论内容必须是字符串',
        'string.min': '评论内容不能为空',
        'string.max': '评论内容长度不能超过{#limit}个字符',
        'any.required': '评论内容不能为空'
      }),
      parentId: Joi.number().integer().positive().allow(null).default(null).messages({
        'number.base': '父评论ID必须是数字',
        'number.integer': '父评论ID必须是整数',
        'number.positive': '父评论ID必须是正数'
      })
    }),

    /**
     * 食谱验证模式
     */
    recipe: Joi.object({
      name: Joi.string().min(2).max(100).required().messages({
        'string.base': '食谱名称必须是字符串',
        'string.min': '食谱名称长度不能小于{#limit}个字符',
        'string.max': '食谱名称长度不能超过{#limit}个字符',
        'any.required': '食谱名称不能为空'
      }),
      description: Joi.string().min(10).max(500).required().messages({
        'string.base': '食谱描述必须是字符串',
        'string.min': '食谱描述长度不能小于{#limit}个字符',
        'string.max': '食谱描述长度不能超过{#limit}个字符',
        'any.required': '食谱描述不能为空'
      }),
      coverImage: Joi.string().uri().required().messages({
        'string.base': '封面图片必须是字符串',
        'string.uri': '封面图片必须是有效的URL',
        'any.required': '封面图片不能为空'
      }),
      preparationTime: Joi.number().integer().min(1).required().messages({
        'number.base': '准备时间必须是数字',
        'number.integer': '准备时间必须是整数',
        'number.min': '准备时间不能小于{#limit}分钟',
        'any.required': '准备时间不能为空'
      }),
      cookingTime: Joi.number().integer().min(1).required().messages({
        'number.base': '烹饪时间必须是数字',
        'number.integer': '烹饪时间必须是整数',
        'number.min': '烹饪时间不能小于{#limit}分钟',
        'any.required': '烹饪时间不能为空'
      }),
      servings: Joi.number().integer().min(1).required().messages({
        'number.base': '份量必须是数字',
        'number.integer': '份量必须是整数',
        'number.min': '份量不能小于{#limit}人份',
        'any.required': '份量不能为空'
      }),
      difficulty: Joi.string().valid('简单', '中等', '困难').required().messages({
        'string.base': '难度必须是字符串',
        'any.only': '难度必须是 简单, 中等 或 困难 之一',
        'any.required': '难度不能为空'
      }),
      ingredients: Joi.array().items(
        Joi.object({
          ingredientId: Joi.number().integer().positive().required().messages({
            'number.base': '食材ID必须是数字',
            'number.integer': '食材ID必须是整数',
            'number.positive': '食材ID必须是正数',
            'any.required': '食材ID不能为空'
          }),
          amount: Joi.number().positive().required().messages({
            'number.base': '食材数量必须是数字',
            'number.positive': '食材数量必须是正数',
            'any.required': '食材数量不能为空'
          }),
          unit: Joi.string().required().messages({
            'string.base': '食材单位必须是字符串',
            'any.required': '食材单位不能为空'
          })
        })
      ).min(1).required().messages({
        'array.base': '食材必须是数组',
        'array.min': '至少需要一种食材',
        'any.required': '食材不能为空'
      }),
      steps: Joi.array().items(
        Joi.object({
          order: Joi.number().integer().min(1).required().messages({
            'number.base': '步骤顺序必须是数字',
            'number.integer': '步骤顺序必须是整数',
            'number.min': '步骤顺序不能小于1',
            'any.required': '步骤顺序不能为空'
          }),
          description: Joi.string().min(5).required().messages({
            'string.base': '步骤描述必须是字符串',
            'string.min': '步骤描述长度不能小于{#limit}个字符',
            'any.required': '步骤描述不能为空'
          }),
          image: Joi.string().uri().allow(null).default(null).messages({
            'string.base': '步骤图片必须是字符串',
            'string.uri': '步骤图片必须是有效的URL'
          })
        })
      ).min(1).required().messages({
        'array.base': '步骤必须是数组',
        'array.min': '至少需要一个步骤',
        'any.required': '步骤不能为空'
      }),
      tags: Joi.array().items(Joi.string()).min(1).max(5).required().messages({
        'array.base': '标签必须是数组',
        'array.min': '至少需要一个标签',
        'array.max': '标签数量不能超过{#limit}个',
        'any.required': '标签不能为空'
      }),
      nutritionFacts: Joi.object({
        calories: Joi.number().min(0).required().messages({
          'number.base': '卡路里必须是数字',
          'number.min': '卡路里不能小于0',
          'any.required': '卡路里不能为空'
        }),
        protein: Joi.number().min(0).required().messages({
          'number.base': '蛋白质必须是数字',
          'number.min': '蛋白质不能小于0',
          'any.required': '蛋白质不能为空'
        }),
        carbs: Joi.number().min(0).required().messages({
          'number.base': '碳水化合物必须是数字',
          'number.min': '碳水化合物不能小于0',
          'any.required': '碳水化合物不能为空'
        }),
        fat: Joi.number().min(0).required().messages({
          'number.base': '脂肪必须是数字',
          'number.min': '脂肪不能小于0',
          'any.required': '脂肪不能为空'
        }),
        sugar: Joi.number().min(0).required().messages({
          'number.base': '糖分必须是数字',
          'number.min': '糖分不能小于0',
          'any.required': '糖分不能为空'
        }),
        sodium: Joi.number().min(0).required().messages({
          'number.base': '钠含量必须是数字',
          'number.min': '钠含量不能小于0',
          'any.required': '钠含量不能为空'
        })
      }).required().messages({
        'object.base': '营养成分必须是对象',
        'any.required': '营养成分不能为空'
      }),
      status: Joi.string().valid('draft', 'published', 'archived').default('draft').messages({
        'string.base': '状态必须是字符串',
        'any.only': '状态必须是 draft, published 或 archived 之一'
      })
    })
  },

  /**
   * ValidationError类的引用
   */
  ValidationError
};

module.exports = validator; 