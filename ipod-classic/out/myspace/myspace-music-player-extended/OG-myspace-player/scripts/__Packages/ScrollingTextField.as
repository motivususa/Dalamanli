class ScrollingTextField extends MovieClip
{
   function ScrollingTextField()
   {
      super();
   }
   static function createScrollingTextField(containerMc, scrollSpeed, maskWidthArg, nX, nY, fontArg, fontColorArg, fontSizeArg, fontBoldBoolArg, initTextValue, leadingPadPixelAdjustment)
   {
      containerMc.createEmptyMovieClip("_mc",containerMc.getNextHighestDepth());
      var scrollingText_mc = containerMc._mc;
      scrollingText_mc._x = nX;
      scrollingText_mc._y = nY;
      scrollingText_mc.createTextField("scrolling_txt",scrollingText_mc.getNextHighestDepth(),0,0,0,0);
      var tField_txt = scrollingText_mc.scrolling_txt;
      tField_txt.html = true;
      tField_txt.selectable = false;
      tField_txt.autoSize = "left";
      tField_txt.multiline = false;
      tField_txt.wordWrap = false;
      tField_txt.embedFonts = true;
      var _loc1_ = new TextFormat();
      _loc1_.bold = fontBoldBoolArg;
      _loc1_.font = fontArg;
      _loc1_.color = fontColorArg;
      _loc1_.size = fontSizeArg;
      tField_txt.setNewTextFormat(_loc1_);
      tField_txt.htmlText = initTextValue;
      scrollingText_mc.createEmptyMovieClip("mask_mc",1);
      scrollingText_mc.mask_mc.beginFill(16711680,100);
      scrollingText_mc.mask_mc.lineStyle(0,16711680,100);
      scrollingText_mc.mask_mc.moveTo(0,0);
      scrollingText_mc.mask_mc.lineTo(maskWidthArg,0);
      scrollingText_mc.mask_mc.lineTo(maskWidthArg,tField_txt._height);
      scrollingText_mc.mask_mc.lineTo(0,tField_txt._height);
      scrollingText_mc.mask_mc.lineTo(0,0);
      scrollingText_mc.mask_mc.endFill();
      function scrollTextField()
      {
         if(tField_txt._width > scrollingText_mc.mask_mc._width)
         {
            if(tField_txt._x < scrollingText_mc.mask_mc._width - tField_txt._width || tField_txt._x > 0)
            {
               scrollSpeed = scrollSpeed * -1;
            }
            tField_txt._x = tField_txt._x - scrollSpeed;
            updateAfterEvent();
         }
         else
         {
            tField_txt._x = scrollingText_mc.mask_mc._x + leadingPadPixelAdjustment;
         }
      }
      if(tField_txt._width > scrollingText_mc.mask_mc._width)
      {
         tField_txt._x = scrollingText_mc.mask_mc._x + scrollingText_mc.mask_mc._width;
      }
      scrollingText_mc.setMask(scrollingText_mc.mask_mc);
      scrollingText_mc.onEnterFrame = function()
      {
         scrollTextField();
      };
      return scrollingText_mc;
   }
}
