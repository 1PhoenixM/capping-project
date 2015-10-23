function newWin(page)
{
	window.open(page);
}

function streamVideo(page) 
{
	open(page,'video','toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,copyhistory=no,width=357,height=290,left=400,top=100,screenX=0,screenY=0');
}

$(document).ready(function(){
  $("img.insert-caption[title]").each(function(){$(this).after('<br /><em style="width: ' + $(this).width() + 'px; ' + $(this).attr("style") + '">' + $(this).attr("title") + '</em>')});
});

/*
|--------------------------------------------------------------------------
| Fix width issue when window is resized
|--------------------------------------------------------------------------
|
*/
/*
$(window).resize( function(){
        if($(window).width() < $(document).width())
                var new_width = 1000;
        else
                var new_width = $(document).width();

        $("#marist").width(new_width);
});
*/

    /*
    |--------------------------------------------------------------------------
    | add youtube videos 
    |--------------------------------------------------------------------------
    | @param vid 	- youtube video id
    | @param width 	- youtube video width
    | @param height	- youtube video height
    |
     */
    $.fn.addYoutubePlayerObject = function() {
        var args = arguments[0] || {}; // It's your object of arguments
        var vid = args.vid;
	var width = args.width;
	var height = args.height;
    
        $("#"+vid+", ."+vid).click( function(){
            $("#"+vid+" img, ."+vid+" img").animate({opacity: 0}, 1000,"linear",function(){
                $(this).remove();
                $("#"+vid+", ."+vid).empty();
                $("#"+vid+", ."+vid).append('<iframe id="youtube" width="'+width+'" height="'+height+'" src="http://www.youtube.com/embed/'+vid+'?amp;autoplay=1&amp;rel=0" frameborder="0" allowfullscreen></iframe>');
                $('#youtube').attr("src", $('#youtube').attr("src"));
            });

        });
    }

