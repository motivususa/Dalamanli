on(releaseOutside,release){
   this._alpha = 100;
   if(_root.flager == "true" && _root.pauseState == false)
   {
      _root.playStatus.text = "playing";
   }
   else
   {
      _root.playStatus.text = "";
   }
   if(_root.useRTMP)
   {
      if(_root.in_ns)
      {
         trace(_global.length_stream);
         _root.in_ns.seek(_global.length_stream / 180 * this._x);
         _parent.buffer_bar._xscale = 0.5555555555555556 * this._x;
      }
   }
   else
   {
      var songLength = Math.round(_root.totalTimeOfMP3);
      trace("SONG LENGTH: " + songLength);
      playAt = songLength * (this._x / 180);
      trace("ATTEMPTING TO SEEK TO " + playAt + " THIS X: " + this._x);
      _root.soundObj.pause();
      _root.soundObj.start(playAt);
      _parent.buffer_bar._xscale = 0.5555555555555556 * this._x;
   }
   _root.startEQ();
   this.stopDrag();
   _root.flager = "true";
   _global.progressInt = setInterval(_parent.moveProgressBar,1);
}
