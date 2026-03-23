on(release){
   _root.autoplay = 0;
   temp = parseInt(_root.playsong) - 1;
   if(_root.playlist_arr[temp] == undefined)
   {
      _root.playsong = playlist_arr.length - 1;
      nt_connect(_root.playsong);
   }
   else
   {
      _root.playsong = parseInt(_root.playsong) - 1;
      nt_connect(_root.playsong);
   }
   if(_global.haskey == "first")
   {
      _root.first.gotoAndStop(1);
      _global.haskey = "third";
   }
   else if(_global.haskey == "second")
   {
      _root.second.gotoAndStop(1);
      _global.haskey = "third";
   }
   _root.third.gotoAndStop(2);
   _root.flager = "false";
}
