stop();
inv_btn.onPress = function()
{
   gotoAndStop("shrink");
   play();
   removingText = true;
};
msg_txt.html = true;
var msgVar;
var removingText = false;
inv_btn.enabled = false;
