on(release){
   if(_global.haskey == "first")
   {
      _root.playTune(_root.playsong);
      _root.first.gotoAndStop(1);
      _global.haskey = "third";
   }
   else if(_global.haskey == "second")
   {
      _root.second.gotoAndStop(1);
      _root.pauseTune();
      _global.haskey = "third";
   }
   _global.haskey = "third";
   gotoAndStop(2);
}
