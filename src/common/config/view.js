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
        nunjucks: {
            prerender: function(nunjucks, env) {
                //添加一个过滤器，这样可以在模板里使用了
                env.addFilter('check_route', function(curr_path, path) {
                    if (curr_path === path) {
                        return 'open'
                    }
                });
            }
        }
    }
};