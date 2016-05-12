var host = 'localhost:5000',
    ws,
    token,
    users;

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
        case 'myPhoto':
            hb (uploadWindowTemplate, windowContainer);
            break;
        case 'uploadCancelButton':
            clearDOM(windowContainer);
            break;
        case 'uploadButton':
            uploadPhoto();
            break
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
    clearDOM (windowContainer);

    myName.innerHTML = data.login;
    myPhoto.src = 'http://' + host + '/photos/' + data.login;
    users = message.users;

    hb (usersTemplate, userList, {users: users});
    message.messages.forEach(function (item){
        item.time = time(item.time);
        hb (messageTemplate, people, item);
    });
    people.scrollTop = 9999;

    return token = message.token;
}

function error (message) {
    alert(message.error.message);
}

function userEnter (message) {
    users.push(message.user);
    clearDOM (userList);
    hb (usersTemplate, userList, {users: users});
}

function userOut (message) {
    users.forEach(function(user) {
       if(user.login === message.user.login) {
           var whoOut = users.splice(users.indexOf(user), 1);
       }
    });
    clearDOM (userList);
    hb (usersTemplate, userList, {users: users});
}

function newMessage (message) {
    hb (messageTemplate, people, message);
    people.scrollTop = 9999;
}

function userChangePhoto (message) {
    console.log(message);
}

function uploadPhoto () {
    var data = new FormData();
    data.append('photo', e.dataTransfer.files[0]);
    data.append('token', token);

    var xhr = new XMLHttpRequest();
    xhr.open('post', 'http://' + host + '/upload', true);
    xhr.send(data);
}

function time (date) {
    date = new Date(date);
    return date.getHours() + ':' + date.getMinutes();
}

function hb(whatCompile, whereInsert, data) {
    var source = whatCompile.innerHTML,
        templateFn = Handlebars.compile(source),
        template = templateFn(data);
    var parser = new DOMParser();
    var doc = parser.parseFromString(template, "text/html");
    var temp = document.createElement('div');
    temp.innerHTML = template;
    whereInsert.appendChild(temp);
}

function clearDOM (whatClear) {
    whatClear.innerHTML = '';
}