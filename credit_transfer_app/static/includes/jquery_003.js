(function(b){var w,k,l="responsiveTable",s="Container",m="overflow",x="Static",f=m+s,n="static"+s,p="nth-child",t='<div class="',u=!1,q,g,h,v,y,r;b.fn.responsiveTable=function(e){function B(a,c){var d=l+"UiHint";if(0==b("#"+d).length){r=b('<div id="'+d+'">&lt;&lt; Scroll table left and right &gt;&gt;</div>');b("body").prepend(r);var z=k.height()/2;0<c.top&&0<a.height()&&(z=c.top+0.4*a.height());r.css({position:"absolute","z-index":1E6,padding:"0.5em","background-color":"#888",color:"#eee","font-size":"1.1em", "border-radius":"0.6em"}).css({top:z,left:k.width()/2-r.width()/2})}setTimeout('$("#'+d+'").hide();',e.scrollHintDuration)}function C(a){if(!a.parent().hasClass(f)){var c=a.offset();a.wrap(t+l+s+'" style="'+m+':hidden;"/>');g=b("<table/>");b.each(a[0].attributes,function(a,b){"id"!==b.name&&g.attr(b.name,b.value)});g.addClass(l+x).css("border-right","ridge").width(0);a.find(">tr,>tbody>tr").each(function(a,c){h=b("<tr/>");h.outerHeight(b(c).outerHeight());b.each(b(c)[0].attributes,function(a,b){"id"!== b.name&&h.attr(b.name,b.value)});for(a=0;a<=e.staticColumns;a++)v=b(c).find(">th:"+p+"("+a+"),>td:"+p+"("+a+")"),y=v.clone(),v.css("display","none"),h.append(y),g.append(h)});a.before(g);a.wrap(t+f+'" style="float:left;'+m+":scroll;"+m+'-y:hidden;"/>');g.wrap(t+n+'" style="float:left;"/>');e.scrollHintEnabled&&B(a,c)}if(a.parent().hasClass(f)){var d,c=a.parent();d=c.parent();c.width(d.innerWidth()-d.find("."+n).outerWidth()-1);e.scrollRight&&c.scrollLeft(a.width())}}function D(a){a.parent().hasClass(f)&& (b("."+n).remove(),a.unwrap().unwrap().find("tr").each(function(a,d){for(a=0;a<=e.staticColumns;a++)b(d).find("th:"+p+"("+a+"),td:"+p+"("+a+")").css("display","")}))}function A(a){q=a.width();a.parent().hasClass(f)&&(q+=b("."+n).width());u=!1;a.parents().each(function(){if(!b(this).hasClass(f)&&q>b(this).width())return u=!0,!1});u?C(a):D(a)}k=b(window);w={staticColumns:1,scrollRight:!0,scrollHintEnabled:!0,scrollHintDuration:2E3};e=b.extend(w,e);return this.each(function(){var a=b(this);a.hasClass(l+ x)||(k.on("resize orientationchange",function(){A(a)}),A(a))})}})(jQuery);
