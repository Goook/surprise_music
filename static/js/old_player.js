$(function () {
    Audio = {
        audio: $('#audio')[0],
        srcs: [],
        currentIndex: 0,
        musicName: [],
        musicSinger: [],
        musicPicture: [],
        backImage: [],
        rowsId : [],
        lrc: [],
        lyrics: '',
    };

    const ELEMENT = {
        btnLike: '.btn1',
        btnAdd: '.btn2',
        btnDownload: '.btn3',
        btnDel: '.btn4',
        btnFlush: '.btn5',
        channel: '.channel',
        durationProgress: '.progress',
        currentTimeProgress : '.progress-runaway',
        btnProgress: '.progress-btn',
        iconVolume: '.volume-btn',
        btnVolume: '.volume-btn-mobile',
        volumeProgress: '.volume-progress',
        currentVolumeProgress: '.volume-runaway',
        duration: '.progress-span2',
        currentTime: '.progress-span1',
        btnPre: '.pre',
        btnNext: '.next',
        btnPlay: '.audio_play',
        btnPause: '.audio_pause',
        playingMusicName: '.playing-music',
        playingSingerName: '.playing-singer',
        serialNumber: '.serial-number',
        musicList: '.music_list',
        musicName: '.music_name',
        singerMsgPic: '.singer_msg_picture',
        musicMsgName: '.music_msg_name',
        singerMsgName: '.singer_msg_name',
        albumMsgName: '.album_msg_name',
        pictureBackground: '#pic_bg',
        singerDownloadId: '#single-download',
        divLike: '.div_like',
        divWhile: '.div_while',
        window: '.windows',
        allCheck: '.all_check',
        singerCheck: '.singer-check',
        lyrics: '.lyrics',

    };

    var beginProgressLocation = $(ELEMENT.btnProgress).offset().left;
    var endProgressLocation = $(ELEMENT.durationProgress).outerWidth() + beginProgressLocation;
    var beginVolumeLocation = $(ELEMENT.btnVolume).offset().left;
    var endVolumeLocation = $(ELEMENT.volumeProgress).outerWidth() + beginVolumeLocation;
    var currentVolume = Audio.audio.volume;
    var isWhile = 0;

    function parseLyric(text) {
        //将文本分隔成一行一行，存入数组
        var lines = text.split('\n'),
            //用于匹配时间的正则表达式，匹配的结果类似[xx:xx.xx]
            pattern = /\[\d{2}:\d{2}.\d{2}\]/g,
            //保存最终结果的数组
            result = [];
        //去掉不含时间的行
        while (!pattern.test(lines[0])) {
            lines = lines.slice(1);
        };
        //上面用'\n'生成生成数组时，结果中最后一个为空元素，这里将去掉
        lines[lines.length - 1].length === 0 && lines.pop();
        lines.forEach(function(v /*数组元素值*/ , i /*元素索引*/ , a /*数组本身*/ ) {
            //提取出时间[xx:xx.xx]
            var time = v.match(pattern),
            //提取歌词
            value = v.replace(pattern, '');
            //因为一行里面可能有多个时间，所以time有可能是[xx:xx.xx][xx:xx.xx][xx:xx.xx]的形式，需要进一步分隔
            time.forEach(function(v1, i1, a1) {
                //去掉时间里的中括号得到xx:xx.xx
                var t = v1.slice(1, -1).split(':');
                //将结果压入最终数组
                if(value)
                    result.push([Math.floor(parseInt(t[0], 10) * 60 + parseFloat(t[1])), value]); //
            });
        });
        //最后将结果数组中的元素按时间大小排序，以便保存之后正常显示歌词
        result.sort(function(a, b) {
            return a[0] - b[0];
        });
        return result;
    }

    function getLyric(url) {
        //建立一个XMLHttpRequest请求
        var request = new XMLHttpRequest();
        //配置, url为歌词地址，比如：'./content/songs/foo.lrc'
        request.open('GET', url, true);
        //因为我们需要的歌词是纯文本形式的，所以设置返回类型为文本
        request.responseType = 'text';
        //一旦请求成功，但得到了想要的歌词了
        request.onload = function() {
            //这里获得歌词文件
            Audio.lyrics = parseLyric(request.response);
            $('#lyrics-msg').remove();
            $(ELEMENT.lyrics).append($("<div id='lyrics-msg'></div>"))
            Audio.lyrics.forEach(function (v, i, l) {
                $('#lyrics-msg').append($("<p data-index="+ i +" "+"data-play="+ v[0]+">"+v[1]+"</p>"));
            });
        };
        //向服务器发送请求
        request.send();
    }

    // Audio.audio.ontimeupdate()

    // setInterval(function () {
    //     let cur = Audio.audio.currentTime;
    //     for (let i = 0; i < Audio.lyrics.length; i++)
    //         if (cur < Audio.lyrics[i][0]) {
    //             $("#" + parseInt(Audio.lyrics[i][0])).css('color', '#31c27c');
    //             break;
    //         }
    // }, 100);

    Audio.audio.ontimeupdate = function () {
        // for (let i = 0; i < Audio.lyrics.length; i++){
        //     if (this.currentTime >= Math.floor(Audio.lyrics[i][0])) {
        //         $("#" + Audio.lyrics[i][0]).stop().addClass('active').siblings().removeClass('active')
        //         // $("#" + parseInt(Audio.lyrics[i][0])).css('color', '#31c27c');
        //     }else{
        //         return ;
        //     }
        //
        // }
        let curTime = Math.floor(this.currentTime)
        $('#lyrics-msg p').each(function () {
            playTime = $(this).data('play')
            if(curTime == playTime){
                $(this).stop().addClass('active').siblings().removeClass('active')
            }else{
                return;
            }
            var index = $(this).data("index"); //当前元素下标
            var lineHeight =$(this).height() ; //一行歌词高度
            var boxHeight = $('#lyrics-msg').height(); //歌词显示区域高度
            var screensize = boxHeight / lineHeight; //一屏显示多少句歌词
            var half = Math.floor(screensize / 2); //半屏歌词数量
            //当前歌词超过半屏
            if(index > half){
                //计算出超过的高度 减去 一行歌词的高度
                var top = (half - index) * lineHeight + lineHeight
                $('#lyrics-msg').css({
                "top" : parseInt(top) + "px"
                });
            }
        })
    };
    // 改变界面背景和歌曲信息,歌词信息
    function changeHtmlPlayMessage(url, preId, currentId) {
        $(preId).find('a').css('color', '#c9c9c9');
        $(preId).find('label').css('color', '#c9c9c9');
        $(currentId).find('a').css('color', 'white');
        $(currentId).find('label').css('color', 'white');
        $(ELEMENT.playingMusicName).html(Audio.musicName[Audio.currentIndex]);
        $(ELEMENT.playingSingerName).html(Audio.musicSinger[Audio.currentIndex]);
        $(ELEMENT.singerMsgPic).attr('src',Audio.musicPicture[Audio.currentIndex]);
        $(ELEMENT.singerMsgName).find('a').html(Audio.musicSinger[Audio.currentIndex]);
        $(ELEMENT.musicMsgName).find('a').html(Audio.musicName[Audio.currentIndex]);
        $(ELEMENT.albumMsgName).find('a').html(Audio.musicName[Audio.currentIndex]);
        $(ELEMENT.pictureBackground).css('background-image', 'url('+Audio.backImage[Audio.currentIndex]+')');
        $(ELEMENT.singerDownloadId).attr('download', Audio.musicName[Audio.currentIndex] + '.mp4');
        $(ELEMENT.singerDownloadId).attr('href', Audio.srcs[Audio.currentIndex]);
        let musicId = currentId.substr(1);
        $.cookie('music_id', musicId) ;
        getLyric(url);
    }




    // 设置全选
    $(ELEMENT.allCheck).click(function () {
        if($(this).is(':checked')){
            $(ELEMENT.singerCheck).prop('checked',true);
        }
        else $(ELEMENT.singerCheck).prop('checked',false);
    });


    // 以下内容为五个按钮所对应的事件

    //添加按钮事件
    $(ELEMENT.btnAdd).mouseover(function () {
        $(this).find('i').css('background-image','url("/static/images/add_icon_2.png")');
        $(this).find('span').css('color','white');
    });
    $(ELEMENT.btnAdd).mouseout(function () {
        $(this).find('i').css('background-image','url("/static/images/add_icon_1.png")');
        $(this).find('span').css('color','#c9c9c9');
    });

    // 收藏按钮事件
    $(ELEMENT.btnLike).mouseover(function () {
        $(this).find('i').css('background-image','url("/static/images/collect_1.png")');
        $(this).find('span').css('color','white');
    });
    $(ELEMENT.btnLike).mouseout(function () {
        $(this).find('i').css('background-image','url("/static/images/collect.png")');
        $(this).find('span').css('color','#c9c9c9');
    });
    // 点击收藏按钮所执行的函数
    function addToLike(){
        let selectedMusicId = [];
        $(ELEMENT.singerCheck).each(function () {
            if($(this).is(':checked')){
                selectedMusicId.push($(this).attr('value'));
            }
        });

        $.ajax({
             type: "POST",
             url: "/player/like_selected/",
             traditional:true,
             data: {'list': selectedMusicId},
             success: function(response) {
                 let myWindow = $(ELEMENT.window)
                 myWindow.find('span').html(response);
                 myWindow.css('display', 'block');
                 setTimeout(function () {
                     myWindow.css('display', 'none');
                 }, 1000);
             },
        });
    }
    $(ELEMENT.btnLike).click(addToLike);


    //下载按钮
    $(ELEMENT.btnDownload).mouseover(function () {
        $(this).find('i').css('background-image','url("/static/images/download_icon_2.png")');
        $(this).find('span').css('color','white');
    });
    $(ELEMENT.btnDownload).mouseout(function () {
        $(this).find('i').css('background-image','url("/static/images/download_icon_1.png")');
        $(this).find('span').css('color','#c9c9c9');
    });

    // 清空按钮对应事件
    $(ELEMENT.btnFlush).mouseover(function () {
        $(this).find('i').css('background-image','url("/static/images/flush_2.png")');
        $(this).find('span').css('color','white');
    });
    $(ELEMENT.btnFlush).mouseout(function () {
        $(this).find('i').css('background-image','url("/static/images/flush_1.png")');
        $(this).find('span').css('color','#c9c9c9');
    });

    // 删除按钮对应事件
    $(ELEMENT.btnDel).mouseover(function () {
        $(this).find('i').css('background-image','url("/static/images/del_2.png")');
        $(this).find('span').css('color','white');
    });
    $(ELEMENT.btnDel).mouseout(function () {
        $(this).find('i').css('background-image','url("/static/images/del_1.png")');
        $(this).find('span').css('color','#c9c9c9');
    });




    // 点击播放暂停按钮
    $(ELEMENT.btnPlay).click(function () {
            let btn = $(this);
            btn.toggleClass('audio_pause');
            btn.toggleClass('audio_play');
            if (Audio.audio.paused)
                Audio.audio.play();
            else
                Audio.audio.pause();
        }
    );
    $(ELEMENT.btnPause).click(function () {
            let btn = $(this);
            btn.toggleClass('audio_pause');
            btn.toggleClass('audio_play');
            if (Audio.audio.paused)
                Audio.audio.play();
            else
                Audio.audio.pause();
        }
    );
    loadInitial();
    Audio.audio.oncanplay = function () {
        time = parseInt(Audio.audio.duration);
        minute = parseInt(time / 60);
        if (minute < 10) minute = '0' + minute;
        second = time - minute * 60;
        if (second < 10) second = '0' + second;
        $(ELEMENT.duration).html(minute + ':' + second);
        // $(ELEMENT.playingMusicName).html(Audio.musicName[Audio.currentIndex]);
        // $(ELEMENT.playingSingerName).html(Audio.musicSinger[Audio.currentIndex]);
    };

    // 音量键点击时静音
    $(ELEMENT.iconVolume).click(function () {
        $(this).toggleClass('volume-btn');
        $(this).toggleClass('volume-btn-mute');
        Audio.audio.volume = Audio.audio.volume ? 0 : currentVolume;
    });

    $(ELEMENT.currentVolumeProgress).click(function (e) {
        let currentVolumeLocation = e.pageX;
        let volumeLength = currentVolumeLocation - beginVolumeLocation;
        if (currentVolumeLocation >= beginVolumeLocation && currentVolumeLocation <= endVolumeLocation) {
            $(ELEMENT.btnVolume).css('left', currentVolumeLocation);
            $(this).css('width', volumeLength);
            // let currentRunWidth = $('.volume-runaway').outerWidth();
            Audio.audio.volume = volumeLength / $(ELEMENT.volumeProgress).outerWidth();
            currentVolume = Audio.audio.volume;
        }
    });

    // 点击音量进度条增加音量
    $(ELEMENT.volumeProgress).click(function (e) {
        let currentVolumeLocation = e.pageX;
        let volumeLength = currentVolumeLocation - beginVolumeLocation;
        if (currentVolumeLocation >= beginVolumeLocation && currentVolumeLocation <= endVolumeLocation) {
            $(ELEMENT.btnVolume).css('left', currentVolumeLocation);
            $(ELEMENT.currentVolumeProgress).css('width', volumeLength);
            // let currentRunWidth = $('.volume-runaway').outerWidth();
            Audio.audio.volume = volumeLength / $(this).outerWidth();
            currentVolume = Audio.audio.volume;
            volume = Audio.audio.volume;
        }
    });

    var movingProgress =false;  //判断播放进度条是否正在移动

    // 进度条跟随播放进度
    function playChangeProgress() {
        if(!movingProgress) {
            let currentPlayTime = Audio.audio.currentTime;
            let duration = Audio.audio.duration;
            let progressLength = $(ELEMENT.durationProgress).outerWidth();
            let runawayLength = currentPlayTime / duration * progressLength;
            $(ELEMENT.currentTimeProgress).css('width', runawayLength);
            // $('.progress-span2').html(beginLeft + runawayLength);
            $(ELEMENT.btnProgress).css('left', beginProgressLocation + runawayLength);
        }
    }

    setInterval(playChangeProgress, 50);


    var isMove = false;  //当为true 是  移动事件被监听
    var isWho = false;  // 当为false时  执行音量函数   当为true时,执行进度条函数.

    $(ELEMENT.btnProgress).mousedown(function () {
        isMove = true;
        isWho = true

    });

    $(ELEMENT.btnVolume).mousedown(function () {
        isMove = true;
        isWho = false;
    });


    $(document).mousemove(function (e) {
        if (isMove) {
            if (isWho) {
                movingProgress = true;
                let currentProgressLocation = e.pageX;
                let progressLength = currentProgressLocation - beginProgressLocation;  // - ;
                if (currentProgressLocation >= beginProgressLocation && currentProgressLocation <= endProgressLocation) {
                    $(ELEMENT.btnProgress).css('left', currentProgressLocation);
                    $(ELEMENT.currentTimeProgress).css('width', progressLength);
                    Audio.audio.currentTime = progressLength /
                        (endProgressLocation - beginVolumeLocation) * Audio.audio.duration
                }
            }
            else {
                currentVolumeLocation = e.pageX;
                let volumeLength = currentVolumeLocation - beginVolumeLocation;
                if (currentVolumeLocation >= beginVolumeLocation && currentVolumeLocation <= endVolumeLocation) {
                    $(ELEMENT.btnVolume).css('left', currentVolumeLocation);
                    $(ELEMENT.currentVolumeProgress).css('width', volumeLength);
                    Audio.audio.volume = volumeLength / (endVolumeLocation - currentVolumeLocation);
                    volume = Audio.audio.volume;
                }
            }

        }
    }).mouseup(function () {
        if (isMove) {
            let currentRunWidth = $(ELEMENT.currentTimeProgress).outerWidth();
            Audio.audio.currentTime = currentRunWidth / $(ELEMENT.durationProgress).outerWidth() * Audio.audio.duration;
            movingProgress = false;  //拖拽结束时继续使用定时器
        }
        isMove = false;
    });

    // 点击进度条跳转到对应播放时间
    $(ELEMENT.durationProgress).click(function (e) {
        let currentProgressLocation = e.pageX;
        let progressLength = currentProgressLocation - beginProgressLocation;  // - ;
        if (currentProgressLocation >= beginProgressLocation && currentProgressLocation <= endProgressLocation) {
            $(ELEMENT.btnProgress).css('left', currentProgressLocation);
            $(ELEMENT.currentTimeProgress).css('width', progressLength);
            Audio.audio.currentTime = $(ELEMENT.currentTimeProgress).outerWidth() /
                $(ELEMENT.durationProgress).outerWidth() * Audio.audio.duration;
        }
    });
    $(ELEMENT.currentTimeProgress).click(function (e) {
        let currentProgressLocation = e.pageX;
        let progressLength = currentProgressLocation - beginProgressLocation;  // - ;
        if (currentProgressLocation >= beginProgressLocation && currentProgressLocation <= endProgressLocation) {
            $(ELEMENT.btnProgress).css('left', currentProgressLocation);
            $(this).css('width', progressLength);
            Audio.audio.currentTime = $(ELEMENT.currentTimeProgress).outerWidth()
                / $(ELEMENT.durationProgress).outerWidth() * Audio.audio.duration;
        }
    });

    $(ELEMENT.btnPre).click(function () {
        let preId = Audio.rowsId[Audio.currentIndex];
        let targetIndex = Audio.currentIndex - 1;
        if(isWhile === 0){}
        else if(isWhile === 1){
            targetIndex = Audio.currentIndex;
        }else{
            targetIndex = Math.floor(Math.random()*Audio.srcs.length);
        }
        Audio.currentIndex = targetIndex < 0 ? Audio.srcs.length - 1 : targetIndex;
        Audio.audio.src = Audio.srcs[Audio.currentIndex];
        let currentId = Audio.rowsId[Audio.currentIndex];
        let url = Audio.lrc[Audio.currentIndex];
        changeHtmlPlayMessage(url, preId, currentId);
        Audio.audio.play()
    });

    function nextMusic(){
        let preId = Audio.rowsId[Audio.currentIndex];
        let targetIndex = Audio.currentIndex + 1;
        if(isWhile === 0){}
        else if(isWhile === 1){
            targetIndex = Audio.currentIndex;
        }else{
            targetIndex = Math.floor(Math.random()*Audio.srcs.length);
        }
        Audio.currentIndex = targetIndex > Audio.srcs.length - 1 ? 0 : targetIndex;
        Audio.audio.src = Audio.srcs[Audio.currentIndex];
        let currentId = Audio.rowsId[Audio.currentIndex];
        let url = Audio.lrc[Audio.currentIndex];
        changeHtmlPlayMessage(url, preId,currentId);
        Audio.audio.play()
    }

    $(ELEMENT.btnNext).click(nextMusic);
    Audio.audio.onended = nextMusic;

    function displayCurrentTime() {
        span = $(ELEMENT.currentTime);
        time = parseInt(Audio.audio.currentTime);
        minute = parseInt(time / 60);
        if (minute < 10) minute = '0' + minute;
        second = time - minute * 60;
        if (second < 10) second = '0' + second;
        span.html(minute + ':' + second);
    }

    var timer = setInterval(displayCurrentTime, 100);

    //双击音乐名字播放音乐
    $(ELEMENT.musicName).dblclick(function (e) {
        let preId = Audio.rowsId[Audio.currentIndex];
        let currentId = $(this).data('id');
        let targetIndex = $(currentId).find(ELEMENT.serialNumber).html() - 1;
        Audio.currentIndex = targetIndex >= 0 && targetIndex <= Audio.srcs.length -1 ? targetIndex : 0;
        Audio.audio.src = Audio.srcs[Audio.currentIndex];
        let url = Audio.lrc[Audio.currentIndex];
        changeHtmlPlayMessage(url, preId,currentId);
        Audio.audio.play();
    })

    var isLike = false;
    //点击收藏按钮收藏音乐
    $(ELEMENT.divLike).click(function () {
        let musicId = $.cookie('music_id');
        $(this).toggleClass('div_like_click');
        $(this).toggleClass('div_like');
        if(isLike) isLike = false;
        else isLike = true;
        $.post("/player/like/",{"music_id": musicId, 'is_like': isLike },function(response,status,xhr){
            let myWindow = $(ELEMENT.window)
            myWindow.find('span').html(response);
            myWindow.css('display', 'block');
            setTimeout(function () {
                myWindow.css('display', 'none');
            },1000)
        });
        // $(this).css('background-image', 'url("/static/images/like_icon_5.png")');
    });

    // 设置循环播放模式
    $(ELEMENT.divWhile).click(function () {
        isWhile = (isWhile + 1) % 3;
        if(isWhile === 0){
            $(this).css('background-image', 'url("/static/images/while_play.png")')
        }else if(isWhile === 1){
            $(this).css('background-image', 'url("/static/images/singer_play.png")')
        }else{
            $(this).css('background-image', 'url("/static/images/random_play.png")')
        }
    });

});