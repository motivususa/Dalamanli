class Timer
{
   function Timer()
   {
      this.Reset();
   }
   function __get__Value()
   {
      if(this._start == 0)
      {
         return 0;
      }
      if(this._pause > 0)
      {
         return this._pause - this._start;
      }
      var _loc3_ = getTimer() / 1000;
      var _loc2_ = _loc3_ - this._start;
      trace("timer value: " + _loc2_);
      return _loc2_;
   }
   function Start()
   {
      trace("timer start");
      if(this._pause > 0)
      {
         this._start = this._start + (getTimer() / 1000 - this._pause);
         this._pause = 0;
      }
      else
      {
         this._start = getTimer() / 1000;
      }
   }
   function Stop()
   {
      trace("timer stop");
      if(this._start > 0 && this._pause == 0)
      {
         this._pause = getTimer() / 1000;
      }
   }
   function Reset()
   {
      trace("timer reset");
      this._start = 0;
      this._pause = 0;
   }
}
