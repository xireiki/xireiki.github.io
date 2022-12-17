"use strict"

function CopyText(text){
  const clip = navigator.clipboard;
  if(!text){
    return
  };
  if(!clip){
    alert("您的浏览器不支持复制文本");
  }
  clip.writeText(text)
    .then(() => {
      alert("已复制文本到剪贴板");
    })
    .catch(err => {
      if(err.name == "NotAllowedError"){
        let cb = document.createElement("button");
        cb.id = "cb";
        cb.style.width = "1px";
        cb.style.height = "1px";
        document.body.appendChild(cb);
        let clipboardjs = new ClipboardJS("#cb", {
          text: function(){
            return text
          }
        });
        clipboardjs.on("success", () => {
          alert("已复制文本到剪贴板");
          cb.remove();
        });
        clipboardjs.on("error", () => {
          alert("复制失败,请检查您的浏览器设置");
          cb.remove();
        });
        document.getElementById("cb").click();
      } else {
        alert("复制失败：" + err);
      }
    });
}

function legado(url, beh){
  if(url.startsWith("/")){
    let port;
    ((location.protocol == "http:" && location.port == "80") || (location.protocol == "https:" && location.port == "443") || location.port == "") ? port = "" : port = `:${location.port}`;
    url = `${location.protocol}//${location.hostname}${port}${url}`;
  }
  if(beh == "copy"){
    CopyText(url);
  } else {
    open(`legado://import/bookSource?src=${url}`)
  }
}