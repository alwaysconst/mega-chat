function hb(whatCompile, whereInsert, data) {
    var source = whatCompile.innerHTML,
        templateFn = Handlebars.compile(source),
        template = templateFn({list: data});
    whereInsert.innerHTML = template;
}

hb (loginWindowTemplate, windowContainer);

loginButton.addEventListener('click', function (e) {
    e.preventDefault();
    var name = document.getElementById('fioField').value.trim(),
        login = document.getElementById('nickField').value.trim(),
        ws = new WebSocket('ws://localhost:5000');
    session(ws, 'reg', {name: name, login: login});
});

function session(ws, op, data, token) {
    ws.onopen = function() {
        this.send(JSON.stringify({
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
        console.log(e.data);

        var data = JSON.parse(e.data);

        switch(data.op) {
            case 'token':
                reg(data);
                break;
            case 'error':
                error(data);
                break;
            case 'user-enter':
                userEnter(data);
                break;
            case 'user-out':
                userOut(data);
                break;
            case 'message':
                newMessage(data);
                break;
            case 'user-change-photo':
                userChangePhoto(data);
                break;
        }
    };
};

    function reg (data) {
        if (!localStorage.getItem( 'token')){
            localStorage.setItem( 'token', JSON.stringify( data.token ) );
        }
        windowContainer.innerHTML = '';
        hb (usersTemplate, userList, data.users);
        console.log(data.users);
    }

    function error(data) {

    }

    function userEnter(data) {
        hb (usersTemplate, userList, data);
    }

    function userOut(data) {

    }

    function newMessage(data) {

    }

    function userChangePhoto(data) {

    }

sendButton.addEventListener('click', function (e) {
    e.preventDefault();
    session(ws, 'message', {body: 'Test message'}, localStorage.getItem( 'token' ));
});