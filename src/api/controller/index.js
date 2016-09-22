'use strict';

import Base from './base.js';

export default class extends Base {
  /**
   * index action
   * @return {Promise} []
   */
  async indexAction(){
    //auto render template file index_index.html
      console.log(this.http.url)
     const data= await this.model('mockserver').where("api_url='"+this.http.url+"'").select()
      if (data.length) {
          this.json(data[0].api_content)


      }
    // return this.display();
  }
}