/*
 * SnapMotion
 * By Snapshot Media (http://snapshotmedia.co.uk/)
 * Copyright (c) 2010 Snapshot Media
 * Licensed under the MIT License: http://www.opensource.org/licenses/mit-license.php
*/

(function($){
	$.fn.SnapMotion = function(options) {
		var el = this;
		
		jQuery(el).addClass('snapmotion');
		
		var settings = {
			'slideWidth': 960,		// Width of the slideshow
			'slideHeight': 400,		// Height of the slideshow
			'showCaption': true,	// Whether to show caption area
			'captionWidth': 900,	// Width of caption area
			'captionHeight': 50,	// Height of caption area
			'showControls' : true,	// Whether to show next/prev controls
			'controlIndentX': 20,	// Indentation of control area from left (px)
			'controlIndentY': 20,	// Indentation of control area from top (px)
			'animationLength': 375,	// Length of fade (ms)
			'delay': 7500,			// Delay between slides (ms)
			'transition': 'slideX'	// Transition type
		};
		
		if (options) { 
			$.extend(settings, options);
		}

		var isAnimating = false;								// Flag to check whether elements are animating
		var limit = el.children("li").size() - 1;				// Zero-indexed slide count
		var ssWidth = settings['slideWidth'] * (limit+1);		// Width of whole slideshow
		var ssHeight = settings['slideHeight'] * (limit+1);		// Height of whole slideshow
		var animationStep = settings['animationLength'] + 50;	// Transition timeout length
		var interval = 0;										// Declare interval into global scope

		if (settings['showCaption'] || settings['showControls']) {
			// Insert controls into DOM
			var controlsString = '<div class="snapmotion-controls"><ul>';
			for (var i = 1; i <= el.children("li").size(); i++) {
				controlsString += '<li>';
				controlsString += '<div class="posRel">';
				if (settings['showCaption']) {
					controlsString += '<div class="snapmotion-content"></div>';
				}
				if (settings['showControls']) {
					controlsString += '<ul class="controls"><li class="prev"><a href="#">Previous</a></li><li class="next"><a href="#">Next</a></li></ul>';
				}
				controlsString += '</div>';
				controlsString += '</li>';
			}
			controlsString += '</ul>';
			
			jQuery(controlsString).insertAfter(el);
			
			$("div.snapmotion-controls > ul > li")
				.css({'width' : settings['captionWidth'] + 22 + 'px', 'height' : settings['captionHeight'] + 22 + 'px'})
				.find("div.snapmotion-content")
				.css({'width' : settings['captionWidth'], 'height' : settings['captionHeight']});
		
			// Pull control content from <span> into controls
			for (var i = 0; i <= limit; i++) {
				var span = el.children("li").eq(i).find("span");
				var controlHtml = span.html();
				span.remove();
				el.siblings(".snapmotion-controls").children("ul").children("li").eq(i).find("div.snapmotion-content").html(controlHtml);
			}
		}
		
		switch (settings['transition']) {
			case 'slideX':
				var newLeftIndex = limit;
				var newRightIndex = limit - 1;
				var furthestSlideLeft = el.children("li").eq(newLeftIndex);
				var furthestSlideRight = el.children("li").eq(newRightIndex);
				var furthestControlsLeft = el.siblings(".snapmotion-controls").children("ul").children("li").eq(newLeftIndex);
				var furthestControlsRight = el.siblings(".snapmotion-controls").children("ul").children("li").eq(newRightIndex);
		
				// Hide slideshow items, position them
				el.children("li").hide().each(function(){
					var xPos = el.children("li").index(jQuery(this)) * settings['slideWidth'];
					jQuery(this).css({'left' : xPos + 'px'});
				});
				// Hide slideshow controls, position them
				el.siblings(".snapmotion-controls").children("ul").children("li").hide().each(function(){
					var xPos = (el.siblings(".snapmotion-controls").children("ul").children("li").index(jQuery(this)) * settings['slideWidth']) + settings['controlIndentX'];
					jQuery(this).css({'top' : settings['controlIndentY'] + 'px', 'left' : xPos});
				});
		
				// Move last slide behind first for smooth transitioning
				el.children("li").eq(limit).animate({'left' : '-=' + ssWidth}, 1);
				el.siblings(".snapmotion-controls").children("ul").children("li").eq(limit).animate({'left' : '-=' + ssWidth}, 1);
				
				// Fade slides & controls in
				el.children("li").fadeIn(settings['animationLength']);
				el.siblings(".snapmotion-controls").children("ul").children("li").fadeIn(settings['animationLength']);
				
				// Rejig the slides so the current slide is always in the middle of the queue
				function rejigX(isNext) {
					if (isNext) {
						furthestSlideLeft.animate({'left' : '+=' + ssWidth}, 1);
						furthestControlsLeft.animate({'left' : '+=' + ssWidth}, 1);
						newLeftIndex = ((el.children("li").index(furthestSlideLeft) < limit) ? el.children("li").index(furthestSlideLeft) + 1 : 0);
						newRightIndex = ((el.children("li").index(furthestSlideRight) < limit) ? el.children("li").index(furthestSlideRight) + 1 : 0);
					} else {
						furthestSlideRight.animate({'left' : '-=' + ssWidth}, 1);
						furthestControlsRight.animate({'left' : '-=' + ssWidth}, 1);
						newLeftIndex = ((el.children("li").index(furthestSlideLeft) > 0) ? el.children("li").index(furthestSlideLeft) - 1 : limit);
						newRightIndex = ((el.children("li").index(furthestSlideRight) > 0) ? el.children("li").index(furthestSlideRight) - 1 : limit);
					}
					furthestSlideLeft = el.children("li").eq(newLeftIndex);
					furthestControlsLeft = el.siblings(".snapmotion-controls").children("ul").children("li").eq(newLeftIndex);
					furthestSlideRight = el.children("li").eq(newRightIndex);
					furthestControlsRight = el.siblings(".snapmotion-controls").children("ul").children("li").eq(newRightIndex);
				}
				break;
			case 'slideY':
				var newTopIndex = limit;
				var newBottomIndex = limit - 1;
				var furthestSlideTop = el.children("li").eq(newTopIndex);
				var furthestSlideBottom = el.children("li").eq(newBottomIndex);
				var furthestControlsTop = el.siblings(".snapmotion-controls").children("ul").children("li").eq(newTopIndex);
				var furthestControlsBottom = el.siblings(".snapmotion-controls").children("ul").children("li").eq(newBottomIndex);
		
				// Hide slideshow items, position them
				el.children("li").hide().each(function(){
					var yPos = el.children("li").index(jQuery(this)) * settings['slideHeight'];
					jQuery(this).css({'top' : yPos + 'px'});
				});
				// Hide slideshow controls, position them
				el.siblings(".snapmotion-controls").children("ul").children("li").hide().each(function(){
					var yPos = (el.siblings(".snapmotion-controls").children("ul").children("li").index(jQuery(this)) * settings['slideHeight']) + settings['controlIndentY'];
					jQuery(this).css({'top' : yPos + 'px', 'left' : settings['controlIndentX']});
				});
		
				// Move last slide behind first for smooth transitioning
				el.children("li").eq(limit).animate({'top' : '-=' + ssHeight}, 1);
				el.siblings(".snapmotion-controls").children("ul").children("li").eq(limit).animate({'top' : '-=' + ssHeight}, 1);
				
				// Fade slides & controls in
				el.children("li").fadeIn(settings['animationLength']);
				el.siblings(".snapmotion-controls").children("ul").children("li").fadeIn(settings['animationLength']);
				
				// Rejig the slides so the current slide is always in the middle of the queue
				function rejigY(isNext) {
					if (isNext) {
						furthestSlideTop.animate({'top' : '+=' + ssHeight}, 1);
						furthestControlsTop.animate({'top' : '+=' + ssHeight}, 1);
						newTopIndex = ((el.children("li").index(furthestSlideTop) < limit) ? el.children("li").index(furthestSlideTop) + 1 : 0);
						newBottomIndex = ((el.children("li").index(furthestSlideBottom) < limit) ? el.children("li").index(furthestSlideBottom) + 1 : 0);
					} else {
						furthestSlideBottom.animate({'top' : '-=' + ssHeight}, 1);
						furthestControlsBottom.animate({'top' : '-=' + ssHeight}, 1);
						newTopIndex = ((el.children("li").index(furthestSlideTop) > 0) ? el.children("li").index(furthestSlideTop) - 1 : limit);
						newBottomIndex = ((el.children("li").index(furthestSlideBottom) > 0) ? el.children("li").index(furthestSlideBottom) - 1 : limit);
					}
					furthestSlideTop = el.children("li").eq(newTopIndex);
					furthestControlsTop = el.siblings(".snapmotion-controls").children("ul").children("li").eq(newTopIndex);
					furthestSlideBottom = el.children("li").eq(newBottomIndex);
					furthestControlsBottom = el.siblings(".snapmotion-controls").children("ul").children("li").eq(newBottomIndex);
				}
				break;
			case 'fade':
				var currIndex = 0;
				var nextIndex = limit == 0 ? 0 : currIndex + 1;
				var prevIndex = limit == 0 ? 0 : limit;
				
				if (currIndex < nextIndex) {
					// Hide all slides
					el.children("li").hide();
					
					// Hide all slideshow controls, position them
					el.siblings(".snapmotion-controls").children("ul").children("li").hide().each(function(){
						jQuery(this).css({'top' : settings['controlIndentY'] + 'px', 'left' : settings['controlIndentX']});
					});
					
					// Fade in first slide & controls
					el.children("li").eq(currIndex).fadeIn(settings['animationLength']);
					el.siblings(".snapmotion-controls").children("ul").children("li").eq(currIndex).fadeIn(settings['animationLength']);
				}
				break;
		}
		
		// Slideshow control navigation event handling
		el.siblings(".snapmotion-controls").find(".controls li a").click(function(){
			if (!isAnimating) {
				isAnimating = true;

				if (jQuery(this).parent().hasClass('next')) { // Next button clicked
					moveNext();
				} else { // Prev button clicked
					movePrev();
				}
				resetSlideshow();
			}

			return false;
		});

		function moveNext() {
			switch (settings['transition']) {
				case 'slideX':
					el.children("li").animate({
						left: '-=' + settings['slideWidth']
					}, settings['animationLength']);
					setTimeout(function(){
						el.siblings(".snapmotion-controls").children("ul").children("li").animate({
							left: '-=' + settings['slideWidth']
						}, settings['animationLength']);
						setTimeout(function(){
							rejigX(true);			// Throw boundary slide & controls to end of queue
							isAnimating = false;	// Re-enable clicking
						}, animationStep);
					}, settings['animationLength']/3);
					break;
				case 'slideY':
					el.children("li").animate({
						top: '-=' + settings['slideHeight']
					}, settings['animationLength']);
					setTimeout(function(){
						el.siblings(".snapmotion-controls").children("ul").children("li").animate({
							top: '-=' + settings['slideHeight']
						}, settings['animationLength']);
						setTimeout(function(){
							rejigY(true);			// Throw boundary slide & controls to end of queue
							isAnimating = false;	// Re-enable clicking
						}, animationStep);
					}, settings['animationLength']/3);
					break;
				case 'fade':
					if (currIndex != nextIndex) {
						// Fade current slide & controls out
						el.children("li").eq(currIndex).fadeOut(settings['animationLength']);
						el.siblings(".snapmotion-controls").children("ul").children("li").eq(currIndex).fadeOut(settings['animationLength']);
						// Fade new slide & controls in
						el.children("li").eq(nextIndex).fadeIn(settings['animationLength']);
						el.siblings(".snapmotion-controls").children("ul").children("li").eq(nextIndex).fadeIn(settings['animationLength']);
						prevIndex = currIndex;
						currIndex = nextIndex;
						nextIndex = nextIndex < limit ? nextIndex + 1 : 0;   
						isAnimating = false;	// Re-enable clicking after animation has finished
					}
					break;
			}
		}

		function movePrev() {
			switch (settings['transition']) {
				case 'slideX':
					el.children("li").animate({
						left: '+=' + settings['slideWidth']
					}, settings['animationLength']);
					setTimeout(function(){
						el.siblings(".snapmotion-controls").children("ul").children("li").animate({
							left: '+=' + settings['slideWidth']
						}, settings['animationLength']);
						setTimeout(function(){
							rejigX(false);			// Throw boundary slide & controls to end of queue
							isAnimating = false;	// Re-enable clicking
						}, animationStep);
					}, settings['animationLength']);
					break;
				case 'slideY':
					el.children("li").animate({
						top: '+=' + settings['slideHeight']
					}, settings['animationLength']);
					setTimeout(function(){
						el.siblings(".snapmotion-controls").children("ul").children("li").animate({
							top: '+=' + settings['slideHeight']
						}, settings['animationLength']);
						setTimeout(function(){
							rejigY(false);			// Throw boundary slide & controls to end of queue
							isAnimating = false;	// Re-enable clicking
						}, animationStep);
					}, settings['animationLength']);
					break;
				case 'fade':
					if (prevIndex != currIndex) {
						// Fade current slide & controls out
						el.children("li").eq(currIndex).fadeOut(settings['animationLength']);
						el.siblings(".snapmotion-controls").children("ul").children("li").eq(currIndex).fadeOut(settings['animationLength']);
						// Fade new slide & controls in
						el.children("li").eq(prevIndex).fadeIn(settings['animationLength']);
						el.siblings(".snapmotion-controls").children("ul").children("li").eq(prevIndex).fadeIn(settings['animationLength']);
						nextIndex = currIndex;
						currIndex = prevIndex;
						prevIndex = prevIndex > 0 ? prevIndex - 1 : limit;
						isAnimating = false;	// Re-enable clicking after animation has finished
					}
					break;
			}
		}
		
		function startSlideshow() {
			interval = setInterval(function(){
				moveNext();
			}, settings['delay']);
		}

		function resetSlideshow() {
			clearInterval(interval);
			startSlideshow();
		}
		
		// Hey, ho, let's go!
		startSlideshow();
	};
})(jQuery);