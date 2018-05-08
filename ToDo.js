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
    let colorPalette = ['#ff4c4c', '#ff5959', '#ff6666', '#ff7272', '#ff7f7f', '#ff8c8c', '#ff9999', '#ffa5a5', '#ffb2b2', '#ffbfc0', '#ffcccc', '#ffd8d9', '#ffe5e5'];
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
    allList.sort(function (a,b) {
        return (a.sort > b.sort ? 1 : -1);
    });
    console.log(allList);

    // ToDo全表示
    contentBuild();

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
        let hour = now.getHours(); // 時
        let min = now.getMinutes(); // 分
        let nowTime = `${hour}:${min}`
        $('#date-inp').val(nowDate);
        $('#time-inp').val(nowTime);


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
        let dateEl = `${inpDate[0]}年${inpDate[1]}月${inpDate[2]}日`
        // 期限時間の取得
        let inpTime = $('#time-inp').val().split(':');
        let timeEl = `${inpTime[0]}時${inpTime[1]}分`

        let debugDate = `${inpDate[0]}-${inpDate[1]}-${inpDate[2]} ${inpTime[0]}:${inpTime[1]}`
        console.log(debugDate);

        // 時間の取得
        let now = new Date();
        let year = now.getFullYear(); // 年
        let month = ('0'+(now.getMonth() + 1)).slice(-2); // 月
        let date = ('0'+now.getDate()).slice(-2); // 日
        // const day = now.getDay(); // 曜日
        let weekList = ['日','月','火','水','木','金','土'];
        let hour = now.getHours(); // 時
        let min = now.getMinutes(); // 分
        let sec = now.getSeconds(); // 秒
        let dateTime = `${year}年${month}月${date}日 ${hour}時${min}分`; //${sec}秒`; 

        // inputとradioが入っていれば実行
        if (reqName !== '' & radioEl !== '' & dateEl !== '' & timeEl !== '') {
            // divタグでリストを作成
            const divAdd = $('<div class="ToDo-content">');
            divAdd.html(`<p id="c-time" class="c-time-${loadCnt}">${dateTime} 追加</p><p class="c-name-${loadCnt}">${reqName}</p><p class="c-radio-${loadCnt}">${radioEl}：${dateEl} ${timeEl}</p>`);
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
                let ccName = divCCAdd.prev().prev().prev().text();
                var ccArraySearch = allList.findIndex(({name}) => name === ccName);
                console.log(ccArraySearch);
                let waitObj = {
                    nTime: allList[ccArraySearch].nTime,
                    name: allList[ccArraySearch].name,
                    radio: allList[ccArraySearch].radio,
                    rDate: allList[ccArraySearch].rDate,
                    rTime: allList[ccArraySearch].rTime,
                    sort: allList[ccArraySearch].sort,
                    bgc: colorPalette[colorNum]
                };
                allList.splice(ccArraySearch, 1, waitObj);  

                // ローカルストレージに保存
                json = JSON.stringify(allList);
                localStorage.setItem('allList', json);
            });


            // 追加の動き
            // リスト要素内に削除ボタン作成
            divAdd.append(divDelAdd);
            // リスト要素内に色変更ボタン作成
            divAdd.append(divCCAdd);
            // append前にアニメーション
            divAdd.hide().fadeIn(200);
            outputEl.append(divAdd);


            let addObj = {
                nTime: dateTime,
                name: reqName,
                radio: radioEl,
                rDate: dateEl,
                rTime: timeEl,
                sort: debugDate,
                bgc: ''
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
            // $('#time-inp').val('');

            bgc();
        
        }
    }); //--------------------------------------------------------------------------------



    // 期限フィルター
    $('#limit-filter-btn').on('click', () => {
        outputEl.empty();
        colorNum = 0;
        for (let cnt = 0, len = allList.length; cnt < len; cnt++) {
            console.log(allList);
            if (allList[cnt].radio === '期限') {
                const divAdd = $('<div class="ToDo-content">');
                divAdd.html(`<p id="c-time" class="c-time-${loadCnt}">${allList[cnt].nTime} 追加</p><p class="c-name-${loadCnt}">${allList[cnt].name}</p><p class="c-radio-${loadCnt}">${allList[cnt].radio}：${allList[cnt].rDate} ${allList[cnt].rTime}</p>`);
                divAdd.css({ background: colorPalette[colorNum] });
                if (allList[cnt].bgc !== '') {
                    divAdd.css({ background: allList[cnt].bgc }); 
                }
            
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
                    let ccName = divCCAdd.prev().prev().prev().text();
                    var ccArraySearch = allList.findIndex(({name}) => name === ccName);
                    console.log(ccArraySearch);
                    let waitObj = {
                        nTime: allList[ccArraySearch].nTime,
                        name: allList[ccArraySearch].name,
                        radio: allList[ccArraySearch].radio,
                        rDate: allList[ccArraySearch].rDate,
                        rTime: allList[ccArraySearch].rTime,
                        sort: allList[ccArraySearch].sort,
                        bgc: colorPalette[colorNum]
                    };
                    allList.splice(ccArraySearch, 1, waitObj);  
    
                    // ローカルストレージに保存
                    json = JSON.stringify(allList);
                    localStorage.setItem('allList', json);    
                });
        
                // 追加の動き
                outputEl.append(divAdd).hide().fadeIn(200);
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
    });

    // 予定フィルター
    $('#plan-filter-btn').on('click', () => {
        outputEl.empty();
        colorNum = 0;
        for (let cnt = 0, len = allList.length; cnt < len; cnt++) {
            console.log(allList);
            if (allList[cnt].radio === '予定') {
                const divAdd = $('<div class="ToDo-content">');
                divAdd.html(`<p id="c-time" class="c-time-${loadCnt}">${allList[cnt].nTime} 追加</p><p class="c-name-${loadCnt}">${allList[cnt].name}</p><p class="c-radio-${loadCnt}">${allList[cnt].radio}：${allList[cnt].rDate} ${allList[cnt].rTime}</p>`);
                divAdd.css({ background: colorPalette[colorNum] });
                if (allList[cnt].bgc !== '') {
                    divAdd.css({ background: allList[cnt].bgc }); 
                }
            
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
                    let ccName = divCCAdd.prev().prev().prev().text();
                    var ccArraySearch = allList.findIndex(({name}) => name === ccName);
                    console.log(ccArraySearch);
                    let waitObj = {
                        nTime: allList[ccArraySearch].nTime,
                        name: allList[ccArraySearch].name,
                        radio: allList[ccArraySearch].radio,
                        rDate: allList[ccArraySearch].rDate,
                        rTime: allList[ccArraySearch].rTime,
                        sort: allList[ccArraySearch].sort,
                        bgc: colorPalette[colorNum]
                    };
                    allList.splice(ccArraySearch, 1, waitObj);  
    
                    // ローカルストレージに保存
                    json = JSON.stringify(allList);
                    localStorage.setItem('allList', json);    
                });
        
                // 追加の動き
                outputEl.append(divAdd).hide().fadeIn(200);
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

    // 全表示、フィルター解除
    $('#all-filter-btn').on('click', () => {
        contentBuild();
    }); //--------------------------------------------------------------------------------



    
    // 基本的なToDoリスト表示
    function contentBuild() {
        for (let cnt = 0, len = allList.length; cnt < len; cnt++) {
            // console.log(allList);
            
            const divAdd = $('<div class="ToDo-content">');
            divAdd.html(`<p id="c-time" class="c-time-${loadCnt}">${allList[cnt].nTime} 追加</p><p class="c-name-${loadCnt}">${allList[cnt].name}</p><p class="c-radio-${loadCnt}">${allList[cnt].radio}：${allList[cnt].rDate} ${allList[cnt].rTime}</p>`);
            divAdd.css({ background: colorPalette[colorNum] });
            if (allList[cnt].bgc !== '') {
                divAdd.css({ background: allList[cnt].bgc }); 
            }
            // else {
            //     divAdd.css({ background: colorPalette[colorNum] });
            // }

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
                let ccName = divCCAdd.prev().prev().prev().text();
                var ccArraySearch = allList.findIndex(({name}) => name === ccName);
                console.log(ccArraySearch);
                let waitObj = {
                    nTime: allList[ccArraySearch].nTime,
                    name: allList[ccArraySearch].name,
                    radio: allList[ccArraySearch].radio,
                    rDate: allList[ccArraySearch].rDate,
                    rTime: allList[ccArraySearch].rTime,
                    sort: allList[ccArraySearch].sort,
                    bgc: colorPalette[colorNum]
                };
                allList.splice(ccArraySearch, 1, waitObj);  

                // ローカルストレージに保存
                json = JSON.stringify(allList);
                localStorage.setItem('allList', json);
            });

            // 追加の動き
            outputEl.append(divAdd).hide().fadeIn(200);
            // リスト要素内に削除ボタン作成
            divAdd.append(divDelAdd);
            // リスト要素内に色変更ボタン作成
            divAdd.append(divCCAdd);

            bgc();

            loadCnt += 1;
        }
    }

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