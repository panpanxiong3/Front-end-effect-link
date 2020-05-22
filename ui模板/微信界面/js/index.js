(function(){
    var btn = document.querySelectorAll('.service-list-button-txt');
    var list = document.querySelectorAll(".service-list-wrapper");

    [].forEach.call(btn,function(item,index){
        item.addEventListener("click",function(){
            list[index].classList.toggle("service-list-wrapper-show");
            item.textContent = item.textContent == "更多服务" ? "收起": "更多服务";
        })
    });
})();