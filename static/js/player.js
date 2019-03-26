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
        iconVolume: '.volume-btn-click',
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

    function loadInitial(){
        let volumeLength = Audio.audio.volume * (endVolumeLocation- beginVolumeLocation);
        let currentVolumeLeft = volumeLength + $(ELEMENT.btnVolume).css('left');
        if (currentVolumeLeft >= beginVolumeLocation && currentVolumeLeft <= endVolumeLocation) {
            $(ELEMENT.btnVolume).css('left', currentVolumeLeft);
            $(ELEMENT.currentVolumeProgress).css('width', volumeLength);
        }
        $(ELEMENT.musicName).each(function () {
            Audio.musicSinger.push($(this).data('singer'));
            Audio.musicName.push($(this).text());
            Audio.srcs.push($(this).data('music_path'));
            Audio.musicPicture.push($(this).data('picture'));
            Audio.backImage.push($(this).data('back'));
            Audio.rowsId.push($(this).data('id'));
            Audio.lrc.push($(this).data('lrc'));
        });
        let currentId = $(ELEMENT.musicList).data('play_id');
        Audio.currentIndex = $(currentId).find(ELEMENT.serialNumber).html() -1;
        Audio.audio.src=Audio.srcs[Audio.currentIndex];
        let url = Audio.lrc[Audio.currentIndex];
        changeHtmlPlayMessage(url, '#0', currentId);
        // while (!Audio.audio.readyState){}  判断数据是否就绪,但是似乎没有作用
    }
    loadInitial();

    $(ELEMENT.channel).on('click', ELEMENT.btnPlay, function () {
            let btn = $(this);
            btn.toggleClass('audio_pause');
            btn.toggleClass('audio_play');
            if (Audio.audio.paused)
                Audio.audio.play();
            else
                Audio.audio.pause();
    })
    $(ELEMENT.channel).on('click', ELEMENT.btnPause, function () {
        let btn = $(this);
        btn.toggleClass('audio_pause');
        btn.toggleClass('audio_play');
        if (Audio.audio.paused)
            Audio.audio.play();
        else
            Audio.audio.pause();
    });

    $(ELEMENT.channel).on('click', ELEMENT.iconVolume, function () {
        $(this).toggleClass('volume-btn');
        $(this).toggleClass('volume-btn-mute');
        Audio.audio.volume = Audio.audio.volume ? 0 : currentVolume;
    });

    Audio.audio.oncanplay = function () {
        time = parseInt(Audio.audio.duration);
        minute = parseInt(time / 60);
        if (minute < 10) minute = '0' + minute;
        second = time - minute * 60;
        if (second < 10) second = '0' + second;
        $(ELEMENT.duration).html(minute + ':' + second);
        let btnPlay = $(ELEMENT.btnPlay);
        btnPlay.toggleClass('audio_pause');
        btnPlay.toggleClass('audio_play');
        if (Audio.audio.paused){
             Audio.audio.play();
        }
        else
            Audio.audio.pause();
        // $(ELEMENT.playingMusicName).html(Audio.musicName[Audio.currentIndex]);
        // $(ELEMENT.playingSingerName).html(Audio.musicSinger[Audio.currentIndex]);
    };

    var movingProgress =false;
    // 进度条跟随播放进度
    function playChangeProgress() {
        if(!movingProgress) {
            let currentPlayTime = Audio.audio.currentTime;
            let duration = Audio.audio.duration;
            let progressLength = $(ELEMENT.durationProgress).outerWidth();
            let runawayLength = currentPlayTime / duration * progressLength;
            $(ELEMENT.currentTimeProgress).css('width', runawayLength);
            // $('.progress-span2').html(beginLeft + runawayLength);

            $(ELEMENT.btnProgress).css('left', runawayLength);
        }
    }

    setInterval(playChangeProgress, 100);

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

    Audio.audio.onended = nextMusic;

    $(ELEMENT.channel).on('click', ELEMENT.btnNext, nextMusic);

    $(ELEMENT.channel).on('click', ELEMENT.btnPre, function () {
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

    function displayCurrentTime() {
        span = $(ELEMENT.currentTime);
        time = parseInt(Audio.audio.currentTime);
        minute = parseInt(time / 60);
        if (minute < 10) minute = '0' + minute;
        second = time - minute * 60;
        if (second < 10) second = '0' + second;
        span.html(minute + ':' + second);
    }

    var timer = setInterval(displayCurrentTime, 500);

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

    $(ELEMENT.channel).on('click', ELEMENT.divWhile, function () {
        isWhile = (isWhile + 1) % 3;
        if(isWhile === 0){
            $(this).css('background-image', 'url("/static/images/while_play.png")')
        }else if(isWhile === 1){
            $(this).css('background-image', 'url("/static/images/singer_play.png")')
        }else{
            $(this).css('background-image', 'url("/static/images/random_play.png")')
        }
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
});