'use strict';
/**
 * template config
 */
export default {
  type: 'nunjucks',
  content_type: 'text/html',
  file_ext: '.nunj',
  file_depr: '/',
  root_path: think.ROOT_PATH + '/view',
  adapter: {
    ejs: {}
  }
};