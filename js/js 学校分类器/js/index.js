

(function () {//代码块
    var provinceNode = document.getElementById('province'); //获取省会的元素
    var cityNode = document.getElementById('city'); //获取城市的元素
    var schoolNode = document.getElementById('school'); //获取院校的select元素

    var len = province.length; //获取数组的长度
    //拼接字符串的方式 
    var provinceStr = '';
    for (var i = 0; i < len; i++) {
        provinceStr += '<option value = ' + province[i][0] + '>' + province[i][1] + '</option>'
    }
    console.log(provinceStr)
    provinceNode.innerHTML = provinceStr;

    //打印一下 省会的value 
    console.log(provinceNode.value)

    //第二步， 把对应的城市的数组 找出来
    var cityArr = city[provinceNode.value]; //找到数组  
    console.log(cityArr);
    var cityStr = ''
    for (var i = 0; i < cityArr.length; i++) {
        cityStr += '<option value = ' + cityArr[i][0] + '>' + cityArr[i][1] + '</option>'
    }
    // console.log(cityStr)
    cityStr+= '<option>其他</option>'
    cityNode.innerHTML = cityStr;

    //第三步： 把对应的院校数组  找出；
    var schoolArr = allschool[cityNode.value]; //cityNode.value//317 对象的应用
    console.log(schoolArr);
    var schoolStr = ''
    for (var i = 0; i < schoolArr.length; i++) {
        schoolStr += '<option >' + schoolArr[i][2] + '</option>'
    }
    // console.log(cityStr)
    schoolStr+= '<option>其他</option>'
    schoolNode.innerHTML = schoolStr;

// 三级联动
//一，改变省会，----》城市和学校改变

provinceNode.onchange = function(){

    var cityArr = city[provinceNode.value]; //找到数组  
    console.log(cityArr);
    var cityStr = ''
    for (var i = 0; i < cityArr.length; i++) {
        cityStr += '<option value = ' + cityArr[i][0] + '>' + cityArr[i][1] + '</option>'
    }
    // console.log(cityStr)
    cityStr+= '<option>其他</option>'
    cityNode.innerHTML = cityStr;

    //第三步： 把对应的院校数组  找出；
    var schoolArr = allschool[cityNode.value]; //cityNode.value//317 对象的应用
    console.log(schoolArr);
    var schoolStr = ''
    for (var i = 0; i < schoolArr.length; i++) {
        schoolStr += '<option >' + schoolArr[i][2] + '</option>'
    }
    // console.log(cityStr)
    schoolNode.innerHTML = schoolStr;

}

cityNode.onchange = function(){

    var schoolArr = allschool[cityNode.value]; //cityNode.value//317 对象的应用
    if(schoolArr){
        console.log(schoolArr);
        var schoolStr = ''
        for (var i = 0; i < schoolArr.length; i++) {
            schoolStr += '<option >' + schoolArr[i][2] + '</option>'
        }
        // console.log(cityStr)
        schoolNode.innerHTML = schoolStr;
    }else{
        schoolNode.innerHTML =  '<option>其他</option>';
    }

   


}



})()