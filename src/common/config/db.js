 'use strict';                                    
 /**                                              
 * db config                                     
  * @type {Object}                                 
 */                                               
 export default {                                
      type: 'mysql',                              
      adapter: {                                  
           mysql: {                             
               host: '127.0.0.1',                
              port: '3306',                     
              database: 'mockserver2ww',           
              user: 'root',                     
              password: '',                     
              prefix: 'mock_',                  
             encoding: 'UTF8MB4_GENERAL_CI'     
          },                                    
         mongo: {                                 
                                                  
         }                                        
     }                                            
 };                                               
