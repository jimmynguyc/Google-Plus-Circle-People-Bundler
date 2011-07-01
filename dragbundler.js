$(function(){
	var currentDragPosition;
	
	$('div.people').each(function(){
		$(this).prop('email',$(this).children('div.email').html());
	}).mousedown(function(){
		$(this).toggleClass('selected');
	}).draggable({
		start: startDrag,
		helper: cloneHelper,
		drag: bundleTogether,
		stop: returnToPosition
	});
	
	function startDrag(event,ui){
		$(this).addClass('selected');
		currentDragPosition = ui.position;
	}
	
	function cloneHelper(){
		var helper = $(this).clone().addClass('clone-master clone').css('z-index',999);
		var total = $('.people.selected:not(.clone)').length;
		if(total > 1){
			$(helper).append($('<div class="nametag">' + total + ' people</div><div class="paperclip"></div>'));
		}
		return helper;
	}
	
	function bundleTogether(event,ui){
		var element = this;
		currentDragPosition = ui.position;
		$('div.people.selected:not(.clone)').each(function(i,el){
			var found = false;
			$('.clone').each(function(j,cl){
				if($(cl).prop('email') == $(el).prop('email')){
					if(!$(cl).hasClass('firstmove')){
						$(cl).stop(true,true).css('z-index',998-i).css(ui.position);
					}
					found = true;
				}
			});
			if(!found && el != element){
				var rot = (Math.random() - 0.5) * 15;
				$(el).clone()
						.css($(el).offset())
						.addClass('clone firstmove')
						.animate(ui.position, 
									{ 	duration:200, 
										step: function(now, fx){
											if(fx.prop == 'top'){
												fx.end = currentDragPosition.top;
											}
											if(fx.prop == 'left'){
												fx.end = currentDragPosition.left;
											}
										},
										complete:function(){ 
											$(this).removeClass('firstmove');
										}
									})
						.prop('email',$(el).prop('email'))
						.appendTo(el.parentNode)
						.css({ 	'z-index': 998-i,
								'position':'absolute',
								'-webkit-transform': 'rotate('+rot+'deg)',
								'-moz-transform': 'rotate('+rot+'deg)'});
			}
		});
		
	}
	
	function returnToPosition(event,ui){
		$('.clone').each(function(i,cl){
			$('.people:not(.clone)').each(function(j,pl){
				if($(cl).prop('email') == $(pl).prop('email')){
					$(cl).animate( { 	'left':$(pl).offset().left,
										'top':$(pl).offset().top,
										'opacity':0 },
					300, function(){ $(this).remove(); });
				}
			});
		});
	}
});