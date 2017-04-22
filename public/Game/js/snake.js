window.onload = function() {
    var area = document.getElementById('area');
    var oSnake = area.getElementsByTagName('div');
    var oFood = document.createElement('span');
    var oScore = document.getElementById('score');
    var oBtn = document.getElementById('btn');
    var addSpeed = document.getElementById('addSpeed');
    var foodGrid = []; //存食物的坐标
    var div_WH = 15; //定义每个div的长度和宽度
    var timer = null;
    init();
    createAFood();
    oBtn.onclick = function() {
        if (num % 2 == 1) {
            clearInterval(timer);
            oBtn.value = '继续游戏';
        } else {
            oBtn.value = "暂停游戏";
            start();
        }
        num++;
        if (gameover) {
            init();
            createAFood();
        }
    };
    addSpeed.onclick = function() {
        if (num % 2 == 1) { //暂停的时候不能加速
            iSpeed = iSpeed > 50 ? iSpeed - 20 : 50;
            clearInterval(timer);
            start();
        }
    }

    function start() {
        timer = setInterval(function() {
            update();
            keyControl();
        }, iSpeed);
    }

    function init() { //初始化游戏
        area.style.width = div_WH * 30 + 'px'; //设置游戏区域
        area.style.height = div_WH * 30 + 'px';
        dir = 2, dirTmp = 2; //初始化方向
        gameover = false; //初始化游戏状态
        area.innerHTML = ''; //删除area下的所有元素
        oScore.innerHTML = '0'; //设置初始成绩为0
        oBtn.value = "开始游戏";
        iSpeed = 120; //速度，越小越快
        num = 0; //暂停、开始中间值
        for (var i = 0; i < 2; i++) { //初始化一条两个节点的蛇
            area.appendChild(document.createElement('div'));
        }
        var snakeX = div_WH * 10,
            snakeY = div_WH * 10; //蛇头的初始位置
        oSnake[0].style.left = snakeX + 'px';
        oSnake[0].style.top = snakeY + 'px';
        for (var i = 1; i < oSnake.length; i++) {
            oSnake[i].style.left = oSnake[i - 1].offsetLeft - div_WH + 'px';
            oSnake[i].style.top = oSnake[i - 1].offsetTop + 'px';
        }
    }

    function keyControl() {
        document.onkeydown = function(ev) {
            var ev = ev || event;
            var keyCode = ev.keyCode;
            switch (keyCode) {
                case 37:
                    dir = 1;
                    break;
                case 38:
                    dir = 3;
                    break;
                case 39:
                    dir = 2;
                    break;
                case 40:
                    dir = 4;
                    break;
            }
        }
    }

    function moveDate() { //判断方向
        var dirNum = [];
        if (dirTmp == 1 && dir == 2 || dirTmp == 2 && dir == 1 || dirTmp == 3 && dir == 4 || dirTmp == 4 && dir == 3) { //防止反向
            dir = dirTmp;
        }
        dirTmp = dir;
        switch (dir) {
            case 1:
                dirNum[0] = -div_WH;
                dirNum[1] = 0;
                break;
            case 2:
                dirNum[0] = div_WH;
                dirNum[1] = 0;
                break;
            case 3:
                dirNum[0] = 0;
                dirNum[1] = -div_WH;
                break;
            case 4:
                dirNum[0] = 0;
                dirNum[1] = div_WH;
                break;
        }
        dirTmp = dir;
        return dirNum;
    }

    function update() { //更新数据	
        var dirNum = moveDate();
        if (oSnake[0].offsetLeft <= 0 && dir == 1 || oSnake[0].offsetLeft >= area.offsetWidth - div_WH - 2 && dir == 2 || oSnake[0].offsetTop <= 0 && dir == 3 || oSnake[0].offsetTop >= area.offsetHeight - div_WH - 2 && dir == 4) { //如果撞墙了
            alert('gameover');
            clearInterval(timer);
            gameover = true;
            oBtn.value = '再来一次';
            return;
        }

        for (var i = 0; i < oSnake.length - 1; i++) {
            if (oSnake[0].offsetLeft == oSnake[i + 1].offsetLeft && oSnake[0].offsetTop == oSnake[i + 1].offsetTop) { //如果撞到自己了
                alert('gameover');
                clearInterval(timer);
                gameover = true;
                oBtn.value = '再来一次';
                return;
            }
        }
        if (oSnake[0].offsetLeft == foodGrid[0] && oSnake[0].offsetTop == foodGrid[1]) { //如果吃到食物
            area.appendChild(document.createElement('div'));
            createAFood();
            oScore.innerHTML = parseInt(oScore.innerHTML) + 1; //分数每次加一
        }
        var aSnake = oldDate();
        oSnake[0].style.left = dirNum[0] + oSnake[0].offsetLeft + 'px';
        oSnake[0].style.top = dirNum[1] + oSnake[0].offsetTop + 'px';

        for (var i = 0; i < aSnake[0].length - 1; i++) {
            oSnake[i + 1].style.left = aSnake[0][i] + 'px';
            oSnake[i + 1].style.top = aSnake[1][i] + 'px';
        }
    }

    function oldDate() { //获取蛇的坐标，存入二维数组,返回该数组,存入顺序，从头到尾
        var aSnake = [],
            aSnakeX = [],
            aSnakeY = [];
        for (var i = 0; i < oSnake.length; i++) {
            aSnakeX.push(oSnake[i].offsetLeft);
            aSnakeY.push(oSnake[i].offsetTop);
        }
        return aSnake = [aSnakeX, aSnakeY];
    }

    function createAFood() { //创建一个食物
        var foodx = parseInt(Math.random() * 30) * div_WH;
        var foody = parseInt(Math.random() * 30) * div_WH;
        for (var i = 0; i < oSnake.length; i++) { //使创建的蛇位置不在蛇身上
            if (oSnake[i].offsetLeft == foodx && oSnake[i].offsetTop == foody)
                createAFood();
        }
        oFood.style.left = foodx + 'px';
        oFood.style.top = foody + 'px';
        area.appendChild(oFood);
        foodGrid = [foodx, foody];
    }
}