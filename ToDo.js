$(function () {

    // ToDoリストの追加先
    const outputEl = $('#todo-list');
    // const cntContEl = $('.ToDo-content').length

    const speakEl = $('.talk-girl');
    const charaEl = $('#character');

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

    // jsonフェイズ-------------------------------------------------------------------------
    // 保存データ格納用配列の用意
    let allList = [];
    // ローカルストレージから取得
    let json = localStorage.getItem('allList'); 
    json = JSON.parse(json);
    if (json) {
        allList = json;
    }
    allList.sort(function (a,b) {
        return (a.sort > b.sort ? 1 : -1);
    });
    console.log(allList);

    let loadCnt = 1;

    // ToDoリストカラーパレットと配列監視 cssに記述した方が良い？
    const colorPalette = ['#ff4c4c', '#ff5959', '#ff6666', '#ff7272', '#ff7f7f', '#ff8c8c',
                          '#ff9999', '#ffa5a5', '#ffb2b2', '#ffbfc0', '#ffcccc', '#ffd8d9',
                          '#ffe5e5'];
    let colorNum = 0;

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
        let nowTime = `${hour}:${min}`;
        $('#date-inp').val(nowDate);
        $('#time-inp').val(nowTime);

        speakEl.text('どんな用事があるの？')



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
        let timeEl = `${inpTime[0]}時${inpTime[1]}分`;

        let debugDate = `${inpDate[0]}-${inpDate[1]}-${inpDate[2]} ${inpTime[0]}:${inpTime[1]}`

        // 時間の取得
        let now = new Date();
        let year = now.getFullYear(); // 年
        let month = ('0'+(now.getMonth() + 1)).slice(-2); // 月
        let date = ('0'+now.getDate()).slice(-2); // 日
        let hour = now.getHours(); // 時
        let min = now.getMinutes(); // 分
        let sec = now.getSeconds(); // 秒
        let dateTime = `${year}年${month}月${date}日 ${hour}時${min}分`; //${sec}秒`; 

        // inputとradioが入っていれば実行
        if (reqName !== '' & radioEl !== '' & dateEl !== '' & timeEl !== '') { //!!!!
            // divタグでリストを作成
            const divAdd = $('<div class="ToDo-content">');
            divAdd.html(`<p id="c-time" class="c-time-${loadCnt}">${dateTime} 追加</p>
                         <p class="c-name-${loadCnt}">${reqName}</p>
                         <p class="c-radio-${loadCnt}">${radioEl}：${dateEl} ${timeEl}</p>`
            );
            divAdd.css({ background: colorPalette[colorNum] });

            // divリスト内に削除ボタン設置
            const divDelAdd = $('<button class="ToDo-content-del">');
            divDelAdd.text('Delete');
            divDelAdd.on('click', () => {            
                let delName = divDelAdd.prev().prev().text();
    
                let arraySearch = allList.findIndex(({name}) => name === delName);
                allList.splice(arraySearch, 1);
                divDelAdd.parent().remove();
    
                // ローカルストレージに保存
                saveArray()    
            });
            // divリスト内に削色変更ボタン設置
            const divCCAdd = $('<button class="ToDo-content-cc">');
            divCCAdd.text('ColorChange');
            divCCAdd.on('click', () => {
                divCCAdd.parent().css({ background: colorPalette[colorNum] });
                changeBgc();
                let ccName = divCCAdd.prev().prev().prev().text();
                let ccArraySearch = allList.findIndex(({name}) => name === ccName);
                // console.log(ccArraySearch);
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
                saveArray()
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
            saveArray()

            $('#alert-wid').fadeIn('slow');

            setTimeout(function() {
                $('#alert-wid').fadeOut('slow');
            }, 2000);

            requireEl.val('');

            changeBgc();

            speakEl.text('追加したよ〜！');
            charaEl.children('img').attr('src', 'assets/sd_eye2.png');
            let resetTalk = function resetTalk() {
                speakEl.text('他に何かある〜？');
                charaEl.children('img').attr('src', 'assets/sd_eye0.png');
            } 
            setTimeout(resetTalk, 3000);
        
        }
    }); //--------------------------------------------------------------------------------



    // 期限フィルター
    $('#limit-filter-btn').on('click', () => {
        outputEl.empty();
        colorNum = 0;
        loadCnt = 1;
        for (let cnt = 0, len = allList.length; cnt < len; cnt++) {
            addColorRgb = Math.floor(153/allList.length)
            colorVessel = 76+(addColorRgb*loadCnt)
            colorRgb = `rgb( 255, ${colorVessel}, ${colorVessel} )`
    
            if (allList[cnt].radio === '期限') {
                const divAdd = $('<div class="ToDo-content">');
                divAdd.html(`<p id="c-time" class="c-time-${loadCnt}">${allList[cnt].nTime} 追加</p>
                             <p class="c-name-${loadCnt}">${allList[cnt].name}</p>
                             <p class="c-radio-${loadCnt}">${allList[cnt].radio}：${allList[cnt].rDate} ${allList[cnt].rTime}</p>`
                );
                divAdd.css({ background: colorRgb });
                if (allList[cnt].bgc !== '') {
                    divAdd.css({ background: allList[cnt].bgc }); 
                }
            
                // divリスト内に削除ボタン設置
                const divDelAdd = $('<button class="ToDo-content-del">');
                divDelAdd.text('Delete');
                divDelAdd.on('click', () => {
                    let delName = divDelAdd.prev().prev().text();
        
                    let arraySearch = allList.findIndex(({name}) => name === delName);
                    allList.splice(arraySearch, 1);
                    divDelAdd.parent().remove();

                    // ローカルストレージに保存
                    saveArray()
            
                });
                // divリスト内に削色変更ボタン設置
                const divCCAdd = $('<button class="ToDo-content-cc">');
                divCCAdd.text('ColorChange');
                divCCAdd.on('click', () => {
                    divCCAdd.parent().css({ background: colorPalette[colorNum] });
                    changeBgc();
                    let ccName = divCCAdd.prev().prev().prev().text();
                    let ccArraySearch = allList.findIndex(({name}) => name === ccName);
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
                    saveArray()                
                });
        
                // 追加の動き
                outputEl.append(divAdd).hide().fadeIn(200);
                // リスト要素内に削除ボタン作成
                divAdd.append(divDelAdd);
                // リスト要素内に色変更ボタン作成
                divAdd.append(divCCAdd);
        
                changeBgc();
        
                loadCnt += 1;
            } else {
                loadCnt += 1;
            }
            speakEl.text('期限でフィルターをかけたよ！');
        }

    });

    // 予定フィルター
    $('#plan-filter-btn').on('click', () => {
        outputEl.empty();
        colorNum = 0;
        loadCnt = 1;
        for (let cnt = 0, len = allList.length; cnt < len; cnt++) {
            addColorRgb = Math.floor(153/allList.length)
            colorVessel = 76+(addColorRgb*loadCnt)
            colorRgb = `rgb( 255, ${colorVessel}, ${colorVessel} )`
    
            if (allList[cnt].radio === '予定') {
                const divAdd = $('<div class="ToDo-content">');
                divAdd.html(`<p id="c-time" class="c-time-${loadCnt}">${allList[cnt].nTime} 追加</p>
                             <p class="c-name-${loadCnt}">${allList[cnt].name}</p>
                             <p class="c-radio-${loadCnt}">${allList[cnt].radio}：${allList[cnt].rDate} ${allList[cnt].rTime}</p>`
                );
                divAdd.css({ background: colorRgb });
                if (allList[cnt].bgc !== '') {
                    divAdd.css({ background: allList[cnt].bgc }); 
                }
            
                // divリスト内に削除ボタン設置
                const divDelAdd = $('<button class="ToDo-content-del">');
                divDelAdd.text('Delete');
                divDelAdd.on('click', () => {
                    let delName = divDelAdd.prev().prev().text();
        
                    let arraySearch = allList.findIndex(({name}) => name === delName);
                    allList.splice(arraySearch, 1);
                    divDelAdd.parent().remove();

                    // ローカルストレージに保存
                    saveArray()
            
                });
                // divリスト内に削色変更ボタン設置
                const divCCAdd = $('<button class="ToDo-content-cc">');
                divCCAdd.text('ColorChange');
                divCCAdd.on('click', () => {
                    divCCAdd.parent().css({ background: colorPalette[colorNum] });
                    changeBgc();
                    let ccName = divCCAdd.prev().prev().prev().text();
                    let ccArraySearch = allList.findIndex(({name}) => name === ccName);
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
                    saveArray()                
                });
        
                // 追加の動き
                outputEl.append(divAdd).hide().fadeIn(200);
                // リスト要素内に削除ボタン作成
                divAdd.append(divDelAdd);
                // リスト要素内に色変更ボタン作成
                divAdd.append(divCCAdd);
        
                changeBgc();
        
                loadCnt += 1;
            } else {
                loadCnt += 1;
            }
            speakEl.text('予定でフィルターかけたよ！')
        }

}); //--------------------------------------------------------------------------------

    // 全表示、フィルター解除
    $('#all-filter-btn').on('click', () => {
        outputEl.empty();
        loadCnt = 1;
        contentBuild();
        speakEl.text('フィルター解除！');       
    }); //--------------------------------------------------------------------------------

    
    // 基本的なToDoリスト表示
    function contentBuild() {
        for (let cnt = 0, len = allList.length; cnt < len; cnt++) {
            // console.log(allList);
            addColorRgb = Math.floor(153/allList.length)
            colorVessel = 76+(addColorRgb*loadCnt)
            colorRgb = `rgb( 255, ${colorVessel}, ${colorVessel} )`
    
            const divAdd = $('<div class="ToDo-content">');
            divAdd.html(`<p id="c-time" class="c-time-${loadCnt}">${allList[cnt].nTime} 追加</p>
                         <p class="c-name-${loadCnt}">${allList[cnt].name}</p>
                         <p class="c-radio-${loadCnt}">${allList[cnt].radio}：${allList[cnt].rDate} ${allList[cnt].rTime}</p>`
            );
            divAdd.css({ background: colorRgb });
            if (allList[cnt].bgc !== '') {
                divAdd.css({ background: allList[cnt].bgc }); 
            }
            // divリスト内に削除ボタン設置
            const divDelAdd = $('<button class="ToDo-content-del">');
            divDelAdd.text('Delete');
            divDelAdd.on('click', () => {
                let delName = divDelAdd.prev().prev().text();

                let arraySearch = allList.findIndex(({name}) => name === delName);
                allList.splice(arraySearch, 1);
                divDelAdd.parent().remove();

                // ローカルストレージに保存
                saveArray()
            });
            // divリスト内に削色変更ボタン設置
            const divCCAdd = $('<button class="ToDo-content-cc">');
            divCCAdd.text('ColorChange');
            divCCAdd.on('click', () => {
                divCCAdd.parent().css({ background: colorPalette[colorNum] });
                changeBgc();
                let ccName = divCCAdd.prev().prev().prev().text();
                let ccArraySearch = allList.findIndex(({name}) => name === ccName);
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
                saveArray()            
            });

            // 追加の動き
            outputEl.append(divAdd).hide().fadeIn(200);
            // リスト要素内に削除ボタン作成
            divAdd.append(divDelAdd);
            // リスト要素内に色変更ボタン作成
            divAdd.append(divCCAdd);

            changeBgc();

            loadCnt += 1;
        }
    }

    // ローカルストレージへ保存する関数
    function saveArray() {
        json = JSON.stringify(allList);
        localStorage.setItem('allList', json);
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
    function changeBgc() {
        if (colorNum < colorPalette.length - 1) {
            colorNum += 1;
        } else {
            colorNum = 0;
        } 
    } //--------------------------------------------------------------------------------

});