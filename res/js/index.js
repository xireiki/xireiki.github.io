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
        alert("请不要使用套壳浏览器，我们不支持在这类浏览器中复制链接");
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