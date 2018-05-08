$(function () {

    // ToDoリストの追加先
    const outputEl = $('#todo-list');


    // モーダル内要素取得 --------------------------------------------------------------
    // windowオブジェクト取得
    const $window = $(window);
    // addするToDoの内容が書かれているところ
    const requireEl = $('#req-inp');
    // radioボタン
    const tlRadioEl = $('#lim-check');
    // モーダルウィンドウ要素の取得
    const modalWindow = $('#modal-wid');
    // モーダルウィンドウ時の背景要素の取得
    const modalBg = $('#modal-bg');
    // モーダルウィンドウのキャンセルボタン要素の取得
    const modalCancel = $('#cancel-btn');
    // ------------------------------------------------------------------------------

    // ToDoリストカラーパレットと配列監視
    let colorPalette = ['mistyrose', 'pink', 'lightpink', 'darksalmon', 'coral'];
    let colorNum = 0;

    let loadCnt = 1;

    // jsonフェイズ-------------------------------------------------------------------------

    let allList = [];
    // ローカルストレージに保存
    let json = localStorage.getItem('allList'); 
    json = JSON.parse(json);
    if (json) {
        allList = json;
    }
    
    for (let cnt = 0, len = allList.length; cnt < len; cnt++) {
        console.log(allList);
        
        const divAdd = $('<div class="ToDo-content">');
        divAdd.html(`<p id="c-time" class="c-time-${loadCnt}">${allList[cnt].nTime} 追加</p><p class="c-name-${loadCnt}">${allList[cnt].name}</p><p class="c-radio-${loadCnt}">${allList[cnt].radio}：${allList[cnt].rDate} ${allList[cnt].rTime}</p>`);
        divAdd.css({ background: colorPalette[colorNum] });

        // divリスト内に削除ボタン設置
        const divDelAdd = $('<button class="ToDo-content-del">');
        divDelAdd.text('Delete');
        divDelAdd.on('click', () => {
            // 押された削除ボタンの同階層のpタグテキストの入手
            // let delTime = divDelAdd.prev().prev().prev().text().substr(4);
            let delName = divDelAdd.prev().prev().text();
            // let delRadio = divDelAdd.prev().text();
            // let delItem = `{time: "${delTime}", name: "${delName}", radio: "${delRadio}"}`;

            var arraySearch = allList.findIndex(({name}) => name === delName);
            console.log(arraySearch);
            allList.splice(arraySearch, 1);
            console.log(allList);
            divDelAdd.parent().remove();

            // ローカルストレージに保存
            json = JSON.stringify(allList);
            localStorage.setItem('allList', json);

        });
        // divリスト内に削色変更ボタン設置
        const divCCAdd = $('<button class="ToDo-content-cc">');
        divCCAdd.text('ColorChange');
        divCCAdd.on('click', () => {
            divCCAdd.parent().css({ background: colorPalette[colorNum] });
            bgc();
        });

        // 追加の動き
        outputEl.append(divAdd).hide().fadeIn('slow');
        // リスト要素内に削除ボタン作成
        divAdd.append(divDelAdd);
        // リスト要素内に色変更ボタン作成
        divAdd.append(divCCAdd);

        bgc();

        loadCnt += 1;
    }
    


    // Addボタンクリック時 -------------------------------------------------------------------
    $('#ToDo-btn').on('click', () => {

        // モーダルウィンドウの表示
        modalWindow.fadeIn('slow');
        modalBg.fadeIn('slow');

        modalResize();

        // #modal-bgをクリックしたら強制キャンセル
        modalBg.on('click', () => {
            modalWindow.fadeOut('slow');
            modalBg.fadeOut('slow');
        });

        // キャンセルボタンを押した場合
        modalCancel.on('click', () => {
            modalWindow.fadeOut('slow');
            modalBg.fadeOut('slow');
        });

        let now = new Date();
        let year = now.getFullYear(); // 年
        let month = ('0'+(now.getMonth() + 1)).slice(-2); // 月
        let date = ('0'+now.getDate()).slice(-2); // 日
        let nowDate = `${year}-${month}-${date}`;
        $('#date-inp').val(nowDate);


    }); //--------------------------------------------------------------------------------


    // 追加ボタンを押した場合 -------------------------------------------------------------------
    $('#add-btn').on('click', () => {
        console.log('add complete');
        // ToDo名をinputから取得
        let reqName = requireEl.val();
        // 選択されているradioボタン要素の取得、項目の取得
        let radioEl = $("input[name='TL']:checked").parent().text();
        // 期限日付の取得
        let inpDate = $('#date-inp').val().split('-');
        let dateEl = `${inpDate[0]}年${inpDate[1]}月${inpDate[2]}`
        // 期限時間の取得
        let inpTime = $('#time-inp').val().split(':');
        let timeEl = `${inpTime[0]}時${inpTime[1]}分`
        console.log(timeEl);

        // 時間の取得
        let now = new Date();
        let year = now.getFullYear(); // 年
        let month = ('0'+(now.getMonth() + 1)).slice(-2); // 月
        let date = ('0'+now.getDate()).slice(-2); // 日
        // const day = now.getDay(); // 曜日
        const weekList = ['日','月','火','水','木','金','土'];
        const hour = now.getHours(); // 時
        const min = now.getMinutes(); // 分
        const sec = now.getSeconds(); // 秒
        let nowTime = `${year}年${month}月${date}日 ${hour}時${min}分`; //${sec}秒`; 

        // inputとradioが入っていれば実行
        if (reqName !== '' & radioEl !== '' & dateEl !== '' & timeEl !== '') {
            // divタグでリストを作成
            const divAdd = $('<div class="ToDo-content">');
            divAdd.html(`<p id="c-time" class="c-time-${loadCnt}">${nowTime} 追加</p><p class="c-name-${loadCnt}">${reqName}</p><p class="c-radio-${loadCnt}">${radioEl}：${dateEl} ${timeEl}</p>`);
            divAdd.css({ background: colorPalette[colorNum] });

            // divリスト内に削除ボタン設置
            const divDelAdd = $('<button class="ToDo-content-del">');
            divDelAdd.text('Delete');
            divDelAdd.on('click', () => {            
                // 押された削除ボタンの同階層のpタグテキストの入手
                // let delTime = divDelAdd.prev().prev().prev().text().substr(4);
                let delName = divDelAdd.prev().prev().text();
                // let delRadio = divDelAdd.prev().text();
                // let delItem = `{time: "${delTime}", name: "${delName}", radio: "${delRadio}"}`;
    
                var arraySearch = allList.findIndex(({name}) => name === delName);
                console.log(arraySearch);
                allList.splice(arraySearch, 1);
                console.log(allList);
                divDelAdd.parent().remove();
    
                // ローカルストレージに保存
                json = JSON.stringify(allList);
                localStorage.setItem('allList', json);
    
            });
            // divリスト内に削色変更ボタン設置
            const divCCAdd = $('<button class="ToDo-content-cc">');
            divCCAdd.text('ColorChange');
            divCCAdd.on('click', () => {
                divCCAdd.parent().css({ background: colorPalette[colorNum] });
                bgc();
            });


            // 追加の動き
            outputEl.append(divAdd).hide().fadeIn('slow');
            // リスト要素内に削除ボタン作成
            divAdd.append(divDelAdd);
            // リスト要素内に色変更ボタン作成
            divAdd.append(divCCAdd);


            let addObj = {
                nTime: nowTime,
                name: reqName,
                radio: radioEl,
                rDate: dateEl,
                rTime: timeEl 
                
            }

            
            console.log(allList, addObj);
            allList.push(addObj)


            
            // ローカルストレージに保存
            json = JSON.stringify(allList);
            localStorage.setItem('allList', json);

            $('#alert-wid').fadeIn('slow');

            var syori = function syori() {
                $('#alert-wid').fadeOut('slow');
            }
            setTimeout(syori, 2000);




            requireEl.val('');
            $('#time-inp').val('');

            bgc();
        
        }
    }); //--------------------------------------------------------------------------------



    // フィルター
    $('#limit-filter-btn').on('click', () => {
        outputEl.empty();
        for (let cnt = 0, len = allList.length; cnt < len; cnt++) {
            console.log(allList);
            if (allList[cnt].radio === '予定') {
                const divAdd = $('<div class="ToDo-content">');
                divAdd.html(`<p id="c-time" class="c-time-${loadCnt}">${allList[cnt].nTime} 追加</p><p class="c-name-${loadCnt}">${allList[cnt].name}</p><p class="c-radio-${loadCnt}">${allList[cnt].radio}：${allList[cnt].rDate} ${allList[cnt].rTime}</p>`);
                divAdd.css({ background: colorPalette[colorNum] });
        
                // divリスト内に削除ボタン設置
                const divDelAdd = $('<button class="ToDo-content-del">');
                divDelAdd.text('Delete');
                divDelAdd.on('click', () => {
                    // 押された削除ボタンの同階層のpタグテキストの入手
                    // let delTime = divDelAdd.prev().prev().prev().text().substr(4);
                    let delName = divDelAdd.prev().prev().text();
                    // let delRadio = divDelAdd.prev().text();
                    // let delItem = `{time: "${delTime}", name: "${delName}", radio: "${delRadio}"}`;
        
                    var arraySearch = allList.findIndex(({name}) => name === delName);
                    console.log(arraySearch);
                    allList.splice(arraySearch, 1);
                    console.log(allList);
                    divDelAdd.parent().remove();

                    // ローカルストレージに保存
                    json = JSON.stringify(allList);
                    localStorage.setItem('allList', json);

            
                });
                // divリスト内に削色変更ボタン設置
                const divCCAdd = $('<button class="ToDo-content-cc">');
                divCCAdd.text('ColorChange');
                divCCAdd.on('click', () => {
                    divCCAdd.parent().css({ background: colorPalette[colorNum] });
                    bgc();
                });
        
                // 追加の動き
                outputEl.append(divAdd).hide().fadeIn('Slow');
                // リスト要素内に削除ボタン作成
                divAdd.append(divDelAdd);
                // リスト要素内に色変更ボタン作成
                divAdd.append(divCCAdd);
        
                bgc();
        
                loadCnt += 1;
            } else {
                loadCnt += 1;
            }
        }
    
    }); //--------------------------------------------------------------------------------





    
    

    // モーダルウィンドウを中央に配置する
    function modalResize() {
        let modalWidth = ($window.width() - modalWindow.outerWidth()) / 2;
        let modalHeight = ($window.height() - modalWindow.outerWidth()) / 2;

        modalWindow.css({
            left: modalWidth,
            top: modalHeight
        })
    } //--------------------------------------------------------------------------------

    // ToDoリストの背景色を配列順に変更
    function bgc() {
        if (colorNum < colorPalette.length - 1) {
            colorNum += 1;
        } else {
            colorNum = 0;
        }
    } //--------------------------------------------------------------------------------

});