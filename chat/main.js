var host = 'localhost:5000',
    ws,
    token,
    users,
    login,
    photo;

view (loginWindowTemplate, windowContainer);
document.addEventListener('click', function (e) {
    e.preventDefault();
    switch(e.target.id) {
        case 'loginButton':
            loginButtonFn(e);
            break;
        case 'sendButton':
            sendButtonFn(e);
            break;
        case 'myPhoto':
            myPhotoFn(e);
            break;
        case 'uploadCancelButton':
            uploadCancelButtonFn(e);
            break;
        case 'uploadButton':
            uploadButtonFn(e);
            break
    }
});

function connect(op, data, token) {
    new Promise(function (resolve) {
        ws = new WebSocket('ws://' + host);
        resolve (ws);
    }).then(function(ws) {
        ws.onopen = function() {
            send(op, data, token)
        };
        ws.onerror = function(e) {
            console.log(e);
        };
        ws.onclose = function(e) {
            console.log(e);
        };
        ws.onmessage = function(e) {
            var message = JSON.parse(e.data);

            switch(message.op) {
                case 'token':
                    regMs(message, data);
                    break;
                case 'error':
                    errorMs(message);
                    break;
                case 'user-enter':
                    userEnterMs(message);
                    break;
                case 'user-out':
                    userOutMs(message);
                    break;
                case 'message':
                    newMessageMs(message);
                    break;
                case 'user-change-photo':
                    userChangePhotoMs(message);
                    break;
            }
        };
    })
}

function send(op, data, token) {
    ws.send(JSON.stringify({
        op: op,
        token: token,
        data: data
    }));
}

function regMs (message, data) {
    windowContainer.classList.toggle("hide");
    clearNode (windowContainer);

    myName.innerHTML = data.name;
    myPhoto.src = 'http://' + host + '/photos/' + login + '?' + Date.now();
    users = message.users;

    view (usersTemplate, userList, {users: users});
    message.messages.forEach(function (item){
        item.time = time(item.time);
        view (messageTemplate, comments, item);
    });
    comments.scrollTop = 9999;

    return token = message.token;
}

function errorMs (message) {
    evTarget.parentNode.querySelector('.error-block').innerText = message.error.message;
    function timer () {
        evTarget.parentNode.querySelector('.error-block').innerText = '';
    }
    setTimeout(timer, 5000)
}

function userEnterMs (message) {
    users.push(message.user);
    clearNode (userList);
    view (usersTemplate, userList, {users: users});
}

function userOutMs (message) {
    users.forEach(function(user) {
       if(user.login === message.user.login) {
           var whoOut = users.splice(users.indexOf(user), 1);
       }
    });
    clearNode (userList);
    view (usersTemplate, userList, {users: users});
}

function newMessageMs (message) {
    message.time = time(message.time);
    view (messageTemplate, comments, message);
    comments.scrollTop = 9999;
}

function userChangePhotoMs (message) {
    var newPhoto = 'http://' + host + '/photos/' + message.user.login + '?' + Date.now();

    if (message.user.login === login) {
        myPhoto.src = newPhoto;
    }

    Array.from(document.querySelectorAll('.avatar-img[data-login="' + message.user.login + '"]')).forEach(function(elem) {
        elem.src = newPhoto;
    });
}

function loginButtonFn (e) {
    var name = fioField.value.trim();
    login = nickField.value.trim();
    connect('reg', {name: name, login: login});
    return evTarget = e.target;
}

function sendButtonFn (e) {
    var messageText = document.getElementById('messageText').value.trim();
    if (messageText > null) {
        document.getElementById('messageText').value = '';
        e.target.parentNode.querySelector('.error-block').innerText = '';
    }
    send('message', {body: messageText}, token);
    return evTarget = e.target;
}

function myPhotoFn (e) {
    view (uploadWindowTemplate, windowContainer);
    windowContainer.classList.toggle("hide");

    var uploadArea = document.getElementById("photoUpload");
    photo = null;

    photoUpload.style.backgroundImage = 'url(' + 'http://' + host + '/photos/' + login + '?' + Date.now() + ')';

    uploadArea.ondragover = function (e) {
        e.preventDefault();
    };

    uploadArea.ondrop  = function (e) {
        e.preventDefault();
        e.stopPropagation();

        var file = e.dataTransfer.files[0],
            fileSize = file.size / 1024,
            maxSize = 512;

        if (file.type != 'image/jpeg') {
            evTarget = e.target;
            errorMs ({error: {message:'Можно загружать только JPG-файлы'}});
        } else if (fileSize > maxSize) {
            evTarget = e.target;
            errorMs ({error: {message:'Макисимальный размер файла 512Kb'}});
        } else {
            readFile(file).then(function (data) {
                photoUpload.style.backgroundImage = 'url(' + data + ')';
                photoUpload.innerText = '';
                photo = file;
            });
        }
    };
}

function uploadCancelButtonFn (e) {
    windowContainer.classList.toggle("hide");
    clearNode(windowContainer);
}

function uploadButtonFn (e) {
    if (!photo) {
        evTarget = e.target;
        errorMs ({error: {message:'Не выбран файл'}});
    } else {
        var formData = new FormData();
        formData.append('photo', photo);
        formData.append('token', token);

        var xhr = new XMLHttpRequest();
        xhr.responseType = 'json';
        xhr.open('post', 'http://' + host + '/upload', true);

        xhr.send(formData);
        windowContainer.classList.toggle("hide");
        clearNode(windowContainer);
    }
    return evTarget = e.target;
}

function readFile (file) {
    return new Promise(function (resolve) {
        var reader = new FileReader();

        reader.onload = function () {
            return resolve(reader.result)
        };

        reader.readAsDataURL(file);
    })
}

function time (date) {
    date = new Date(date);
    return date.getHours() + ':' + date.getMinutes();
}

function view(whatCompile, whereInsert, data) {
    var source = whatCompile.innerHTML,
        templateFn = Handlebars.compile(source),
        template = templateFn(data),
        parser = new DOMParser(),
        dom = parser.parseFromString(template, "text/html"),
        elems = dom.querySelector('body').firstElementChild;
    whereInsert.appendChild(elems);
}

function clearNode (node) {
    node.innerHTML = '';
}