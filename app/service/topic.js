"use strict";

const BaseService = require("./base");

class TopicService extends BaseService {
  constructor(props) {
    super(props);
    this.model = this.ctx.model.Topic;
  }

  async getListByAdmin(categoryId) {
    const sql = `
        select 
          topic.id,
          topic.title,
          topic.content,
          topic.summary,
          topic.order,
          topic.is_top,
          topic.category_id,
          topic.createtime,
          topicCategory.name as category_name
        from 
            \`korn_topic\` topic
        left join
            \`korn_topic_category\` topicCategory
        on
          topic.category_id = topicCategory.id
        where topic.category_id = "${categoryId}"
        order by topic.is_top desc, topic.order asc, topic.createtime desc;
    `;

    return await this.execute(sql);
  }

  async getGroupByAdmin() {
    const sql = `
        select 
          topic.category_id,
          count(topic.id) as topicCount
        from 
            \`korn_topic\` topic
        group by topic.category_id
    `;
    return await this.execute(sql);
  }
}

module.exports = TopicService;
