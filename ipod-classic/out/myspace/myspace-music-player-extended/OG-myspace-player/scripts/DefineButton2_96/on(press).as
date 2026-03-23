on(press){
   this.startDrag(false,0,_parent.scrollBar_mc._y + _parent.scroller._height / 2 + 0.5,0,_parent.scrollBar_mc._height - _parent.scroller._height / 2);
   _root.onMouseMove = function()
   {
      per = Math.round((_parent.scroller._y - _parent.scroller._height / 2) / (_parent.scrollBar_mc._height - _parent.scroller._height) * 100);
      var _loc3_ = _root.mPlayListMovieClip_mc.playListMC;
      nextY = (_loc3_._height - 203) * ((- per) / 100);
      _loc3_._y = nextY;
   };
}
