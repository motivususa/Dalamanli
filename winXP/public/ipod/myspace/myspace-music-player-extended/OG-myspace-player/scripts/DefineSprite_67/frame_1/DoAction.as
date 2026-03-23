function setVolume(position)
{
   _root.soundObj.setVolume(parseInt(position));
}
function setProp(position, prop, target)
{
   var _loc4_ = position;
   var _loc3_ = 138;
   var _loc2_ = 100;
   var _loc1_ = _loc4_ / _loc3_ * _loc2_;
   setVolume(_loc1_);
   target[prop] = _loc1_;
}
function startSlider(active)
{
   if(active)
   {
      this.onMouseMove = function()
      {
         setProp(pos._x,currentProp,currentTarget);
         updateAfterEvent();
      };
   }
   else
   {
      this.onMouseMove = null;
   }
}
pos._x = 70;
currentProp = "_xscale";
currentTarget = _parent.content;
setProp(pos._x,currentProp,currentTarget);
