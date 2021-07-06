"use strict";

const BaseService = require("./base");

class UserHoldService extends BaseService {
  constructor(props) {
    super(props);
    this.model = this.ctx.model.UserHold;
  }

  async getListByAdmin() {
    const sql = `
        select 
          userHold.user_id,
          count(userHold.id) as holdCount
        from 
            \`korn_user_hold\` userHold
        where userHold.volumn > 0
        group by userHold.user_id
    `;
    return await this.execute(sql);
  }
}

module.exports = UserHoldService;
