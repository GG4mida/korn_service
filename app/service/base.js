"use strict";

const { Service } = require("egg");
const { QueryTypes } = require("sequelize");

class BaseService extends Service {
  /**
   * 创建数据
   * @param {object} data - 创建数据
   */
  async create(data) {
    return await this.model.create(data);
  }

  /**
   * 删除数据
   * @param {object} condition - 删除条件
   */
  async delete(condition) {
    return await this.model.destroy({
      where: condition,
    });
  }

  /**
   * 获取数量
   * @param {object} condition - 查询条件
   */
  async getCount(condition = {}) {
    return await this.model.count({
      where: condition,
    });
  }

  /**
   * 获取累计值
   * @param {string} field - 字段值
   * @param {object} condition - 查询条件
   */
  async getSum(field, condition = {}) {
    return await this.model.sum(field, {
      where: condition,
    });
  }

  /**
   * 执行原生的 sql 操作。
   * @param {string} sql - 执行的sql
   * @param {string} queryType - 执行的类型
   */
  async execute(sql, queryType = QueryTypes.SELECT) {
    return await this.ctx.app.model.query(sql, {
      type: queryType,
    });
  }

  /**
   * 更新数据
   * @param {object} data - 更新的数据
   * @param {object} condition - 更新的条件
   */
  async update(data, condition) {
    const res = await this.model.update(data, {
      where: condition,
    });
    return res && res.length ? res[0] : 0;
  }

  /**
   * 更新数据
   * @param {object} data - 更新的数据
   * @param {string} id - 数据主体编号
   */
  async updateById(data, id) {
    const condition = {
      id,
    };
    return await this.update(data, condition);
  }

  /**
   * 根据编号查询数据条目
   * @param {string} id - 查询的数据编号
   */
  async getOneById(id) {
    return await this.model.findByPk(id);
  }

  /**
   * 根据条件查询数据条目
   * @param {object} condition - 查询条件
   */
  async getOneByCondition(condition = {}) {
    return await this.model.findOne({
      where: condition,
    });
  }

  /**
   * 根据条件查询数据列表
   * @param {object} condition - 查询的条件
   * @param {object} order - 查询数据的排序规则
   */
  async getListByCondition(condition = {}, order = []) {
    return await this.model.findAll({
      where: condition,
      order,
    });
  }

  /**
   * 根据条件分页查询数据列表
   * @param {number} pageIndex - 分页索引
   * @param {number} pageSize - 分页大小
   * @param {object}} condition - 查询条件
   * @param {object}} order - 排序条件
   */
  async getListByPagination(pageIndex, pageSize, condition = {}, order = {}) {
    return await this.model.findAll({
      where: condition,
      order,
      offset: (pageIndex - 1) * pageSize,
      limit: pageSize,
    });
  }
}

module.exports = BaseService;
