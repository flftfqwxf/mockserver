'use strict';
/**
 * hook config
 * https://thinkjs.org/doc/middleware.html#toc-df6
 */
export default {
    payload_parse: ['prepend', 'raw_body'],
    // payload_parse: ['prepend', 'ip_filter'],
}