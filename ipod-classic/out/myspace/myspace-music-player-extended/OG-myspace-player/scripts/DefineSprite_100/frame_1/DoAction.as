function beginScrolling(target_mc, nArg)
{
   scrollIntervalID = setInterval(scrollText,50,target_mc,nArg);
}
function stopScroll()
{
   clearInterval(scrollIntervalID);
}
function scrollText(target_mc, nArg)
{
   target_mc._y = target_mc._y - nArg * 5;
   var _loc3_ = target_mc._height - 203;
   var _loc1_ = (_loc3_ + target_mc._y) / _loc3_ * 100;
   if(_loc1_ > 100)
   {
      target_mc._y = target_mc._y + nArg * 5;
      _loc1_ = 100;
   }
   if(_loc1_ < 0)
   {
      target_mc._y = target_mc._y + nArg * 5;
      _loc1_ = 0;
   }
   updateScrollBar(_loc1_);
   updateAfterEvent();
}
function updateScrollBar(nArg)
{
   nextY = (scrollBar_mc._height - scroller._height) / 100 * (100 - nArg) + scroller._height / 2;
   scroller._y = nextY;
}
var scrollIntervalID;
up_btn.onPress = function()
{
   beginScrolling(_root.mPlayListMovieClip_mc.playListMC,-1);
};
up_btn.onRelease = function()
{
   stopScroll();
};
up_btn.onReleaseOutside = function()
{
   stopScroll();
};
down_btn.onPress = function()
{
   beginScrolling(_root.mPlayListMovieClip_mc.playListMC,1);
};
down_btn.onRelease = function()
{
   stopScroll();
};
down_btn.onReleaseOutside = function()
{
   stopScroll();
};
