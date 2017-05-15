/**
 * this file will be loaded before server started
 * you can register middleware
 * https://thinkjs.org/doc/middleware.html
 */

const rawBody = require('think-raw-body')
think.middleware('raw_body', rawBody)
