var ws;
var token;

function hb(whatCompile, whereInsert, data) {
    var source = whatCompile.innerHTML,
        templateFn = Handlebars.compile(source),
        template = templateFn({list: data});
    whereInsert.innerHTML = template;
}


hb (loginWindowTemplate, windowContainer);
document.addEventListener('click', function (e) {
    e.preventDefault();
    switch(e.target.id) {
        case 'loginButton':
            var name = fioField.value.trim(),
                login = nickField.value.trim();
            connect();
            send('reg', {name: name, login: login});
            break;
        case 'sendButton':
            send2('message', {body: 'Test message'}, JSON.parse(localStorage.getItem( 'token' )));
            break;
    }
});

function connect() {
    return ws = new WebSocket('ws://localhost:5000');
}
function send(op, data, token) {
    console.log(ws);
    ws.onopen = function() {
        ws.send(JSON.stringify({
            op: op,
            token: token,
            data: data
        }));
    };
    ws.onerror = function(e) {
        console.log(e);
    };
    ws.onclose = function(e) {
        console.log(e);
    };
    ws.onmessage = function(e) {
        console.log(e);

        var message = JSON.parse(e.data);

        switch(message.op) {
            case 'token':
                reg(message, data);
                break;
            case 'error':
                error(message);
                break;
            case 'user-enter':
                userEnter(message);
                break;
            case 'user-out':
                userOut(message);
                break;
            case 'message':
                newMessage(message);
                break;
            case 'user-change-photo':
                userChangePhoto(message);
                break;
        }
    }
}

function send2(op, data, token) {
    ws.send(JSON.stringify({
        op: op,
        token: token,
        data: data
    }));
}

function reg (message, data) {
    windowContainer.innerHTML = '';

    hb (usersTemplate, userList, data.users);
    console.log(data);
    myName.innerHTML = data.login;

    return token = message.token;
}

function error(message) {

}

function userEnter(message) {
    hb (usersTemplate, userList, message);
}

function userOut(message) {

}

function newMessage(message) {

}

function userChangePhoto(message) {

}