var ws = new WebSocket('ws://localhost:5000');
ws.onerror = function(e) {
    //соединение было закрыто
    console.log(e);
};
ws.onopen = function() {
    //соединение установлено
    //отправить запрос о регистрации
    this.send(JSON.stringify({
        op: 'reg',
        data: {
            name: 'test',
            login: 'test'
        }
    }));
};
ws.onmessage = function(e) {
    //пришло сообщение от сервер, надо его обработать
    console.log(e.data);

    var data = JSON.parse(e.data);

    switch(data.op) {
        case 'token':
            localStorage.setItem( 'token', JSON.stringify( data.token ) );
            break;
        // case 'error':
        // case 'user-out':
        // case 'message':
        // case 'user-change-photo':
    }
};
