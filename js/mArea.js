(function($,golob){
	function mArea(el,options){
		var $this=$(el);
		var $div;
		var isClick=true;
		bind.call(this,el,$div,isClick);
		var callback=null;
		if(typeof options =="function"){
			callback=options;
		}
		if(options && options.callback){
			callback=options.callback;
		}
		this.render=function(done){
			if(callback){
				callback($this.data('shape'),done)
			} else {
				done()
			}
		}
		this.destory=function(){
			$this.off('mousedown.mArea');
			$(document).off('mouseup.mArea');
		}
	}
	function bind(el,$div,isClick){
		var that=this;
		var $top=$(el);
		var isMove = false
		$top.on('mousedown.mArea',function(e){
			e.preventDefault();
			e.stopPropagation();
			var $this=$(this);
			if(!$div){
				$div=$('<div class="mArea" style="opacity:0.5;border:1px dashed #0099FF;background-color:#C3D5ED;position:absolute;top:0;left:0;width:0;height:0;"></div>');
				$this.append($div);
			}
			var scrollTop=document.documentElement.scrollTop;
			var scrollLeft=document.documentElement.scrollLeft
			var offset=$this.offset();
			var startX=(e.clientX+scrollLeft)-offset.left,
				startY=(e.clientY+scrollTop)-offset.top;
			$div.css({top:startY+"px",left:startX+"px"});;
			$div.hide();
			$top.on('mousemove.mArea',function(ex){
				e.preventDefault();
				e.stopPropagation();
				isClick=false;
				var scrollTop=document.documentElement.scrollTop;
				var scrollLeft=document.documentElement.scrollLeft
				var newX=(ex.clientX+scrollLeft)-offset.left,
					newY=(ex.clientY+scrollTop)-offset.top;
				$div.show();
				var exleft=Math.min(startX,newX);
				var extop=Math.min(startY,newY);
				var w=Math.abs(newX-startX);
				var h=Math.abs(newY-startY);
				$div.css({top:extop+"px",left:exleft+"px"});
				$div.css({"width":w+"px","height":h+"px"});
				if(w<=10 && h<=10){
					isClick=true;
					return false;
				}
                isMove = true
                var posiInfo =  $div.offset()
                $top.data('shape',{
                	left:$div.offset().left,
					top:$div.offset().top,
					reTop:extop,
					reLeft:exleft,
					width:$div.width(),
					height:$div.height()
				})
	            return false;
			});
		});
		$(document).on('mouseup.mArea',function(e){
			if(!isClick){
				setTimeout(function(){
					isClick=true;
				},300);
			}
			if(isMove) {
				that.render(function(){
					if($div && $div[0]){
						$div.hide();
					}
				});
			} else{
				if($div && $div[0]){
					$div.hide();
				}
			}
			isMove = false
			$top.off('mousemove.mArea');
		});
	}
	$.fn.mArea=function(options){
		return this.each(function(){
			var $this=$(this);
			var instance=$this.data("instance");
			if(!instance){
				instance=new mArea(this,options);
			}
			if(typeof options=="string" && options=="destory"){
				instance.destory();
			}
			return instance;
		});
	}
})(jQuery,window)