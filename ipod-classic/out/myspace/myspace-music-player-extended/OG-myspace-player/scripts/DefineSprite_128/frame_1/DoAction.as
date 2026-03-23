var notAlreadyFading = true;
_global.temp = false;
var temp_time = 0;
var curr_time = 0;
var minutes = 0;
posx = 0;
currentProp = "_xscale";
currentTarget = buffer_bar;
setProp(posx,currentProp,currentTarget);
loadBar_mc._xscale = 0;
function setProp(position, prop, target)
{
   var _loc3_ = position;
   var _loc2_ = 200;
   var _loc1_ = 100;
   var _loc4_ = _loc3_ / _loc2_ * _loc1_;
   target[prop] = _loc4_;
}
function moveProgressBar()
{
   if(!_root.isProgDwnld && _root.useRTMP)
   {
      curr_time = _root.in_ns.time;
   }
   else
   {
      curr_time = _root.soundObj.position / 1000;
   }
   curr_time = curr_time;
   if(curr_time > 30 && !_root.thirtySecondBeaconSent)
   {
      _root.launchBeacon("30sec");
      _root.thirtySecondBeaconSent = true;
   }
   _root.timecounter.text = formattime(curr_time);
   if(Math.floor(curr_time) % 2 == 1)
   {
      _root.totalTimeOfMP3 = _root.soundObj.getBytesTotal() * 8 / 96000;
      _global.knobscale = 180 / _root.totalTimeOfMP3;
      _global.bufferscale = 100 / _root.totalTimeOfMP3;
   }
   scale = curr_time * _global.knobscale;
   scale2 = curr_time * _global.bufferscale + 1;
   var _loc3_ = undefined;
   _loc3_ = _root.soundObj.getBytesLoaded() / _root.soundObj.getBytesTotal() * 100;
   if(_global.length_stream > 20)
   {
      progress_knob._x = scale;
      buffer_bar._xscale = scale2;
      loadBar_mc._xscale = _loc3_;
      if(_loc3_ > 99 && notAlreadyFading)
      {
         notAlreadyFading = false;
         var _loc5_ = new mx.transitions.Tween(dots_mc,"_alpha",fl.transitions.easing.Strong.easeIn,100,0,3,true);
         var _loc4_ = new mx.transitions.Tween(colorBar_mc,"_alpha",fl.transitions.easing.Strong.easeIn,100,0,3,true);
      }
      else
      {
         if(!notAlreadyFading && _loc3_ < 99)
         {
            notAlreadyFading = true;
            colorBar_mc._alpha = 100;
            dots_mc._alpha = 100;
         }
         dots_mc._x = loadBar_mc._x + loadBar_mc._width / 2;
         dots_mc._y = loadBar_mc._y + loadBar_mc._height / 2;
      }
   }
   if(_root.in_ns.bufferLength < 1 && !_root.isProgDwnld && _root.useRTMP)
   {
      _root.flager = "false";
      trace("_root.flager=false;");
   }
}
function formattime(length)
{
   length = parseInt(length);
   hrs = Math.floor(length / 3600);
   min = length - hrs * 3600;
   min = Math.floor(min / 60);
   sec = length - hrs * 3600 - min * 60;
   if(sec < 10)
   {
      sec = "0" + sec;
   }
   if(min < 10)
   {
      min = "0" + min;
   }
   format_time = min + ":" + sec;
   return format_time;
}
function reset()
{
   progress_knob._x = 0;
   buffer_bar._xscale = 0;
   clearInterval(_global.progressInt);
   _root.timecounter.text = "00:00";
}
function startprogress(streamlength)
{
   trace("startprogress is called and streamLenght = " + streamlength);
   reset();
   streamlength = Math.floor(streamlength);
   _global.bufferscale = 100 / streamlength;
   _global.knobscale = 180 / streamlength;
   _global.length_stream = streamlength;
   trace("_global.length_stream  = " + _global.length_stream);
   clearInterval();
   if(streamlength > 1)
   {
      _global.progressInt = setInterval(moveProgressBar,1);
   }
}
if(_root.useRTMP)
{
   loadBar_mc._visible = false;
}
