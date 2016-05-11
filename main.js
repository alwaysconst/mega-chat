var host = 'localhost:5000',
    ws,
    token;

function hb(whatCompile, whereInsert, data) {
    console.log(data);
    var source = whatCompile.innerHTML,
        templateFn = Handlebars.compile(source),
        template = templateFn(data);
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
            var messageText = document.getElementById('messageText').value.trim();
            send2('message', {body: messageText}, token);
            document.getElementById('messageText').value = '';
            break;
    }
});

function connect() {
    return ws = new WebSocket('ws://' + host);
}
function send(op, data, token) {
    ws.onopen = function() {
        ws.send(JSON.stringify({
            op: op,
            token: token,
            data: data
        }));
    };
    ws.onerror = function(e) {
        error(message);
    };
    ws.onclose = function(e) {
        console.log(e);
    };
    ws.onmessage = function(e) {

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
    blocker.outerHTML = '';
    windowContainer.innerHTML = '';

    console.log(JSON.stringify(message));
    console.log(message.messages);
    myName.innerHTML = data.login;

    hb (usersTemplate, userList, {users: message.users});
    hb (messageTemplate, people, {users: message.messages});

    return token = message.token;
}

function error(message) {
    alert(message.error.message);
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