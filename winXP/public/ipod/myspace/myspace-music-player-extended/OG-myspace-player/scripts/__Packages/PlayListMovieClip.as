class PlayListMovieClip extends MovieClip
{
   function PlayListMovieClip(mTargetArg_mc, nX, nY, nWidth, nHeight, sMainBgColorArg)
   {
      super();
      this._bGlidingAlready = false;
      this._sDefaultVertHome = 0;
      this._oListItems = new Object();
      this._sBgNormalColor = "CCEEEE";
      this._sBgOverColor = "CCDDDD";
      this._sBgDownColor = "CCFFFF";
      this._sBgSelectedColor = "CCCCCC";
      this._sBgOverSelectedColor = "66CCCC";
      this._sDefaultTextFont = "Arial";
      this._sDefaultTextColor = 0;
      this._sDefaultTextSize = 11;
      mTargetArg_mc.createEmptyMovieClip("playlist_mc",mTargetArg_mc.getNextHighestDepth());
      this._playListBaseClip = mTargetArg_mc.playlist_mc;
      this._playListBaseClip._x = nX;
      this._playListBaseClip._y = this._sDefaultVertHome = nY;
      this.makeRect(this._playListBaseClip,nWidth,nHeight,sMainBgColorArg,100);
   }
   function __get__playListMC()
   {
      return this._playListBaseClip;
   }
   function __set__autoplayFlag(arg)
   {
      this._nAutoplayFlagPointer = arg;
      return this.__get__autoplayFlag();
   }
   function __set__targetScrollerMC(mArg)
   {
      this._mAffectedScroller_mc = mArg;
      return this.__get__targetScrollerMC();
   }
   function __set__targetScrollBarMC(mArg)
   {
      this._mAffectedScrollBar_mc = mArg;
      return this.__get__targetScrollBarMC();
   }
   function __set__displayHeight(nArg)
   {
      this._sDisplayHeight = nArg;
      return this.__get__displayHeight();
   }
   function __set__normalColor(sArg)
   {
      this._sBgNormalColor = sArg;
      return this.__get__normalColor();
   }
   function __set__overColor(sArg)
   {
      this._sBgOverColor = sArg;
      return this.__get__overColor();
   }
   function __set__downColor(sArg)
   {
      this._sBgDownColor = sArg;
      return this.__get__downColor();
   }
   function __set__selectedColor(sArg)
   {
      this._sBgSelectedColor = sArg;
      return this.__get__selectedColor();
   }
   function __set__selectedOverColor(sArg)
   {
      this._sBgOverSelectedColor = sArg;
      return this.__get__selectedOverColor();
   }
   function changeSelectedTo(nArg)
   {
      var _loc2_ = this;
      _loc2_.swapBGColor(_loc2_._selectedClip,_loc2_._sBgNormalColor);
      _loc2_._selectedClip.isSelected = false;
      _loc2_._selectedClip = this._parent;
      _loc2_._playListBaseClip["song" + nArg + "_mc"].isSelected = true;
      _loc2_._selectedClip = _loc2_._playListBaseClip["song" + nArg + "_mc"];
      _loc2_.swapBGColor(_loc2_._selectedClip,_loc2_._sBgSelectedColor);
   }
   function addSongClip(newClipName, nX, nY, nWidth, nHeight, userFunctionArg, userFunctionParamArg)
   {
      var _loc3_ = this;
      this._playListBaseClip.createEmptyMovieClip(newClipName,this._playListBaseClip.getNextHighestDepth());
      this._playListBaseClip[newClipName]._x = nX;
      this._playListBaseClip[newClipName]._y = nY;
      this._playListBaseClip[newClipName].isSelected = false;
      this._playListBaseClip[newClipName].createEmptyMovieClip("bg_mc",0);
      this.makeRect(this._playListBaseClip[newClipName].bg_mc,nWidth,nHeight,this._sBgNormalColor,100);
      this._playListBaseClip[newClipName].createEmptyMovieClip("hitArea_mc",1);
      this.makeRect(this._playListBaseClip[newClipName].hitArea_mc,nWidth,nHeight,"000000",0);
      this.initMouseFunctions(this._playListBaseClip[newClipName].hitArea_mc,userFunctionArg,userFunctionParamArg);
   }
   function addActiveText(sTargetNameArg, nXArg, nYArg, userOverFunctionArg, userOverFunctionParam, userClickFunctionArg, userClickFunctionParam, sMsgArg, bScrollOnClick)
   {
      var _loc6_ = this;
      var _loc2_ = this._playListBaseClip[sTargetNameArg];
      var _loc3_ = "activeText" + nXArg + nYArg + "_mc";
      _loc2_.createEmptyMovieClip(_loc3_,_loc2_.getNextHighestDepth());
      _loc2_[_loc3_]._x = nXArg;
      _loc2_[_loc3_]._y = nYArg;
      _loc2_[_loc3_].createEmptyMovieClip("hitArea_mc",1);
      this.makeText(_loc2_[_loc3_],sMsgArg);
      var _loc4_ = _loc2_[_loc3_]._width;
      var _loc5_ = 15;
      this.makeRect(_loc2_[_loc3_].hitArea_mc,_loc4_,_loc5_,"000000",0);
      this.initTextFunctions(_loc2_[_loc3_].hitArea_mc,userOverFunctionArg,userOverFunctionParam,userClickFunctionArg,userClickFunctionParam,bScrollOnClick);
   }
   function glidePlaylist(nArg, nMultiplier)
   {
      if(!this._bGlidingAlready)
      {
         this._bGlidingAlready = true;
         var oClassInstance = this;
         var _loc2_ = oClassInstance._sDisplayHeight;
         if(_loc2_ + nMultiplier > oClassInstance._playListBaseClip._height)
         {
            trace("DISPLAY HEIGHT IS LARGER THAN PLAYLIST HEIGHT... NO SCROLLING FOR YOU!");
            _loc2_ = oClassInstance._sDisplayHeight = oClassInstance._playListBaseClip._height;
         }
         if(nMultiplier * nArg < oClassInstance._playListBaseClip._height - (oClassInstance._sDisplayHeight = oClassInstance._playListBaseClip._height))
         {
            trace("NORMAL GLIDE MAIN");
            var _loc5_ = new mx.transitions.Tween(oClassInstance._playListBaseClip,"_y",mx.transitions.easing.Strong.easeInOut,oClassInstance._playListBaseClip._y,oClassInstance._sDefaultVertHome - nMultiplier * nArg,0.5,true);
            _loc5_.onMotionChanged = function()
            {
               var _loc1_ = oClassInstance._playListBaseClip._height - oClassInstance._sDisplayHeight;
               var _loc3_ = (_loc1_ + oClassInstance._playListBaseClip._y) / _loc1_ * 100;
               var _loc2_ = (oClassInstance._mAffectedScrollBar_mc._height - oClassInstance._mAffectedScroller_mc._height) / 100 * (100 - _loc3_) + oClassInstance._mAffectedScroller_mc._height / 2;
               oClassInstance._mAffectedScroller_mc._y = _loc2_;
               trace("playlistMainGlideFunctionTween: " + oClassInstance._playListBaseClip._y);
            };
            _loc5_.onMotionFinished = function()
            {
               oClassInstance._bGlidingAlready = false;
               trace("NORMAL GLIDING MOTION FINISHED! _bGlidingAlready: " + oClassInstance._bGlidingAlready);
            };
         }
         else
         {
            trace("SHORT GLIDE MAIN");
            var _loc3_ = new mx.transitions.Tween(oClassInstance._playListBaseClip,"_y",mx.transitions.easing.Strong.easeInOut,oClassInstance._playListBaseClip._y,oClassInstance._sDefaultVertHome - oClassInstance._playListBaseClip._height + (oClassInstance._sDisplayHeight = oClassInstance._playListBaseClip._height),0.5,true);
         }
         _loc3_.onMotionChanged = function()
         {
            var _loc1_ = oClassInstance._playListBaseClip._height - oClassInstance._sDisplayHeight;
            var _loc3_ = (_loc1_ + oClassInstance._playListBaseClip._y) / _loc1_ * 100;
            var _loc2_ = (oClassInstance._mAffectedScrollBar_mc._height - oClassInstance._mAffectedScroller_mc._height) / 100 * (100 - _loc3_) + oClassInstance._mAffectedScroller_mc._height / 2;
            oClassInstance._mAffectedScroller_mc._y = _loc2_;
            trace("playlistMainShortGlideFunctionTween " + oClassInstance._playListBaseClip._y);
         };
         _loc3_.onMotionFinished = function()
         {
            oClassInstance._bGlidingAlready = false;
            trace("SHORT GLIDING MOTION FINISHED! _bGlidingAlready: " + oClassInstance._bGlidingAlready);
         };
      }
      else
      {
         trace("Still Gliding!(" + this._bGlidingAlready + ") CAN\'T GLIDE TO: " + (this._sDefaultVertHome - nMultiplier * nArg));
      }
   }
   function addStaticText(sTargetNameArg, nXArg, nYArg, sMsgArg)
   {
      var _loc4_ = this;
      var _loc2_ = this._playListBaseClip[sTargetNameArg];
      trace("targetContainer_mc: " + _loc2_);
      var _loc3_ = "staticText" + nXArg + nYArg + "_mc";
      _loc2_.createEmptyMovieClip(_loc3_,_loc2_.getNextHighestDepth());
      _loc2_[_loc3_]._x = nXArg;
      _loc2_[_loc3_]._y = nYArg;
      this.makeText(_loc2_[_loc3_],sMsgArg);
   }
   function initTextFunctions(targetArg_mc, userOverFunctionArg, userOverFunctionParam, userClickFunctionArg, userClickFunctionParam, bScrollOnClick)
   {
      var oClassInstance = this;
      targetArg_mc.onRollOver = function()
      {
         if(this._parent._parent.isSelected)
         {
            userOverFunctionArg(userOverFunctionParam);
            oClassInstance.swapBGColor(this._parent._parent,oClassInstance._sBgOverSelectedColor);
         }
         else
         {
            userOverFunctionArg(userOverFunctionParam);
            oClassInstance.swapBGColor(this._parent._parent,oClassInstance._sBgOverColor);
         }
      };
      targetArg_mc.onRelease = function()
      {
         oClassInstance._nAutoplayFlagPointer = 0;
         userClickFunctionArg(userClickFunctionParam);
         if(bScrollOnClick && !oClassInstance._bGlidingAlready)
         {
            oClassInstance.swapBGColor(oClassInstance._selectedClip,oClassInstance._sBgNormalColor);
            oClassInstance._selectedClip.isSelected = false;
            oClassInstance._selectedClip = this._parent._parent;
            this._parent._parent.isSelected = true;
            oClassInstance.swapBGColor(this._parent._parent,oClassInstance._sBgSelectedColor);
            var _loc2_ = oClassInstance._sDisplayHeight;
            if(_loc2_ > oClassInstance._playListBaseClip._height)
            {
               trace("DISPLAY HEIGHT IS LARGER THAN PLAYLIST HEIGHT... NO SCROLLING FOR YOU!");
               _loc2_ = oClassInstance._sDisplayHeight = oClassInstance._playListBaseClip._height;
            }
            if(oClassInstance._sDefaultVertHome - this._parent._parent._y > (oClassInstance._sDisplayHeight = oClassInstance._playListBaseClip._height) - oClassInstance._playListBaseClip._height)
            {
               trace("NORMAL GLIDE TEXT, Target Y: " + (oClassInstance._sDefaultVertHome - this._parent._parent._y));
               var _loc7_ = new mx.transitions.Tween(oClassInstance._playListBaseClip,"_y",mx.transitions.easing.Strong.easeInOut,oClassInstance._playListBaseClip._y,oClassInstance._sDefaultVertHome - this._parent._parent._y,0.5,true);
               _loc7_.onMotionChanged = function()
               {
                  var _loc1_ = oClassInstance._playListBaseClip._height - oClassInstance._sDisplayHeight;
                  var _loc3_ = (_loc1_ + oClassInstance._playListBaseClip._y) / _loc1_ * 100;
                  var _loc2_ = (oClassInstance._mAffectedScrollBar_mc._height - oClassInstance._mAffectedScroller_mc._height) / 100 * (100 - _loc3_) + oClassInstance._mAffectedScroller_mc._height / 2;
                  oClassInstance._mAffectedScroller_mc._y = _loc2_;
                  trace("tweeeeeen..." + oClassInstance._playListBaseClip._y);
               };
            }
            else
            {
               trace("SHORT GLIDE TEXT");
               var _loc5_ = new mx.transitions.Tween(oClassInstance._playListBaseClip,"_y",mx.transitions.easing.Strong.easeInOut,oClassInstance._playListBaseClip._y,oClassInstance._sDefaultVertHome - oClassInstance._playListBaseClip._height + (oClassInstance._sDisplayHeight = oClassInstance._playListBaseClip._height),0.5,true);
               _loc5_.onMotionChanged = function()
               {
                  var _loc1_ = oClassInstance._playListBaseClip._height - oClassInstance._sDisplayHeight;
                  var _loc3_ = (_loc1_ + oClassInstance._playListBaseClip._y) / _loc1_ * 100;
                  var _loc2_ = (oClassInstance._mAffectedScrollBar_mc._height - oClassInstance._mAffectedScroller_mc._height) / 100 * (100 - _loc3_) + oClassInstance._mAffectedScroller_mc._height / 2;
                  oClassInstance._mAffectedScroller_mc._y = _loc2_;
                  trace("tweeeeeen..." + oClassInstance._playListBaseClip._y);
               };
            }
         }
         else
         {
            var _loc4_ = undefined;
            if(oClassInstance._bGlidingAlready)
            {
               _loc4_ = "Still Gliding!";
            }
            else
            {
               _loc4_ = "This text is not allowed to activate scrolling.";
            }
            trace(_loc4_ + " CAN\'T TEXT GLIDE TO: " + (oClassInstance._sDefaultVertHome - this._parent._parent._y));
         }
      };
      targetArg_mc.onRollOut = function()
      {
         if(this._parent._parent.isSelected)
         {
            oClassInstance.swapBGColor(this._parent._parent,oClassInstance._sBgSelectedColor);
         }
         else
         {
            oClassInstance.swapBGColor(this._parent._parent,oClassInstance._sBgNormalColor);
         }
      };
   }
   function initMouseFunctions(targetArg_mc, functionArg, userFunctionParamArg)
   {
      var oClassInstance = this;
      targetArg_mc.onRollOver = function()
      {
         if(this._parent.isSelected)
         {
            oClassInstance.swapBGColor(this._parent,oClassInstance._sBgOverSelectedColor);
         }
         else
         {
            oClassInstance.swapBGColor(this._parent,oClassInstance._sBgOverColor);
         }
      };
      targetArg_mc.onPress = function()
      {
         oClassInstance.swapBGColor(this._parent,oClassInstance._sBgDownColor);
         functionArg(userFunctionParamArg);
      };
      targetArg_mc.onRelease = function()
      {
         oClassInstance._nAutoplayFlagPointer = 0;
         oClassInstance.swapBGColor(oClassInstance._selectedClip,oClassInstance._sBgNormalColor);
         oClassInstance._selectedClip.isSelected = false;
         oClassInstance._selectedClip = this._parent;
         this._parent.isSelected = true;
         oClassInstance.swapBGColor(this._parent,oClassInstance._sBgSelectedColor);
         var _loc2_ = oClassInstance._sDisplayHeight;
         if(_loc2_ > oClassInstance._playListBaseClip._height)
         {
            trace("DISPLAY HEIGHT IS LARGER THAN PLAYLIST HEIGHT... NO SCROLLING FOR YOU!");
            _loc2_ = oClassInstance._sDisplayHeight = oClassInstance._playListBaseClip._height;
         }
         if(!oClassInstance._bGlidingAlready)
         {
            if(oClassInstance._sDefaultVertHome - this._parent._y > - oClassInstance._playListBaseClip._height - (oClassInstance._sDisplayHeight = oClassInstance._playListBaseClip._height))
            {
               trace("NORMAL GLIDE HIT AREA.  REQUESTED Y: " + (oClassInstance._sDefaultVertHome - this._parent._y));
               var _loc6_ = new mx.transitions.Tween(oClassInstance._playListBaseClip,"_y",mx.transitions.easing.Strong.easeInOut,oClassInstance._playListBaseClip._y,oClassInstance._sDefaultVertHome - this._parent._y,0.5,true);
               _loc6_.onMotionChanged = function()
               {
                  var _loc1_ = oClassInstance._playListBaseClip._height - oClassInstance._sDisplayHeight;
                  var _loc3_ = (_loc1_ + oClassInstance._playListBaseClip._y) / _loc1_ * 100;
                  var _loc2_ = (oClassInstance._mAffectedScrollBar_mc._height - oClassInstance._mAffectedScroller_mc._height) / 100 * (100 - _loc3_) + oClassInstance._mAffectedScroller_mc._height / 2;
                  oClassInstance._mAffectedScroller_mc._y = _loc2_;
                  trace("tweeeeeen..." + oClassInstance._playListBaseClip._y);
               };
            }
            else
            {
               trace("SHORT GLIDE HIT AREA.  REQUESTED Y: " + (oClassInstance._sDefaultVertHome - this._parent._y));
               var _loc4_ = new mx.transitions.Tween(oClassInstance._playListBaseClip,"_y",mx.transitions.easing.Strong.easeInOut,oClassInstance._playListBaseClip._y,oClassInstance._sDefaultVertHome - oClassInstance._playListBaseClip._height + (oClassInstance._sDisplayHeight = oClassInstance._playListBaseClip._height),0.5,true);
               _loc4_.onMotionChanged = function()
               {
                  var _loc1_ = oClassInstance._playListBaseClip._height - oClassInstance._sDisplayHeight;
                  var _loc3_ = (_loc1_ + oClassInstance._playListBaseClip._y) / _loc1_ * 100;
                  var _loc2_ = (oClassInstance._mAffectedScrollBar_mc._height - oClassInstance._mAffectedScroller_mc._height) / 100 * (100 - _loc3_) + oClassInstance._mAffectedScroller_mc._height / 2;
                  oClassInstance._mAffectedScroller_mc._y = _loc2_;
                  trace("tweeeeeen..." + oClassInstance._playListBaseClip._y);
               };
            }
         }
         else
         {
            trace("Still Gliding!(" + oClassInstance._bGlidingAlready + ") CAN\'T HIT AREA GLIDE TO: " + (oClassInstance._sDefaultVertHome - this._parent._y));
         }
      };
      targetArg_mc.onRollOut = function()
      {
         if(this._parent.isSelected)
         {
            oClassInstance.swapBGColor(this._parent,oClassInstance._sBgSelectedColor);
         }
         else
         {
            oClassInstance.swapBGColor(this._parent,oClassInstance._sBgNormalColor);
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
      _loc3_.font = this._sDefaultTextFont;
      _loc3_.color = this._sDefaultTextColor;
      _loc3_.size = this._sDefaultTextSize;
      _loc2_.setNewTextFormat(_loc3_);
      _loc2_.htmlText = sArg;
   }
   function swapBGColor(targetClip, sArg)
   {
      targetClip.bg_mc.removeMovieClip();
      targetClip.createEmptyMovieClip("bg_mc",0);
      this.makeRect(targetClip.bg_mc,targetClip._width,targetClip._height,sArg,100);
   }
}
