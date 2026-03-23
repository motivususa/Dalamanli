class ToolTipClip
{
   function ToolTipClip(nXArg, nYArg, sTextColorArg, sColorArg, nAlphaArg, sMsgArg, bDropShadow)
   {
      this._sTextColor = sTextColorArg;
      var delayCounter = 0;
      _root.createEmptyMovieClip("toolTip_mc",_root.getNextHighestDepth());
      var tt_mc = _root.toolTip_mc;
      tt_mc._x = nXArg + 15;
      tt_mc._y = nYArg;
      this.makeText(tt_mc,sMsgArg);
      var _loc4_ = tt_mc._width;
      var _loc5_ = tt_mc._height;
      this.makeRect(tt_mc,_loc4_,_loc5_,sColorArg,nAlphaArg);
      if(bDropShadow)
      {
         var _loc3_ = new flash.filters.DropShadowFilter(5,70,0,0.15,1.5,1.5,1,3,false,false,false);
         tt_mc.filters = new Array(_loc3_);
      }
      var _loc6_ = new mx.transitions.Tween(tt_mc,"_alpha",mx.transitions.easing.Strong.easeInOut,0,100,1.5,true);
      _root.onMouseMove = function()
      {
         delayCounter++;
         if(delayCounter == 15)
         {
            tt_mc.removeMovieClip();
            delete _root.onMouseMove;
            delayCounter = 0;
         }
      };
   }
   function makeRect(mContainerArg_mc, nWidth, nHeight, sColorArg, nAlphaArg)
   {
      mContainerArg_mc.beginFill(Number("0x" + sColorArg),nAlphaArg);
      mContainerArg_mc.lineStyle(0,Number("0x" + sColorArg),nAlphaArg);
      mContainerArg_mc.moveTo(0,0);
      mContainerArg_mc.lineTo(nWidth,0);
      mContainerArg_mc.lineTo(nWidth,nHeight);
      mContainerArg_mc.lineTo(0,nHeight);
      mContainerArg_mc.lineTo(0,0);
      mContainerArg_mc.endFill();
   }
   function makeText(mTarget_mc, sArg)
   {
      mTarget_mc.createTextField("text_txt",2,0,0,0,0);
      var _loc2_ = mTarget_mc.text_txt;
      _loc2_.autoSize = true;
      _loc2_.html = true;
      _loc2_.multiline = true;
      _loc2_.selectable = false;
      var _loc3_ = new TextFormat();
      _loc3_.font = "Arial";
      _loc3_.color = Number("0x" + this._sTextColor);
      _loc3_.size = 10;
      _loc2_.setNewTextFormat(_loc3_);
      _loc2_.htmlText = sArg;
   }
}
