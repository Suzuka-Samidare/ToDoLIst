$(function () {

    // ToDoリストの追加先
    const outputEl = $('#todo-list');

    // モーダル内要素取得 -------------------------------

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

    // -----------------------------------------------

    // ToDoリストカラーパレットと配列監視
    let colorPalette = ['mistyrose', 'pink', 'lightpink', 'darksalmon', 'coral'];
    let colorNum = 0;

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

    }); //--------------------------------------------------------------------------------

    // 追加ボタンを押した場合 -------------------------------------------------------------------
    $('#add-btn').on('click', () => {
        console.log('add complete');
        // ToDo名をinputから取得
        let reqName = requireEl.val();
        // 選択されているradioボタン要素の取得、項目の取得
        let radioEl = $("input[name='TL']:checked").parent().text();

        // 時間の取得
        const now = new Date();
        const year = now.getFullYear(); // 年
        const month = now.getMonth() + 1; // 月
        const date = now.getDate(); // 日
        // const day = now.getDay(); // 曜日
        const weekList = ['日','月','火','水','木','金','土'];
        const hour = now.getHours(); // 時
        const min = now.getMinutes(); // 分
        const sec = now.getSeconds(); // 秒
        let nowTime = `${year}年${month}月${date}日 ${hour}時${min}分`; //${sec}秒`; 
        // time-limit内のinput取得
        const yearInp = $('#year-inp').val();
        const monthInp = $('#month-inp').val();
        const dateInp = $('#date-inp').val();
        const hourInp = $('#hour-inp').val();
        const minInp = $('#min-inp').val();
        let setLimit = `${yearInp}年${monthInp}月${dateInp}日${hourInp}時${minInp}分`;

        // inputとradioが入っていれば実行
        if (reqName !== '' & radioEl !== '') {
            // divタグでリストを作成
            const divAdd = $('<div class="ToDo-content">');
            divAdd.html(`${nowTime}追加<br>${reqName}<br>${radioEl} : ${setLimit}`);
            divAdd.css({ background: colorPalette[colorNum] });

            // divリスト内に削除ボタン設置
            const divDelAdd = $('<button class="ToDo-content-btn">');
            divDelAdd.text('Delete');
            divDelAdd.on('click', () => {
                divDelAdd.parent().remove();
            });
            // divリスト内に削色変更ボタン設置
            const divCCAdd = $('<button class="ToDo-content-btn">');
            divCCAdd.text('ColorChange');
            divCCAdd.on('click', () => {
                divCCAdd.parent().css({ background: colorPalette[colorNum] });
                bgc();
            });


            // 追加の動き
            outputEl.append(divAdd);
            // リスト要素内に削除ボタン作成
            divAdd.append(divDelAdd);
            // リスト要素内に色変更ボタン作成
            divAdd.append(divCCAdd);

            requireEl.val('');

            bgc();
        }

    }); //--------------------------------------------------------------------------------

    // 
    $('#all-del-btn').on('click', () => {
        console.log('all delete');
        outputEl.empty();
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

    // function listOperation() { //-------------------------------------------------------
    //     // divリスト内に削除ボタン設置
    //     const divDelAdd = $('<button>');
    //     divDelAdd.text('Delete');
    //     divDelAdd.on('click', () => {
    //         divDelAdd.parent().remove();
    //     });
    //     // divリスト内に削色変更ボタン設置
    //     const divCCAdd = $('<button>');
    //     divCCAdd.text('ColorChange');
    //     divCCAdd.on('click', () => {
    //         divCCAdd.parent().css({ background: colorPalette[colorNum] });
    //         bgc();
    //     });
    // } //---------------------------------------------------------------------------------

    // function listAddBtn() { //-----------------------------------------------------------
    //     // リスト要素内に削除ボタン作成
    //     divAdd.append(divDelAdd);
    //     // リスト要素内に色変更ボタン作成
    //     divAdd.append(divCCAdd);
    // } //---------------------------------------------------------------------------------

    function gTime() { //-----------------------------------------------------------------
        // 日時
        const now = new Date();
        // 年
        const year = now.getFullYear();
        console.log(year);
        // 月
        const month = now.getMonth() + 1;
        console.log(month);
        // 日
        const date = now.getDate();
        console.log(date);
        // 曜日
        const day = now.getDay();
        const weekList = ['sun','月','火','','','',''];
        // console.log(weekList[day]);
        // 時
        const hour = now.getHours();
        // console.log(hour);
        // 分
        const min = now.getMinutes();
        // 秒
        const sec = now.getSeconds();

        console.log(`${year}年${month}月${date}日 ${hour}時${min}分${sec}秒`);   
    }
}); //----------------------------------------------------------------------------------------