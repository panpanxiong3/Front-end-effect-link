window.onload = function () {
  var biger = document.getElementById('biger');
  var main = document.getElementById('main');
  var smaller = document.getElementById('smaller');
  var mask = document.getElementById('mask');
  var wrap = biger.parentNode;
  var imgArr = [
      {"path":"./images/banner1.jpg"},
      {"path":"./images/banner2.jpg"},
      {"path":"./images/banner3.jpg"},
      {"path":"./images/banner4.jpg"},
      {"path":"./images/banner5.jpg"}
  ];
  var imgSum = imgArr.length;
  if(imgSum > 5){
      imgSum = 5;
  }
  for (var i = 0; i<imgSum; i++){
      var  lis = document.createElement('li');
      var  imgs = document.createElement('img');
      imgs.src = imgArr[i].path;
      lis.appendChild(imgs);
      smaller.appendChild(lis);
  }
  var mainImg = document.createElement('img');
  var bigImg = document.createElement('img');
  var liArr = smaller.children;
  bigImg.src = mainImg.src = liArr[0].children[0].src;
  main.insertBefore(mainImg,mask);
  biger.appendChild(bigImg);
  var bigPic = biger.children[0];
  liArr[0].className = 'current';
  for (var i=0; i<liArr.length;i++){
      liArr[i].index = i;
      liArr[i].onclick = function () {
          this.className = 'current';
          bigPic.src = main.children[0].src = this.children[0].src;
          for (var j = 0; j < liArr.length; j++) {
              if(this!=liArr[j]){
                  liArr[j].removeAttribute('class');
                  liArr[j].removeAttribute('className');
              }
          }
      }
  }
  main.onmouseenter = function () {
      mask.style.display = 'block';
      biger.style.display = 'block';
  }
    main.onmouseleave=function(){
        mask.style.display='none';
        biger.style.display='none';
    }
  main.onmousemove = function (e) {
      var e = e || window.event;
      var pagex = e.pageX || scroll().left + e.clientX;
      var pagey = e.pageY || scroll().top + e.clientY;
      pagex = pagex - wrap.offsetLeft - mask.offsetWidth / 2;
      pagey = pagey - wrap.offsetTop - mask.offsetHeight / 2 ;
      if(pagex<0){
          pagex=0;
      }
      if(pagey<0){
          pagey=0;
      }
      if(pagex>main.offsetWidth-mask.offsetWidth){
          pagex=main.offsetWidth-mask.offsetWidth;
      }
      if(pagey>main.offsetHeight-mask.offsetHeight){
          pagey=main.offsetHeight-mask.offsetHeight;
      }
      mask.style.left=pagex+'px';
      mask.style.top=pagey+'px';
      var scale=(bigPic.offsetWidth-biger.offsetWidth)/(main.offsetWidth-mask.offsetWidth);
      var xx=pagex*scale;
      var yy=pagey*scale;
      bigPic.style.left=-xx+'px';
      bigPic.style.top=-yy+'px';
  }
};