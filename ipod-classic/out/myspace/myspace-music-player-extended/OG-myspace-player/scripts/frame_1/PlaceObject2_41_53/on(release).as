on(release){
   if(_root.in_ns || _root.soundObj)
   {
      if(_global.haskey == "first")
      {
         _root.first.gotoAndStop(1);
      }
      else if(_global.haskey == "third")
      {
         _root.third.gotoAndStop(1);
         _global.haskey = "second";
         _root.pauseTune();
      }
      else if(_global.haskey == "second")
      {
         _root.third.gotoAndStop(2);
         _global.haskey = "third";
         _root.pauseTune();
      }
   }
   gotoAndStop(2);
}
