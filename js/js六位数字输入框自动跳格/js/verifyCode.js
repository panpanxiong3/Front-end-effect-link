let verifyCodeDOMUtil = {
    buildCodeModule:function (mainId,id) {
        let verify_code_div = document.createElement("div")
        verify_code_div.classList.add("verify_code_div")
        verify_code_div.setAttribute("id",id)


        {
            for (let i = 0; i < 6; i++) {
                let verify_code_char = document.createElement("div")
                verify_code_char.classList.add("verify_code_char")
                {
                    let input = document.createElement("input")
                    input.classList.add("verify_code_char_input")
                    input.setAttribute("maxlength","1")
                    input.setAttribute("type", "tel")
                    input.setAttribute("char",(i+1))
                    input.setAttribute("place",i+"")

                    {
                        if(i == 0 && browserUtil.isPc){
                            input.setAttribute("autofocus","")
                        }
                    }

                    {
                        verify_code_char.appendChild(input)
                    }

                    {
                        verify_code_div.appendChild(verify_code_char)
                    }
                }
            }
        }

        document.getElementById(mainId).appendChild(verify_code_div)
    }
}
let verifyCode = {
    charArray : null,
    inputArray : null,
    mainElem : null,
    charCount : null,
    inputCount : null,
    onFinish : null,
    that :null,
    lastCode : null,
    waitTime : 20,
    send : true,
    init : function (id) {
        this.mainElem = document.getElementById(id)
        this.charArray = this.mainElem.querySelectorAll(".verify_code_char")
        this.inputArray = this.mainElem.querySelectorAll(".verify_code_char_input")
        this.charCount = this.charArray.length
        this.inputCount = this.inputArray.length

        if(this.charCount != this.inputCount){
            console.log("The number of input fields is not equal to the number of character fields")
            return
        }
        this.bindAllInputEventByOnKeyDown()
        this.bindAllInputEventByClick()
        this.bindAllInputEventByFocus()
        this.bindAllInputEventByPaste()
        this.bindAllInputEventByBlur()
    },
    bindAllInputEventByOnKeyDown : function () {
        for (let i = 0; i < this.inputCount; i++) {
            let that = this
            this.inputArray[i].onkeydown = function (event) {
                return that.eventByOnKeyDown(that,event,this)
            }
        }
    },
    bindAllInputEventByClick : function () {
        for (let i = 0; i < this.inputCount; i++) {
            let that = this
            this.inputArray[i].onclick = function (event) {
                that.eventByOnClick(that,this)
            }
        }
    },
    bindAllInputEventByFocus : function () {
        for (let i = 0; i < this.inputCount; i++) {
            let that = this
            this.inputArray[i].onfocus = function (event) {
                that.eventByOnFocus(that,this)
            }
        }
    },
    bindAllInputEventByPaste : function () {
        for (let i = 0; i < this.inputCount; i++) {
            let that = this
            this.inputArray[i].onpaste = function (event) {
                return that.eventByOnPaste(that,event,this)
            }
        }
    },
    bindAllInputEventByBlur : function () {
        for (let i = 0; i < this.inputCount; i++) {
            let that = this
            this.inputArray[i].onblur = function (event) {
                that.eventByOnBlur(that,this)
            }
        }
    },
    eventByOnKeyDown : function(that,event,elem){
        let index = parseInt(elem.getAttribute("place"))
        if(this.isNumberByKeyCode(event.keyCode)){
            this.clearValue(index)

            that.nextInput(elem)

            that.ifExecuteSend(that)
            return true
        }
        if(event.keyCode == 9){
            let count = this.inputCount
            if(this.inputArray[--count] == elem){
                return true
            }
            that.nextInput(elem)
            return false
        }
        if(event.keyCode == 8){
            let index = parseInt(elem.getAttribute("place"))
            if(this.isValue(index)){
                this.clearValue(index)
                that.isRefresh(that)
                return false
            }
            if(this.isLast(index)){
                this.clearValue(--index)
            }
            that.lastInput(elem)
            that.isRefresh(that)
            return true
        }
        if(event.keyCode == 37 || event.keyCode == 38){
            that.lastInput(elem)
        }
        if(event.keyCode ==39 || event.keyCode ==40){
            that.nextInput(elem)
        }
        if(event.keyCode == 86 && that.lastCode == 17){

            return  true
        }
        this.lastCode = event.keyCode
        return false
    },
    isRefresh : function(that){
        setTimeout(function () {
            if(that.isAllNull()){
                that.inputArray[0].focus()
            }
        },(this.waitTime+20))
    },
    eventByOnPaste : function(that,event,elem){
        let index = parseInt(elem.getAttribute("place"))
        let clipboardData = event.clipboardData || window.clipboardData;
        let pastedData = clipboardData.getData('Text');
        let j = 0
        let strLength = index + pastedData.length

        if(that.isNumbersByStr(pastedData)){
            for (let i = index; i < that.inputCount ; i++) {
                if(i == (strLength)){
                    that.nextInput(that.inputArray[--i])
                    that.ifExecuteSend(that)
                    return
                }
                that.inputArray[i].value = pastedData[j]
                j++
            }
            let count = that.inputCount-2
            that.nextInput(that.inputArray[count])
        }

        that.ifExecuteSend(that)
        return false
    },
    ifExecuteSend : function(that){
        setTimeout(function () {
            if(that.isFinish()){
                if(that.onFinish!=null && that.isSend()){
                    that.clearAllFocus()
                    that.clearAllActionState()
                    that.banAllInput()
                    that.setSendState(false)

                    let array = [that.findAllValue(),that.that]
                    that.onFinish.apply(that,array)
                }
            }
        },(that.waitTime))
    },
    eventByOnClick : function(that,elem){
        that.clearAllActionState()
        that.setActionState(elem,true)
    },
    eventByOnFocus : function(that,elem){
        that.setActionState(elem,true)
    },
    eventByOnBlur : function(that,elem){
        that.clearAllActionState()
    },
    isNumberByKeyCode : function (keyCode) {
        return (keyCode>=48 && keyCode <=57) || (keyCode>=96 && keyCode <=105)
    },
    isNumbersByStr : function(str){
        for (let i = 0; i < str.length; i++) {
            let number = parseInt(str[i],10)
            if(!isNaN(number)){
                if(number < 0){
                    return false
                }
            }else{
                return false
            }
        }
        return true
    },
    nextInput : function (elem) {
        let index = parseInt(elem.getAttribute("place"))
        if(!this.isNext(index)){
            return
        }
        let that = this
        setTimeout(function () {
            that.inputArray[++index].focus()

        },this.waitTime)
    },
    lastInput : function (elem) {
        let index = parseInt(elem.getAttribute("place"))
        if(!this.isLast(index)){
            return
        }
        let that = this
        setTimeout(function () {
            that.inputArray[--index].focus()
        },this.waitTime)
    },
    setActionState : function (elem,bool) {
        if(bool){
            elem.classList.add("verify_code_char_input_state_action")
        }else{
            elem.classList.remove("verify_code_char_input_state_action")
        }
    },
    clearAllActionState : function () {
        for (let i = 0; i < this.inputCount; i++) {
            this.inputArray[i].classList.remove("verify_code_char_input_state_action")
        }
    },
    isNext : function (index) {
        if(index >= (this.inputCount-1)){
            return false
        }
        return true
    },
    isLast : function (index) {
        if(index <= 0){
            return false
        }
        return true
    },
    isAllNull : function(){
        for (let i = 0; i < this.inputCount; i++) {
            if(this.inputArray[i].value != "" ){
                return false
            }
        }
        return true
    },
    clearValue : function (index) {
        this.inputArray[index].value = ""
    },
    isValue : function (index) {
        let elem = this.inputArray[index]
        if(elem.value == null || elem.value == ""){
            return false
        }
        return true
    },
    clearAllValue : function () {
        for (let i = 0; i < this.inputCount; i++) {
            this.clearValue(i)
        }
    },
    clearAllFocus : function(){
        for (let i = 0; i < this.inputCount; i++) {
            this.inputArray[i].blur()
        }
    },
    isFinish : function () {
        for (let i = 0; i < this.inputCount; i++) {
            if(!this.isValue(i)){
                return false
            }
        }
        return true
    },
    findAllValue : function () {
        let str = ""
        for (let i = 0; i < this.inputCount; i++) {
            str+=this.inputArray[i].value
        }
        return str
    },
    banAllInput : function () {
        for (let i = 0; i < this.inputCount; i++) {

            this.inputArray[i].setAttribute("disabled","")
        }
    },
    normalAllInput : function () {
        for (let i = 0; i < this.inputCount; i++) {
            this.inputArray[i].removeAttribute("disabled")
        }
    },
    setSendState : function (bool) {
        this.send = bool
    },
    isSend : function () {
        return this.send
    },
    reset : function () {
        this.normalAllInput()
        this.clearAllValue()
        this.setSendState(true)
        if(browserUtil.isPc){
            this.inputArray[0].focus()
        }

    }
}