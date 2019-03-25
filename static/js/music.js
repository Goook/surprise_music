$(function () {
    const ELEMENT = {
        rows: '.rows',
        linkDownload: '.download_a',
        linkAdd: '.add_a',
        linkPlay: '.play_a',
        addToSheet: '.mod_btn js_all_fav',
        singerAddToSheet: '.add',
        divAddToSheet: '.add-to-sheet',
        sheetList: '.sheet-list',
        window: '.windows',
        singleDeleteMusic: '.single-delete-music',
    };

    $(ELEMENT.singerAddToSheet).click(function (e) {
        musicId = $(this).data('music_id');
        $.get('/add_to_sheet/', {'music_id': musicId}, function(response, status, xhr) {
            // let width=$(ELEMENT.singerAddToSheet).css('width');
            // let height=Math.floor($(ELEMENT.singerAddToSheet).css('height')/2);
            $(ELEMENT.divAddToSheet).html(response);
            $(ELEMENT.divAddToSheet).css('top',e.pageY );
            $(ELEMENT.divAddToSheet).css('left', e.pageX );
            $(ELEMENT.divAddToSheet).css('display', 'block')
            $(ELEMENT.divAddToSheet).data('music_id', musicId)
            $(ELEMENT.sheetList).click(function () {
                musicId = $(ELEMENT.divAddToSheet).data('music_id');
                sheetId = $(this).data('sheet_id');
                $.post('/add_to_sheet/', {'music_id':musicId, 'sheet_id': sheetId}, function (response, status, xhr) {
                    $(ELEMENT.divAddToSheet).css('display', 'none');
                    let myWindow = $(ELEMENT.window);
                    myWindow.find('span').html(response);
                    myWindow.css('display', 'block');
                    setTimeout(function () {
                        myWindow.css('display', 'none');
                    },1000)
                 })
            })
            $(document).click(function () {
                $(ELEMENT.divAddToSheet).css('display', 'none');
            })
        })
    });
});