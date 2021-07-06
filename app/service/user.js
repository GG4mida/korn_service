"use strict";

const { Op } = require("sequelize");
const BaseService = require("./base");
const { DateTime } = require("../util");

class UserService extends BaseService {
  constructor(props) {
    super(props);
    this.model = this.ctx.model.User;
  }

  /**
   * 获取用户持仓
   * @param {string} token - token
   */
  async getHoldList(token) {
    const userInfo = await this.getBaseInfo(token);
    const { id: userId } = userInfo;
    const userHoldCondition = {
      user_id: userId,
      volumn: {
        [Op.gt]: 0.0001,
      },
    };

    const userHoldList = await this.ctx.service.userHold.getListByCondition(
      userHoldCondition
    );

    if (!userHoldList || userHoldList.length === 0) return [];

    const result = [];

    for (const { coin_code, volumn } of userHoldList) {
      const coinData = await this.ctx.service.coin.getInfo(coin_code);
      if (!coinData) {
        continue;
      }
      result.push({
        volumn,
        coin: coinData,
      });
    }

    return result;
  }

  /**
   * 获取用户操作记录
   * @param {string} token - token
   */
  async getOperateList(token) {
    const userInfo = await this.getBaseInfo(token);
    const { id: userId } = userInfo;
    const userOperateCondition = {
      user_id: userId,
    };

    const userOperateOrder = [["createtime", "desc"]];

    const userOperateList =
      await this.ctx.service.userOperate.getListByCondition(
        userOperateCondition,
        userOperateOrder
      );

    if (!userOperateList || userOperateList.length === 0) return [];

    const result = [];

    for (const operate of userOperateList) {
      const { coin_code } = operate;
      const coinData = await this.ctx.service.coin.getInfo(coin_code);
      if (!coinData) {
        continue;
      }
      result.push({
        operate,
        coin: coinData,
      });
    }

    return result;
  }

  /**
   * 获取用户信息
   * @param {string} token - token
   */
  async getBaseInfo(token) {
    const currentDateTime = DateTime.getCurrentDateTime();
    const sql = `
        select 
            userInfo.id,
            userInfo.login_name,
            userInfo.login_pwd,
            userInfo.createtime,
            userInfo.remark,
            userInfo.enabled,
            userConfig.nick_name,
            userConfig.email,
            userConfig.phone,
            userConfig.avatar,
            userWallet.balance_init,
            userWallet.balance_current
        from 
            \`korn_user\` userInfo
        join 
            \`korn_user_token\` userToken
        on 
            userInfo.id = userToken.user_id
        left join 
            \`korn_user_config\` userConfig
        on 
            userInfo.id = userConfig.user_id
        left join 
            \`korn_user_wallet\` userWallet
        on 
            userInfo.id = userWallet.user_id
        where 
          userToken.token = "${token}" and
          userToken.expiretime > "${currentDateTime}";
    `;
    const data = await this.execute(sql);
    return data && data.length ? data[0] : null;
  }

  /**
   * 获取用户列表
   * @param {number} pageIndex - 分页索引
   * @param {number} pageSize - 分页大小
   * @return
   */
  async getListByAdmin() {
    const sql = `
        select 
            userInfo.id,
            userInfo.login_name,
            userInfo.login_pwd,
            userInfo.createtime,
            userInfo.remark,
            userInfo.enabled,
            userConfig.nick_name,
            userConfig.email,
            userConfig.phone,
            userConfig.avatar
        from 
            \`korn_user\` userInfo
        left join 
            \`korn_user_config\` userConfig
        on 
            userInfo.id = userConfig.user_id
        order by userInfo.createtime desc;
    `;
    return await this.execute(sql);
  }
}

module.exports = UserService;
