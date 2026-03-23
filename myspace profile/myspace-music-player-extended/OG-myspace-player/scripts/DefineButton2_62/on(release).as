on(release){
   _root.autoplay = 0;
   temp = parseInt(playsong) + 1;
   if(playlist_arr[temp] == undefined)
   {
      playsong = 0;
      nt_connect(0);
   }
   else
   {
      playsong = parseInt(playsong) + 1;
      nt_connect(playsong);
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
