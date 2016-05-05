window.onload = function() {
    select("id", "image_viewer").js_object.addEventListener("click", function(e) {
        select("id", "image_viewer").add_class("transparent");
        setTimeout(function() {
            select("id", "image_viewer").add_class("hidden");
        }, 500);
    });

    select("id", "upload_button").js_object.setAttribute("style", "background-color: rgb("
        + Math.floor(180 + Math.random() * 55) + ", "
        + Math.floor(180 + Math.random() * 55) + ", "
        + Math.floor(180 + Math.random() * 55) + ");");

    select("id", "upload_button").js_object.addEventListener("click", function() {
        select("id", "upload_window").js_object.setAttribute("style", "transform: translateY(-100%);")
    });

    select("id", "close_upload_window").js_object.addEventListener("click", function() {
        select("id", "upload_window").js_object.setAttribute("style", "transform: translateY(0);");
    });

    send_request({
        url: "./utilities/get_images.php",
        callback: function(images) {
            for (var i = 0; i < images.length; i++) {
                if (images[i][0] != ".") {
                    var new_image = document.createElement("div");
                    new_image.className = "image";
                    new_image.setAttribute("style", "background-image: url('./images/" + images[i] + "');");
                    new_image.setAttribute("image", images[i]);

                    new_image.addEventListener("click", function(e) {
                        select("id", "image_viewer").js_object.setAttribute("style", "background-image: url('./images/"
                            + e.target.getAttribute("image") + "');");
                        select("id", "image_viewer").remove_class("hidden");
                        setTimeout(function() {
                            select("id", "image_viewer").remove_class("transparent");
                        }, 10)
                    });

                    select("id", "images").js_object.appendChild(new_image);
                }
            }
        }
    })
};

function send_request(args) {
    args.url = (args.url == undefined) ? "" : args.url;
    args.data = (args.data == undefined) ? {} : args.data;
    args.post = (args.post == undefined) ? false : args.post;
    args.async = (args.async == undefined) ? true : args.async;
    args.parse_json = (args.parse_json == undefined) ? true : args.parse_json;
    args.callback = (args.callback == undefined) ? function(result) {} : args.callback;

    if (!args.post) {
        var param_string =  "?";
        var prefix = "";
        for (var property in args.data) {
            if (args.data.hasOwnProperty(property)) {
                param_string += prefix + property + "=" + encodeURIComponent(args.data[property]);
            }
            prefix = "&";
        }
        args.url += param_string;
    }

    var request = new XMLHttpRequest();
    request.open(args.post ? "POST" : "GET", args.url, args.async);
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.onloadend = function() {
        if (args.parse_json) {
            var result;
            try {
                result = JSON.parse(request.responseText);
            } catch (ex) {
                result = {"error": request.responseText};
            }
            args.callback(result);
        } else {
            args.callback(request.responseText);
        }
    };
    request.send(args.post ? JSON.stringify(args.data) : undefined);
}

function select(method, selector) {
    if (method == "id") {
        var js_object = document.getElementById(selector);
        return js_object == undefined ? undefined : DOM_Object(js_object);
    }

    if (method == "class") {
        var elements = [];
        var js_objects = document.getElementsByClassName(selector);

        for (var i = 0; i < js_objects.length; i++) {
            elements.push(new DOM_Object(js_objects[i]));
        }

        return elements;
    }
}

function DOM_Object(js_object) {
    this.js_object = js_object;
    this.classes = this.js_object.className == undefined ? [] : this.js_object.className.split(" ");

    this.add_class = function (class_name) {
        if (this.classes.indexOf(class_name) == -1) {
            this.classes.push(class_name);
        }
        this.js_object.className = this.classes.join(" ");
    };

    this.remove_class = function(class_name) {
        if (this.classes.indexOf(class_name) != -1) {
            this.classes.splice(this.classes.indexOf(class_name), 1);
        }
        this.js_object.className = this.classes.join(" ");
    };
    return this;
}