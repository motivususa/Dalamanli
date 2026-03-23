on(release){
   var url = "http://collect.myspace.com/music/popup.cfm?num=" + _root.playsong + "&time=" + _root.curr_time + "&fid=" + _global.fid + "&uid=1&t=" + _root.t + "d=" + _root.d;
   if(_root.popUpSizeChangeFlag)
   {
      flash.external.ExternalInterface.call("window.open",url,"_blank","width=450,height=345,scrollbars=no,top=0");
      trace("target height=345");
   }
   else
   {
      flash.external.ExternalInterface.call("window.open",url,"_blank","width=450,height=345,scrollbars=no,top=0");
      trace("target height=345");
   }
   _root.stopTune();
   _root.status.text = "stopped, standalone playing";
}
