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

    // 時間の取得（これで使うかはまだ分からない）
    let nowTime = new Date();
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

        // console.log('add complete');

        // ToDo名をinputから取得
        let reqName = requireEl.val();

        // 選択されているradioボタン要素の取得、項目の取得
        let radioEl = $("input[name='TL']:checked").parent().text();

        // divタグでリストを作成
        const divAdd = $('<div>');
        divAdd.html(`${nowTime}<br>${reqName} : ${radioEl}`);
        divAdd.css({ background: colorPalette[colorNum] });


        // 追加の動き
        outputEl.append(divAdd);

        requireEl.val('');

        bgc();

    }); //--------------------------------------------------------------------------------

    // 
    $('#all-del-btn').on('click', () => {
        console.log('all delete');
        outputEl.empty();
    }); //--------------------------------------------------------------------------------





    // モーダルウィンドウを中央に配置する
    function modalResize() {
        let modalWidth = ( $window.width() - modalWindow.outerWidth() ) / 2;
        let modalHeight = ( $window.height() - modalWindow.outerWidth() ) / 2;

        modalWindow.css( {
            left: modalWidth,
            top: modalHeight
        } )
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