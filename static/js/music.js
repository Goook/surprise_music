$(function () {
    let url = '/music/favourite/'
    $.get(url, function (res) {
        if(res['status']){
            $('.music-container').html(res['data'])
        }else{
            alert(res['msg'])
        }
    })


    $('body').on('click', '.history-btn', function () {
        let url = '/music/history/'
        $(this).addClass('active')
        $('.like-btn').removeClass('active')
        $.get(url, function (res) {
            if(res['status']){
                $('.music-container').html(res['data'])
            }else{
                alert(res['msg'])
            }
        })
    })

    $('body').on('click', '.like-btn', function () {
        let url = '/music/favourite/'
        $(this).addClass('active')
        $('.history-btn').removeClass('active')
        $.get(url, function (res) {
            if(res['status']){
                $('.music-container').html(res['data'])
            }else{
                alert(res['msg'])
            }
        })
    })
});
