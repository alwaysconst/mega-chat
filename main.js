var ws = new WebSocket('ws://localhost:5000');
ws.onerror = function(e) {
    //соединение было закрыто
    console.log(e);
};
ws.onopen = function() {
    //соединение установлено
    //отправить запрос о регистрации
    if (!localStorage.getItem( 'token')){
        this.send(JSON.stringify({
            op: 'reg',
            data: {
                name: 'test',
                login: 'test'
            }
        }));
    }
};
ws.onmessage = function(e) {
    //пришло сообщение от сервер, надо его обработать
    console.log(e.data);

    var data = JSON.parse(e.data);

    switch(data.op) {
        case 'token':
            regMes(data);
            break;
        case 'user-out':
            userOutMes(data);
            break;
        case 'error':
            errorMes(data);
            break;
        case 'message':
            newMessage(data);
            break;
        case 'user-change-photo':
            userChangePhotoMes(data);
            break;
    }
};

function regMes (data) {
    if (!localStorage.getItem( 'token')){
        localStorage.setItem( 'token', JSON.stringify( data.token ) );
    }
}

function userOutMes() {

}

function errorMes() {

}

function newMessage() {

}

function userChangePhotoMes() {

}

sendButton.addEventListener('click', function (e) {
    console.log(localStorage.getItem( 'token' ))
    ws.send(JSON.stringify({
        op: 'message',
        token: localStorage.getItem( 'token' ), //уникальный идентификатор, полученный при регистрации
        data: {
            body: 'Test message' //тело сообщения
        }
    }))
})