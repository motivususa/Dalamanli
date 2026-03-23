on(press){
   this._alpha = 50;
   if(!_root.useRTMP)
   {
      this.startDrag(false,0,0,_parent.loadBar_mc._width - this._width,0);
   }
   else
   {
      this.startDrag(false,0,0,180,0);
   }
   clearInterval(_global.progressInt);
   _root.flager = "false";
}
