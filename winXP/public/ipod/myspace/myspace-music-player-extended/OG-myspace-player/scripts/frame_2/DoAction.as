function mixArray(array)
{
   var _loc3_ = array.length;
   var _loc2_ = array.slice();
   var _loc5_ = undefined;
   var _loc1_ = undefined;
   var _loc4_ = undefined;
   _loc1_ = 0;
   while(_loc1_ < _loc3_)
   {
      _loc4_ = _loc2_[_loc1_];
      _loc2_[_loc1_] = _loc2_[_loc5_ = random(_loc3_)];
      _loc2_[_loc5_] = _loc4_;
      _loc1_ = _loc1_ + 1;
   }
   return _loc2_;
}
function launchBeacon(startend)
{
   var _loc2_ = new XML();
   var _loc1_ = undefined;
   switch(startend)
   {
      case "start":
         _loc1_ = Config.startBeaconURL;
         break;
      case "30sec":
         _loc1_ = Config.thirtySecBeaconURL;
         break;
      case "end":
         _loc1_ = Config.endBeaconURL;
   }
   _loc1_ = _loc1_ + ("?c=" + Math.floor(Math.random() * 100000000));
   trace("sending " + startend + " beacon: " + _loc1_);
   _loc2_.load(_loc1_);
}
function playlist()
{
   _root.flager = "false";
   pauseState = false;
   sCount = parseInt(playsong);
   flipSlide(sCount);
   speakers_mc.attachAudio(in_ns);
   trace("useRTMP = " + useRTMP);
   if(!isProgDwnld)
   {
      if(!useRTMP)
      {
         if(dfs_arr[sCount])
         {
            trace("SCOUNT:" + sCount);
            contentProviderID = 4;
            playOneTimeUrl(dfsUrl_arr[sCount],band_song_id_arr[sCount],contentProviderID);
         }
         else
         {
            contentProviderID = 0;
            playOneTimeUrl(playlist_arr[sCount],band_song_id_arr[sCount],contentProviderID);
         }
      }
      else
      {
         initNetStream();
         contentProviderID = 2;
      }
   }
   else if(dfs_arr[sCount] && isDFSRange())
   {
      contentProviderID = 4;
      playOneTimeUrl(dfsUrl_arr[sCount],band_song_id_arr[sCount],contentProviderID);
   }
   else if(_global.fid > 0 && _global.fid < 200000000)
   {
      contentProviderID = 2;
      playLLNW(band_purl[sCount],contentProviderID);
   }
   else
   {
      contentProviderID = 0;
      playOneTimeUrl(null,band_song_id_arr[sCount],contentProviderID);
   }
}
function initNetStream()
{
   if(!nc.isConnected)
   {
      nc.close();
      nc = new NetConnection();
      var _loc3_ = playlist_arr[sCount].split("/",1);
      if(_loc3_.length != 2)
      {
         _loc3_ = _global.fid.substr(-2);
         _loc3_ = _loc3_.substr(1,1) + _loc3_.substr(0,1);
      }
      ncRoot = _root.appURL + _loc3_;
      nc.connect(ncRoot);
      in_ns = new NetStream(nc);
   }
   else if(!in_ns)
   {
      in_ns = new NetStream(nc);
   }
   playLLNW(playlist_arr[sCount],contentProviderID);
}
function playOneTimeUrl(songPath, songID, contentProviderID)
{
   _root.isOneTimeURL = true;
   soundObj.loadSound(null);
   _root.playStatus.text = "loading...";
   trace("playOneTimeUrl(" + songPath + "," + songID + "," + contentProviderID + ")");
   var _loc6_ = tokenURL + "/services/media/token.ashx?b=" + _global.fid + "&s=" + songID + "&f=0";
   in_ns.close();
   trace("Getting token");
   orgMP3Path = encode(songPath);
   var _loc5_ = new XML();
   _loc5_.load(_loc6_);
   trace(_loc6_);
   _loc5_.onLoad = function(success)
   {
      if(success)
      {
         var _loc4_ = this.firstChild.firstChild.nodeValue;
         _loc4_ = decodeToken(_loc4_);
         if(contentProviderID == 4)
         {
            appURL = songPath + "?bandid=" + _global.fid + "&songid=" + songID + "&token=" + _loc4_ + "&p=" + orgMP3Path + "&a=0";
         }
         else
         {
            appURL = progressiveURL + _global.fid + "&songid=" + songID + "&token=" + _loc4_ + "&p=" + orgMP3Path + "&a=1";
         }
         trace("############################## appURL = " + appURL);
         soundObj = new Sound();
         _soundbuftime = 5;
         soundObj.loadSound(appURL,true);
         soundObj.setVolume(volume.pos._x);
         launchBeacon("start");
         _root.thirtySecondBeaconSent = false;
      }
      else
      {
         trace("Could not retrieve player token");
         _root.playStatus.text = "Error Downloading Music";
         logEvents(musicSong.getbandSongid(),2,musicSong.getbandUserid(),appURL,"One-Time URL failed, could not retrieve player token",5,contentProviderID);
      }
   };
}
function flipSlide(num)
{
   scrollingMc.scrolling_txt.text = song_arr[num];
   alb_desc.htmlText = image_desc[num];
   playCountStr = update_arr[num].split("?",2);
   playCountStr = xmlServiceURL + "/services/media/mediahitcounter.ashx?" + playCountStr[1];
   var _loc4_ = new XML();
   _loc4_.load(playCountStr);
   image_mcl.loadClip(image_arr[num],slideHolder);
   if(_global.haskey == "first")
   {
      _root.first.gotoAndStop(1);
   }
   else if(_global.haskey == "second")
   {
      _root.second.gotoAndStop(1);
      _global.haskey = "third";
   }
   _global.haskey = "third";
   third.gotoAndStop(2);
}
function nt_connect(num_val)
{
   mPlayListMovieClip_mc.changeSelectedTo(num_val);
   if(scrollingDemoIsComplete && _root.scrollBar._visible)
   {
      mPlayListMovieClip_mc.glidePlaylist(num_val,48);
   }
   else
   {
      scrollingDemoIsComplete = true;
   }
   currentSongNum = num_val;
   pausePos = 0;
   eqFrameCount = 0;
   playsong = num_val;
   isProgDwnld = download_arr[num_val];
   trace("NT CONNECT isProgDwnld = " + isProgDwnld);
   trace("auotplay: " + autoplay);
   trace("song number: " + num_val);
   createEmptyMovieClip("stream_mc",1);
   _global.haskey = "first";
   _root.progressbar_mc.reset();
   _root.flager = "false";
   _root.player_status = false;
   if(isPopup)
   {
      lcPopup.testPopup = function(success)
      {
         if(success)
         {
            if(_root.flager == "true" && pauseState == false)
            {
               lcPopup.send("fromPopup","isPlaying",true);
            }
            else
            {
               lcPopup.send("fromPopup","isPlaying",false);
            }
         }
      };
      lcPopup.stopThisTune = function(success)
      {
         if(success)
         {
            stopTune();
            statusTxt.text = "stopped, main player playing";
         }
      };
      playlist();
   }
   else
   {
      lcMain.onStatus = function(infoObject)
      {
         if(infoObject.level == "status")
         {
            lcMain.isPlaying = function(success)
            {
               if(success)
               {
                  _root.playStatus.text = "stopped, standalone playing";
                  autoplay = 1;
               }
               else
               {
                  playlist();
               }
            };
         }
         else
         {
            playlist();
         }
         delete lcMain.onStatus;
      };
      lcMain.stopThisTune = function(success)
      {
         if(success)
         {
            stopTune();
            _root.playStatus.text = "stopped, standalone playing";
         }
      };
      lcMain.send("isPopup","testPopup",true);
   }
}
function pauseTune()
{
   if(pauseState == false)
   {
      pauseState = true;
   }
   else
   {
      pauseState = false;
   }
   if(pauseState == true)
   {
      soundObj.stop();
      pausePos = soundObj.position;
      _root.flager = "false";
      _root.playStatus.text = "paused";
   }
   else
   {
      soundObj.start(pausePos / 1000);
      _root.flager = "true";
      _root.playStatus.text = "playing";
      startEQ();
   }
}
function stopTune()
{
   if(!isProgDwnld && useRTMP)
   {
      trace("WE MIGHT HAVE TO USE THE SOUND OBJECT");
      soundObj.stop();
      pauseTime = 0;
      in_ns.play(null);
      in_ns.close();
   }
   else
   {
      soundObj.stop();
      pauseTime = 0;
      trace("stop");
   }
   _root.first.gotoAndStop(2);
   _root.third.gotoAndStop(1);
   _root.second.gotoAndStop(1);
   _global.haskey = "first";
   _root.progressbar_mc.reset();
   _root.flager = "false";
   _root.playStatus.text = "stopped";
   _root.player_status = false;
}
function setupStream(myStream, streamName)
{
   myStream.onResult = function(streamLength)
   {
      progressbar_mc.startprogress(streamLength);
   };
   if(!isProgDwnld && useRTMP)
   {
      strlength = nc.call("getStreamLength",myStream,streamName);
   }
   else
   {
      strlength = nc.call("getLength",myStream,streamName);
   }
}
function startEQ()
{
   _root.playStatus.text = "playing";
   _root.eq1.gotoAndPlay("start");
   _root.eq2.gotoAndPlay("start");
   _root.eq3.gotoAndPlay("start");
   _root.eq4.gotoAndPlay("start");
   _root.eq5.gotoAndPlay("start");
   _root.eq6.gotoAndPlay("start");
}
function onRightclick(target_mc, obj)
{
   trace("****************You chose: *****************");
}
function init_values()
{
   alb_desc.html = true;
   txt_body.styleSheet = ss;
   txt_body.html = true;
   band_name.text = artist_name;
   plays_today.text = plays;
   downloaded_today.text = downloaded;
   total_plays.text = total;
   txt_body.htmlText = str_str;
   scrollBar.target = txt_body;
   soundObj = new Sound();
   alb_desc.htmlText = image_desc[0];
   if(isPopup == true)
   {
      lcPopup = new LocalConnection();
      lcPopup.connect("isPopup");
      lcPopup.connect("pausePopup");
      trace("isPOPUPautoplay -----------------------------------------" + autoplay);
      _root.nt_connect(_root.playThis);
      image_mcl.loadClip(image_arr[0],slideHolder);
   }
   else
   {
      lcMain = new LocalConnection();
      lcMain.connect("fromPopup");
      trace("autoplay= " + autoplay);
      if((autoplay == "False" || autoplay == 0) && _root.a == 0)
      {
         _root.nt_connect(0);
         image_mcl.loadClip(image_arr[0],slideHolder);
      }
      else if(autoplay == 2 && _root.a == 0)
      {
         _root.nt_connect(aRamdomlyPlayedSongs[nPlayedSongsArrayIndex]);
      }
      else
      {
         _global.haskey = "first";
         image_mcl.loadClip(image_arr[0],slideHolder);
      }
   }
}
function scrollingDemo(textFieldArg_txt, scroller_btn, scrollBar_mc, transTime)
{
   textFieldArg_txt.scroll = 0;
   var oldY = scroller_btn._y;
   var _loc1_ = new mx.transitions.Tween(mPlayListMovieClip_mc.playListMC,"_y",Linear.easeOut,0,203 - mPlayListMovieClip_mc.playListMC._height,transTime,true);
   var _loc4_ = new mx.transitions.Tween(scroller_btn,"_y",Linear.easeOut,oldY,scrollBar_mc._height - scroller_btn._height / 2,transTime,true);
   _loc1_.onMotionFinished = function()
   {
      demoUp_mc._visible = true;
      demoDown_mc._visible = false;
      var _loc1_ = new mx.transitions.Tween(mPlayListMovieClip_mc.playListMC,"_y",Linear.easeOut,203 - mPlayListMovieClip_mc.playListMC._height,0,transTime,true);
      var _loc2_ = new mx.transitions.Tween(scroller_btn,"_y",Linear.easeOut,scrollBar_mc._height - scroller_btn._height / 2,oldY,transTime,true);
      _loc1_.onMotionFinished = function()
      {
         demoUp_mc._visible = false;
         demoDown_mc._visible = false;
         if(currentSongNum != -1)
         {
            mPlayListMovieClip_mc.glidePlaylist(currentSongNum,36);
         }
         scrollingDemoIsComplete = true;
      };
   };
}
function fadeText()
{
   if(msgBox_mc._mc._x != undefined)
   {
      var _loc3_ = new mx.transitions.Tween(msgBox_mc._mc,"_alpha",fl.transitions.easing.Strong.easeIn,100,0,0.5,true);
      var _loc1_ = new mx.transitions.Tween(msgBox_mc._mc,"_xscale",fl.transitions.easing.Strong.easeIn,100,0,0.5,true);
      var _loc2_ = new mx.transitions.Tween(msgBox_mc._mc,"_yscale",fl.transitions.easing.Strong.easeIn,100,0,0.5,true);
      var _loc5_ = new mx.transitions.Tween(msgBox_mc._mc,"_x",fl.transitions.easing.Strong.easeIn,msgBox_mc._mc._width / -2,0,0.5,true);
      var _loc4_ = new mx.transitions.Tween(msgBox_mc._mc,"_y",fl.transitions.easing.Strong.easeIn,msgBox_mc._mc._height / -2,0,0.5,true);
   }
}
function delayedScrollingDemo()
{
   if(mPlayListMovieClip_mc.playListMC._height > 203 && !_root.isPopup && playListsize > 5)
   {
      scrollingDemo(txt_body,scrollBar.scroller,scrollBar.scrollBar_mc,0.5);
   }
   else
   {
      trace("NO SCROLLING DEMO FOR YOU!");
   }
   clearInterval(scrollingDemoIntervalId);
}
var thirtySecondBeaconSent = false;
var mclListener = new Object();
mclListener.onLoadInit = function(target_mc)
{
   slideHolder._xscale = 100;
   slideHolder._yscale = 100;
   if(slideHolder._height > 168)
   {
      var _loc2_ = new flash.display.BitmapData(target_mc._width,target_mc._height,true,0);
      slideHolder.attachBitmap(_loc2_,slideHolder.getNextHighestDepth(),"auto",true);
      var _loc3_ = new flash.geom.Rectangle(0,0,target_mc._width,target_mc._height);
      _loc2_.draw(target_mc,new flash.geom.Matrix(),new flash.geom.ColorTransform(),"normal",_loc3_,true);
      var _loc4_ = 168 / slideHolder._height;
      slideHolder._height = 168;
      slideHolder._width = slideHolder._width * _loc4_;
   }
};
var image_mcl = new MovieClipLoader();
image_mcl.addListener(mclListener);
var scrollingDemoIsComplete = false;
var scrollingMc = ScrollingTextField.createScrollingTextField(this,1.5,145,217,10.3,"Arial",16777215,12,true," ",-3);
var currentSongNum = -1;
var aRamdomlyPlayedSongs = new Array();
var aTempRamdomlyPlayedSongs = new Array();
var nPlayedSongsArrayIndex = 0;
i = 0;
while(i <= playListsize - 2)
{
   aTempRamdomlyPlayedSongs[i] = i;
   i++;
}
aRamdomlyPlayedSongs = mixArray(aTempRamdomlyPlayedSongs);
var traceString = "";
i = 0;
while(i <= playListsize - 2)
{
   traceString = traceString + (":: " + aRamdomlyPlayedSongs[i]);
   i++;
}
trace("PLAYLIST ORDER" + traceString);
var player_status = false;
var ns = new NetConnection();
soundObj.onLoad = function(success)
{
   if(!success)
   {
      logEvents(band_song_id_arr[sCount],2,_global.fid,contentUrl,"Error Downloading Music.",0,contentProviderID);
      _root.playStatus.text = "Error Downloading Music";
   }
};
eqFrameCount = 0;
_root.eq1.onEnterFrame = function()
{
   if(soundObj.getBytesLoaded() > 1000 && !eqFrameCount)
   {
      totalTimeOfMP3 = soundObj.getBytesTotal() * 8 / 96000;
      if(totalTimeOfMP3 < 10)
      {
         totalTimeOfMP3 = soundObj.getBytesTotal() * 8 / 96000;
      }
      eqFrameCount++;
      if(pausePos)
      {
         soundObj.start(pausePos / 1000);
      }
      progressbar_mc.startprogress(totalTimeOfMP3);
      flager = "true";
      startEQ();
      PlayDummy();
   }
};
Sound.prototype.onStatus = function(info)
{
   trace("++++++++++++++++++++++++++Sound.prototype.onStatus() =" + info.code);
};
Sound.prototype.onSoundComplete = function()
{
   trace("SONG " + currentSongNum + " of " + (playListsize - 1) + " ENDED!");
   _root.playStatus.text = "stopped";
   _global.haskey = "first";
   _root.flager = "false";
   player_status = false;
   _root.third.gotoAndStop(1);
   launchBeacon("end");
   if(autoplay == 2 && _root.a == 0)
   {
      if(playlist_arr[nPlayedSongsArrayIndex + 1] == undefined)
      {
         trace("RANDOM PLAYLIST FINISHED!");
         nPlayedSongsArrayIndex = 0;
      }
      else
      {
         nPlayedSongsArrayIndex++;
         _root.nt_connect(aRamdomlyPlayedSongs[nPlayedSongsArrayIndex]);
      }
   }
   else
   {
      temp = parseInt(playsong) + 1;
      if(playlist_arr[temp] == undefined)
      {
         trace("PLAYLIST FINISHED!");
         playsong = 0;
      }
      else
      {
         playsong = parseInt(playsong) + 1;
         nt_connect(playsong);
      }
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
};
NetConnection.prototype.onStatus = function(info)
{
   trace("NetConnection.onStatus> " + info.code);
   if(info.code == "NetConnection.Connect.Failed" || info.code == "NetConnection.Connect.Rejected")
   {
      _root.playStatus.text = "connection failed";
      logEvents(band_song_id_arr[sCount],2,_global.fid,ncRoot,info.code,0,contentProviderID);
   }
};
NetStream.prototype.onStatus = function(info)
{
   trace("NetStream.prototype.onStatus = " + info.code);
   var _loc4_ = ncRoot + "/" + contentUrl;
   if(info.code == "NetStream.Play.Failed" || info.code == "NetStream.Failed" || info.code == "NetStream.Play.StreamNotFound")
   {
      _root.playStatus.text = "stream failed";
      logEvents(band_song_id_arr[sCount],2,_global.fid,_loc4_,info.code,0,contentProviderID);
   }
   if(info.code == "NetStream.Play.Reset" || info.code == "NetStream.Play.Start" || info.code == "NetStream.Unpause.Notify")
   {
      _root.playStatus.text = "buffering";
      if(logTimer.Value == 0)
      {
         logTimer.Start();
      }
      else
      {
         trace("frame count: " + logTimer.Value);
      }
      if(logTimer.Value > logBufferTimeout)
      {
         logEvents(band_song_id_arr[sCount],2,_global.fid,_loc4_,"Buffering exceded 15 seconds",0,contentProviderID);
         logTimer.Reset();
      }
   }
   if(info.code == "NetStream.Play.Stop")
   {
      player_status = true;
      logTimer.Reset();
   }
   if(info.code == "NetStream.Buffer.Empty" && !isProgDwnld && useRTMP)
   {
      if(player_status == true)
      {
         _root.playStatus.text = "stopped";
         _global.haskey = "first";
         _root.flager = "false";
         player_status = false;
         _root.third.gotoAndStop(1);
      }
      else
      {
         _root.playStatus.text = "buffering";
      }
   }
   if(info.code == "NetStream.Pause.Notify")
   {
      if(logTimer.Value > logBufferTimeout)
      {
         logEvents(band_song_id_arr[sCount],2,_global.fid,_loc4_,"Buffering exceded 15 seconds",0,contentProviderID);
         logTimer.Reset();
      }
      _root.playStatus.text = "paused";
   }
   if(info.code == "NetStream.Buffer.Full")
   {
      _root.playStatus.text = "playing";
      _root.flager = "true";
      logTimer.Reset();
      startEQ();
   }
};
init_values();
var scrollingDemoIntervalId = setInterval(delayedScrollingDemo,1000);
stop();
