jQuery(document).ready(function($){

	/* Variables */
	var gallery;
	var foldingPanel = $('.cd-folding-panel');
	var mainContent = $('.cd-main');

	var emojisArray = [];
	var selectedEmojiIndex = 0;

	init();

	function setGallery(selectedGalleryjQueryObj) {
		gallery = selectedGalleryjQueryObj;
	}

	/*	Helper Functions */
	function handleGalleryClick(event) {
		var jQueryGalleryObj = $(event.delegateTarget);
		setGallery(jQueryGalleryObj);

		if($(this).length > 0 && $(this)[0].classList.length > 0) {
				var url = $(this).attr('href');
				window.open(url);
				event.preventDefault();
			} else {
				event.preventDefault();
				openItemInfo($(this).attr('href'));
			}
	}

		function openItemInfo(url) {
		var mq = viewportSize();

		if( gallery.offset().top > $(window).scrollTop() && mq != 'mobile') {
			/* if content is visible above the .cd-gallery - scroll before opening the folding panel */
			$('body,html').animate({
				'scrollTop': gallery.offset().top
			}, 100, function(){ 
	           	toggleContent(url, true);
	        }); 
	    } else if( gallery.offset().top + gallery.height() < $(window).scrollTop() + $(window).height()  && mq != 'mobile' ) {
			/* if content is visible below the .cd-gallery - scroll before opening the folding panel */
			$('body,html').animate({
				'scrollTop': gallery.offset().top + gallery.height() - $(window).height()
			}, 100, function(){ 
	           	toggleContent(url, true);
	        });
		} else {
			toggleContent(url, true);
		}
	}

	function toggleContent(url, bool) {
		if( bool ) {
			/* load and show new content */
			var foldingContent = foldingPanel.find('.cd-fold-content');
			foldingContent.load(url+' .cd-fold-content > *', function(event){
				setTimeout(function(){
					$('body').addClass('overflow-hidden');
					foldingPanel.addClass('is-open');
					mainContent.addClass('fold-is-open');
				}, 100);
				
			});
		} else {
			/* close the folding panel */
			var mq = viewportSize();
			foldingPanel.removeClass('is-open');
			mainContent.removeClass('fold-is-open');
			
			(mq == 'mobile' || $('.no-csstransitions').length > 0 ) 
				/* according to the mq, immediately remove the .overflow-hidden or wait for the end of the animation */
				? $('body').removeClass('overflow-hidden')
				
				: mainContent.find('.cd-item').eq(0).one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
					$('body').removeClass('overflow-hidden');
					mainContent.find('.cd-item').eq(0).off('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend');
				});
		}
		
	}

	function viewportSize() {
		/* retrieve the content value of .cd-main::before to check the actua mq */
		return window.getComputedStyle(document.querySelector('.cd-main'), '::before').getPropertyValue('content').replace(/"/g, "").replace(/'/g, "");
	}

	function setFocusHandlers() {
		$( '.emoji').focusin(function() {
			 $(this).toggleClass("animated pulse");
		});	
		$( '.emoji').focusout(function() {
			 $(this).removeClass("animated pulse");
		});	
		$('#landing-section > div.row > div:nth-child(2) > img').focus();
	}

	function focusEmoji(){
		if (selectedEmojiIndex < 0){
			selectedEmojiIndex = 0;
		}

		if (selectedEmojiIndex >= emojisArray.length) {
			selectedEmojiIndex = emojisArray.length-1;
		}

		var emoji = emojisArray[selectedEmojiIndex];
		emoji.focus();
	}

	function init() {
		$('.cd-gallery').each(function() {
			$(this).on('click', 'a', handleGalleryClick);
			$(this).on('click', function(event) {
				/* detect click on .cd-gallery::before when the .cd-folding-panel is open */
				if($(event.target).is('.cd-gallery') && $('.fold-is-open').length > 0 ) toggleContent('', false);
			});
		});

		var index = 0;
		$( '.emoji').each(function(){
			emojisArray[index] = $(this);
			index++;
		});
		selectedEmojiIndex = 0;


		/* close folding content */
		foldingPanel.on('click', '.cd-close', function(event){
			event.preventDefault();
			toggleContent('', false);
		});

		setFocusHandlers();
	}

	$(document).keydown(function(e){
	    if (e.keyCode == 37) { 
	       console.log( "left pressed " );
	       selectedEmojiIndex--;
	       focusEmoji();
	       return false;
	    }
	    if (e.keyCode == 38) { 
	       console.log( "up pressed " );
	       return false;
	    }
	    if (e.keyCode == 39) { 
	       console.log( "right pressed " );
	       selectedEmojiIndex++;
	       focusEmoji();
	       return false;
	    }
	    if (e.keyCode == 40) { 
	       console.log( "down pressed " );
	       return false;
	    }
	});

});