/* jQuery Orbit Plugin 1.2.3 * www.ZURB.com/playground * Copyright 2010, ZURB
 * Free to use under the MIT license. */
(function($) {
    $.fn.orbit = function(options) {
      //Defaults to extend options
      var defaults = {  
      animation: 'horizontal-push', 		// fade, horizontal-slide, vertical-slide, horizontal-push
      animationSpeed: 600, 				// how fast animtions are
      timer: true, 						// true or false to have the timer
      advanceSpeed: 4000, 				// if timer is enabled, time between transitions 
      pauseOnHover: false, 				// if you hover pauses the slider
      startClockOnMouseOut: false, 		// if clock should start on MouseOut
      startClockOnMouseOutAfter: 1000, 	// how long after MouseOut should the timer start again
      directionalNav: true, 				// manual advancing directional navs
      captions: true, 					// do you want captions?
      captionAnimation: 'fade', 			// fade, slideOpen, none
      captionAnimationSpeed: 600, 		// if so how quickly should they animate in
      frontendWidth: 150,		//frontend Img Width
      frontendHeight: 200,
      frontendBorder: '1px solid #d9d9d9',
      frontendLeft: 75,  //front left
      backendWidth: 120, //backend Img Width 1
      backendTop: 20,	//backend Img  1 Position
      backendLeft: 30, //backend Img  1 left
	  backendLeft3: 150, //backend Img  1 rgiht
      backendBorder: '1px solid #d9d9d9',	 
      backendWidth2: 90, //backend Img Width 2
      backendTop2: 40,	// backend Img Position 2      
	  backendLeft4: 210,// backend Img Position right 
	  backendLeft2: 0, //backend Img Position left
      backendBorder2: '1px solid #d9d9d9',
      sceneWidth: 300,
      sceneHeight: 240,
      afterSlideChange: function(){} 		// empty function 
     	};  
      //Extend those options
      var options = $.extend(defaults, options); 
      return this.each(function() {
      //Global Variables
      var activeSlide = 2,
      	numberSlides = 0,
      	locked;
      
      //Initialize
      var orbit = $(this).addClass('orbit'),         
      orbitWrapper = orbit.wrap('<div class="orbit-wrapper" />').parent();
      //Collect all slides and set slider size of largest image
      var slides = orbit.find("img");
      orbit.add(orbitWrapper).width(options.sceneWidth);
      orbit.height(options.frontendHeight+parseInt(options.frontendBorder)*2);
      orbitWrapper.height(options.sceneHeight);
      numberSlides = slides.length;
      orbitWidth = options.frontendWidth;
      //Animation locking functions
      function unlock() {
          locked = false;
      }
      function lock() { 
          locked = true;
      }
	

      if(slides.length == 1) {
      	options.directionalNav = false;
      	options.timer = false;
      }


      //Set initial front photo z-index and fades it in
      slides.eq(activeSlide)
      	.css({"z-index" : numberSlides , left:options.frontendLeft , "width": options.frontendWidth+"px", top: 0,"border":options.frontendBorder})
      	.fadeIn(function() {
      		slides.eq(activeSlide).siblings().css({"width": options.backendWidth+"px",top:options.backendTop});
			
      	});
		slides.eq((activeSlide-2)%numberSlides).css({"left":options.backendLeft2,"z-index" : numberSlides-2,"top":options.backendTop2,"width": options.backendWidth2+"px","border":options.backendBorder2});
		slides.eq((activeSlide-1)%numberSlides).css({"left":options.backendLeft,"z-index" : numberSlides-1,"top":options.backendTop,"width": options.backendWidth+"px","border":options.backendBorder});
		slides.eq((activeSlide)%numberSlides).css({"left":options.frontendLeft,"z-index" : numberSlides, "width": options.frontendWidth+"px", top: 0});
		slides.eq((activeSlide+1)%numberSlides).css({"left":options.backendLeft3,"z-index" : numberSlides-1,"top":options.backendTop,"width": options.backendWidth+"px","border":options.backendBorder});
		slides.eq((activeSlide+2)%numberSlides).css({"left":options.backendLeft4,"z-index" : numberSlides-2,"top":options.backendTop2,"width": options.backendWidth2+"px","border":options.backendBorder2});
		
		for(act=activeSlide+3;act<numberSlides;act++){
			slides.eq(act%numberSlides).css({"z-index" : numberSlides-3,"top":options.backendTop2});
		}
	  
	 /* for(act = 1;act<numberSlides;act++){
      	if(act==1) {
			slides.eq((activeSlide+act-1)%numberSlides).css({"left":0,"z-index" : numberSlides-2,"top":options.backendTop2});
			slides.eq((activeSlide+act)%numberSlides).css({"left":options.backendLeft2,"z-index" : numberSlides-1,"top":options.backendTop});
			slides.eq((activeSlide+act+1)%numberSlides).css({"left":options.backendLeft,"z-index" : numberSlides});
			slides.eq((activeSlide+act+2)%numberSlides).css({"left":options.backendLeft4,"z-index" : numberSlides-1,"top":options.backendTop});
			slides.eq((activeSlide+act+3)%numberSlides).css({"left":options.backendLeft3,"z-index" : numberSlides-2,"top":options.backendTop2});
			
      	}
      	/*else {
      		slides.eq((activeSlide+act)%numberSlides).css({"z-index" : act});
      	}*/
     // }
      //Timer Execution
      function startClock() {
      	if(!options.timer  || options.timer == 'false') { 
      		return false;
      	} else if(timer.is(':hidden')) {
		      clock = setInterval(function(e){
						shift("next");  
		      }, options.advanceSpeed);      		
      	} else {
		      timerRunning = true;
		      pause.removeClass('active')
		      clock = setInterval(function(e){
		          degrees += 2;
		          if(degrees > 360) {
		              rotator.removeClass('move');
		              mask.removeClass('move');
		              degrees = 0;
		              shift("next");
		          }
		      }, options.advanceSpeed/180);
				}
	    }
	     function stopClock() {
	       if(!options.timer || options.timer == 'false') { return false; } else {
		      timerRunning = false;
		      clearInterval(clock);
		      pause.addClass('active');
				 }
	     }  
      //Timer Setup
      if(options.timer) {         	
          var timerHTML = '<div class="timer"><span class="mask"><span class="rotator"></span></span><span class="pause"></span></div>'
          orbitWrapper.append(timerHTML);
          var timer = orbitWrapper.children('div.timer'),
          	timerRunning;
          if(timer.length != 0) {
              var rotator = $('div.timer span.rotator'),
              	mask = $('div.timer span.mask'),
              	pause = $('div.timer span.pause'),
              	degrees = 0,
              	clock; 
              startClock();
              timer.click(function() {
            if(!timerRunning) {
                startClock();
            } else { 
                stopClock();
            }
              });
              if(options.startClockOnMouseOut){
            var outTimer;
            orbitWrapper.mouseleave(function() {
                outTimer = setTimeout(function() {
                    if(!timerRunning){
                  startClock();
                    }
                }, options.startClockOnMouseOutAfter)
            })
            orbitWrapper.mouseenter(function() {
                clearTimeout(outTimer);
            })
              }
          }
      }  
	        
	        //Pause Timer on hover
	        if(options.pauseOnHover) {
		        orbitWrapper.mouseenter(function() {
		        	stopClock(); 
		        });
		   	}
      
      //Caption Setup
      if(options.captions) {
          var captionHTML = '<h4></h4><p class="orbit-caption"></p>';
          orbitWrapper.append(captionHTML);
          var caption0 = orbitWrapper.children('h4');
          var caption = orbitWrapper.children('.orbit-caption');
      	setCaption();
      }
			
			//Caption Execution
      function setCaption() {
      	if(!options.captions || options.captions =="false") {
      		return false; 
      	} else {
	      	var _captionTITLE = '<a href="'+slides.eq(activeSlide).parent('a').attr('href')+'" target="_blank">'+slides.eq(activeSlide).parent('a').attr('title')+'</a>'; //get ID from rel tag on image
	      		_captionHTML = slides.eq(activeSlide).parent('a').next('span').html(); //get HTML from the matching HTML entity 
				
	      	//Set HTML for the caption if it exists
	      	if(_captionTITLE || _captionHTML) {
	      		caption0.html(_captionTITLE); // Change HTML in Caption 
	      		caption.html(_captionHTML); 
		          //Animations for Caption entrances
		       	if(options.captionAnimation == 'none') {
		       		caption.show();
		       	}
		       	if(options.captionAnimation == 'fade') {
		       		caption.fadeIn(options.captionAnimationSpeed);
		       	}
		       	if(options.captionAnimation == 'slideOpen') {
		       		caption.slideDown(options.captionAnimationSpeed);
		       	}
	      	} else {
	      		//Animations for Caption exits
	      		if(options.captionAnimation == 'none') {
		       		caption.hide();
		       	}
		       	if(options.captionAnimation == 'fade') {
		       		caption.fadeOut(options.captionAnimationSpeed);
		       	}
		       	if(options.captionAnimation == 'slideOpen') {
		       		caption.slideUp(options.captionAnimationSpeed);
		       	}
	      	}
				}
      }
      
// ==================
// ! DIRECTIONAL NAV   
// ==================

      //DirectionalNav { rightButton --> shift("next"), leftButton --> shift("prev");
      if(options.directionalNav) {
      	if(options.directionalNav == "false") { return false; }
          var directionalNavHTML = '<div class="slider-nav"><span class="right">></span><span class="left"><</span></div>';
          orbitWrapper.append(directionalNavHTML);
          var leftBtn = orbitWrapper.children('div.slider-nav').children('span.left'),
          	rightBtn = orbitWrapper.children('div.slider-nav').children('span.right');
          leftBtn.click(function() { 
              stopClock();
              shift("prev");
          });
          rightBtn.click(function() {
              stopClock();
              shift("next")
          });
      }
      
      

      
      
      
// ====================
// ! SHIFT ANIMATIONS   
// ====================
      
      //Animating the shift!
      function shift(direction) {
        	    //remember previous activeSlide
          var prevActiveSlide = activeSlide,
              nextActiveSlide = activeSlide,
			  prevActiveSlide1 = activeSlide,
              nextActiveSlide1 = activeSlide,
          	slideDirection = direction;
          //exit function if bullet clicked is same as the current image
          if(prevActiveSlide == slideDirection) { return false; }
          //reset Z & Unlock
          function resetAndUnlock() {
              unlock();
              options.afterSlideChange.call(this);
          }
          if(slides.length == "1") { return false; }
          if(!locked) {
              lock();
					 //deduce the proper activeImage
              if(direction == "next") {
				activeSlide++
			prevActiveSlide = (activeSlide-1+numberSlides)%numberSlides;
			prevActiveSlide1 = (activeSlide-2+numberSlides)%numberSlides;
				if(activeSlide == numberSlides) {
					activeSlide = 0;
				}
            nextActiveSlide = (activeSlide+1)%numberSlides;
			nextActiveSlide1 = (activeSlide+2)%numberSlides;
			
              } else if(direction == "prev") {
             activeSlide--
			 prevActiveSlide = (activeSlide+1)%numberSlides;
			 prevActiveSlide1 = (activeSlide+2)%numberSlides;
            if(activeSlide < 0) {
                activeSlide = numberSlides-1;
            }
            nextActiveSlide = (activeSlide-1+numberSlides)%numberSlides;
			nextActiveSlide1 = (activeSlide-2+numberSlides)%numberSlides;
			
              } else {
            activeSlide = direction;
            if (prevActiveSlide1 < activeSlide) { 
                slideDirection = "next";
            } else if (prevActiveSlide1 > activeSlide) { 
                slideDirection = "prev"
            }
              }
   /* for(act = 1;act<numberSlides;act++){
      	if(act>2 && direction == "prev")
      	slides.eq((activeSlide+act)%numberSlides).css({"left":0});
      	if(act==1 && direction == "prev")
      	slides.eq((activeSlide+act)%numberSlides).css({"z-index" : numberSlides-1});
        else slides.eq((activeSlide+act)%numberSlides).css({"z-index" : act});
      }*/
	  

              //fade
              if(options.animation == "fade") {
            slides
            	.eq(activeSlide)
            	.css({"opacity" : 0, "z-index" : numberSlides})
            	.animate({"opacity" : 1}, options.animationSpeed, resetAndUnlock);
              }
              //push-over
              if(options.animation == "horizontal-push") {

			
			if(slideDirection == "next") {
                slides
                	.eq(activeSlide)
                	.css({ "z-index" : numberSlides , "border": options.frontendBorder})
                  .animate({"left" : options.frontendLeft+"px" , "width": options.frontendWidth+"px" , "top": "0px"}, options.animationSpeed, resetAndUnlock);
				 slides
                	.eq(prevActiveSlide).css({"z-index" : numberSlides-1 ,"border": options.backendBorder})
                	.animate({"left" : options.backendLeft, "width": options.backendWidth+"px",top:options.backendTop+"px"}, options.animationSpeed);
                slides
                	.eq(prevActiveSlide1).css({"z-index" : numberSlides-2 ,"border": options.backendBorder2})
                	.animate({"left" : "0px", "width": options.backendWidth2+"px",top:options.backendTop2+"px"}, options.animationSpeed);
                slides
                	.eq(nextActiveSlide).css({"z-index" : numberSlides-1 ,"border": options.backendBorder})
                	.animate({"left" : options.backendLeft3+"px", "width": options.backendWidth+"px",top:options.backendTop+"px"}, options.animationSpeed);
                 slides
                	.eq(nextActiveSlide1).css({"z-index" : numberSlides-2 ,"border": options.backendBorder2})
                	.animate({"left" : options.backendLeft4+"px", "width": options.backendWidth2+"px",top:options.backendTop2+"px"}, options.animationSpeed);
                /*slides
                	.eq((nextActiveSlide+1)%numberSlides).css({ "left" : options.backendLeft+"px" });*/
				  if(numberSlides>5){
					 for(j=numberSlides-5;j>=1;j--){
						slides.eq((prevActiveSlide1-j+numberSlides)%numberSlides).css({"z-index" : numberSlides-2-j});
					}
				}     
            }
            if(slideDirection == "prev") {
                slides
                	.eq(activeSlide)
                	.css({ "z-index" : numberSlides ,"border": options.frontendBorder})
                	.animate({"left" : options.frontendLeft+"px" , "width": options.frontendWidth+"px", top: "0px"}, options.animationSpeed, resetAndUnlock);
				slides
                	.eq(prevActiveSlide).css({"z-index" : numberSlides-1 ,"border": options.backendBorder})
                	.animate({"left" : options.backendLeft3+"px" , "width": options.backendWidth+"px",top: options.backendTop+"px"}, options.animationSpeed);
				slides
                	.eq(prevActiveSlide1).css({"z-index" : numberSlides-2 ,"border": options.backendBorder2})
                	.animate({"left" : options.backendLeft4+"px" , "width": options.backendWidth2+"px",top: options.backendTop2+"px"}, options.animationSpeed);
				 slides
                	.eq(nextActiveSlide1).css({"z-index" : numberSlides-2 ,"border": options.backendBorder2})
                	.animate({"left" : "0px", "width": options.backendWidth2+"px",top:options.backendTop2+"px"}, options.animationSpeed);
                 slides
                	.eq(nextActiveSlide).css({"z-index" : numberSlides-1 ,"border": options.backendBorder})
                	.animate({"left" : options.backendLeft, "width": options.backendWidth+"px",top:options.backendTop+"px"}, options.animationSpeed);
				if(numberSlides>5){
				  slides.eq((prevActiveSlide1+1+numberSlides)%numberSlides).css({"z-index" : numberSlides-4});
				}
            }
          }
              setCaption();
          } //lock
      }//orbit function
        });//each call
    }//orbit plugin call
})(jQuery);
