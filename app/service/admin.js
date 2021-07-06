"use strict";

const BaseService = require("./base");
const { DateTime } = require("../util");

class AdminService extends BaseService {
  constructor(props) {
    super(props);
    this.model = this.ctx.model.Admin;
  }

  async getByToken(token) {
    const currentDateTime = DateTime.getCurrentDateTime();
    const sql = `
        select 
            admin.id,
            admin.login_name,
            admin.login_pwd,
            admin.createtime,
            admin.nickname,
            admin.phone,
            admin.remark,
            admin.enabled
        from 
            \`korn_admin\` admin
        join 
            \`korn_admin_token\` adminToken
        where 
          adminToken.token = "${token}" and 
          adminToken.expiretime > "${currentDateTime}";
    `;

    const dataList = await this.execute(sql);

    if (dataList == null || dataList.length === 0) {
      return null;
    }

    return dataList[0];
  }
}

module.exports = AdminService;
