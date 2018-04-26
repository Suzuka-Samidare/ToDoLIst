$(function () {

    // ToDoリストの追加先
    const outputEl = $('#todo-list');
    // モーダル内要素取得 -------------------------------------
    // addするToDoの内容が書かれているところ
    const requireEl = $('#req-inp');
    // radioボタン
    const tlRadioEl = $('#lim-check');
    // -----------------------------------------------
    // 時間の取得（これで使うかはまだ分からない）
    let nowTime = new Date();
    // ToDoリストカラーパレットと配列監視
    let colorPalette = ['mistyrose','pink','lightpink','darksalmon','coral'];
    let colorNum = 0;

    $('#ToDo-btn').on('click', () => {
        $('body').append('<div id="modal-wid">');

        const modalWindow = $('#modal-wid');
        modalWindow.append('<input id="req-inp" type="text">');
        modalWindow.append('<div id="time-limit">');
        modalWindow.append()
        modalWindow.append()
        modalWindow.append()
    });





    // 追加ボタンを押した場合
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

    });

    $('#all-del-btn').on('click', () => {
        console.log('all delete');
        outputEl.empty();
    });






    function bgc() {
        if (colorNum < colorPalette.length-1) {
            colorNum += 1;
        } else {
            colorNum = 0;
        }
    }






});