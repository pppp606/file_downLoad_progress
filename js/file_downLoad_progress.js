/**
@class FileDownLoadProgress
@method loadFile
@param {string} options overWriteDefaults
*/
var FileDownLoadProgress = {
  viewFlug:"fastTime",
  defaults:{
    url:"",
    type:"GET",
    dataType:"",
    success:function(){},
    error:function(){},
    speedThreshold:0.4
  },
  settings:{},
  loadFile:function(options){
    this.settings = $.extend({}, this.defaults, options);
    this.addProgressBar();
    $.ajax({
      url:this.settings.url,
      type:this.settings.type,
      context:this,
      success:function(data){
        this.settings.success();
        this.removeProgressBar();
      },
      error:function(data){
        this.settings.error();
        this.removeProgressBar();
      },
      xhr:function(){
        //add event the Progress for XHR
        xhr = $.ajaxSettings.xhr();
        xhr.addEventListener("progress",this.progress);
        return xhr;
      },
      progress:function(ev){
        //check speed at the first event
        if(FileDownLoadProgress.viewFlug == "fastTime"){
          FileDownLoadProgress.viewFlug = FileDownLoadProgress.checkProgressBarNecessity(ev);
        }
        if(FileDownLoadProgress.viewFlug){
          //change for value in progress
          $('#progress').progressbar('value',(ev.loaded / ev.total) * 100);
        }
      }
    });
  },
  addProgressBar:function(){
    $('body').html('<div id="progress">');
    $('#progress').progressbar({value:0,max:100});
  },
  removeProgressBar:function(){
    $('#progress').animate({opacity:0},500,function(){
      $(this).remove();
    });
    this.viewFlug = "fastTime";
  },
  checkProgressBarNecessity:function(ev){
    return ev.loaded / ev.total < this.settings.speedThreshold;
  }
}