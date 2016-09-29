/**
 * @return {undefined}
 */
function QueryParams() {
}
/**
 * @return {undefined}
 */
function Notify() {
    this.dom = {};
    var me = this;
    jsoneditor.util.addEventListener(document, "keydown", function (event) {
        me.onKeyDown(event);
    });
}
/**
 * @param {Object} params
 * @return {undefined}
 */
function Splitter(params) {
    if (!params || !params.container) {
        throw new Error("params.container undefined in Splitter constructor");
    }
    var _this = this;
    jsoneditor.util.addEventListener(params.container, "mousedown", function (event) {
        _this.onMouseDown(event);
    });
    this.container = params.container;
    /** @type {number} */
    this.snap = Number(params.snap) || 200;
    this.width = void 0;
    this.value = void 0;
    this.onChange = params.change ? params.change : function () {
    };
    this.params = {};
}
QueryParams.prototype.getQuery = function () {
    /** @type {string} */
    var uHostName = window.location.search.substring(1);
    /** @type {Array.<string>} */
    var directives = uHostName.split("&");
    var cache = {};
    /** @type {number} */
    var i = 0;
    /** @type {number} */
    var len = directives.length;
    for (; len > i; i++) {
        /** @type {Array.<string>} */
        var keyValue = directives[i].split("=");
        if (2 == keyValue.length) {
            /** @type {string} */
            var k = decodeURIComponent(keyValue[0]);
            /** @type {string} */
            var v = decodeURIComponent(keyValue[1]);
            /** @type {string} */
            cache[k] = v;
        }
    }
    return cache;
}, QueryParams.prototype.setQuery = function (query) {
    /** @type {string} */
    var hash = "";
    var key;
    for (key in query) {
        if (query.hasOwnProperty(key)) {
            var value = query[key];
            if (void 0 != value) {
                if (hash.length) {
                    hash += "&";
                }
                hash += encodeURIComponent(key);
                hash += "=";
                hash += encodeURIComponent(query[key]);
            }
        }
    }
    /** @type {string} */
    window.location.search = hash.length ? "#" + hash : "";
}, QueryParams.prototype.getValue = function (path) {
    var query = this.getQuery();
    return query[path];
}, QueryParams.prototype.setValue = function (path, val) {
    var query = this.getQuery();
    query[path] = val;
    this.setQuery(query);
};
var ajax = function () {
    /**
     * @param {string} method
     * @param {?} url
     * @param {Array} data
     * @param {Object} headers
     * @param {Function} callback
     * @return {undefined}
     */
    function fetch(method, url, data, headers, callback) {
        try {
            /** @type {XMLHttpRequest} */
            var xhr = new XMLHttpRequest;
            if (xhr.onreadystatechange = function () {
                    if (4 == xhr.readyState) {
                        callback(xhr.responseText, xhr.status);
                    }
                }, xhr.open(method, url, true), headers) {
                var header;
                for (header in headers) {
                    if (headers.hasOwnProperty(header)) {
                        xhr.setRequestHeader(header, headers[header]);
                    }
                }
            }
            xhr.send(data);
        } catch (STOP) {
            callback(STOP, 0);
        }
    }

    /**
     * @param {string} url
     * @param {?} headers
     * @param {Function} callback
     * @return {undefined}
     */
    function get(url, headers, callback) {
        fetch("GET", url, null, headers, callback);
    }

    /**
     * @param {?} url
     * @param {Array} value
     * @param {Object} callback
     * @param {Function} key
     * @return {undefined}
     */
    function post(url, value, callback, key) {
        fetch("POST", url, value, callback, key);
    }

    return {
        /** @type {function (string, ?, Array, Object, Function): undefined} */
        fetch: fetch,
        /** @type {function (string, ?, Function): undefined} */
        get: get,
        /** @type {function (?, Array, Object, Function): undefined} */
        post: post
    };
}();
/**
 * @param {string} options
 * @return {undefined}
 */
var FileRetriever = function (options) {
    options = options || {};
    this.options = {
        maxSize: void 0 != options.maxSize ? options.maxSize : 1048576,
        html5: void 0 != options.html5 ? options.html5 : true
    };
    /** @type {number} */
    this.timeout = Number(options.timeout) || 3E4;
    this.headers = {
        Accept: "application/json"
    };
    this.scriptUrl = options.scriptUrl || "fileretriever.php";
    this.notify = options.notify || void 0;
    /** @type {string} */
    this.defaultFilename = "document.json";
    this.dom = {};
};
FileRetriever.prototype._hide = function (el) {
    /** @type {string} */
    el.style.visibility = "hidden";
    /** @type {string} */
    el.style.position = "absolute";
    /** @type {string} */
    el.style.left = "-1000px";
    /** @type {string} */
    el.style.top = "-1000px";
    /** @type {string} */
    el.style.width = "0";
    /** @type {string} */
    el.style.height = "0";
}, FileRetriever.prototype.remove = function () {
    var dom = this.dom;
    var name;
    for (name in dom) {
        if (dom.hasOwnProperty(name)) {
            var line = dom[name];
            if (line.parentNode) {
                line.parentNode.removeChild(line);
            }
        }
    }
    this.dom = {};
}, FileRetriever.prototype._getFilename = function (path) {
    return path ? path.replace(/^.*[\\\/]/, "") : "";
}, FileRetriever.prototype.setUrl = function (url) {
    /** @type {string} */
    this.url = url;
}, FileRetriever.prototype.getFilename = function () {
    return this.defaultFilename;
}, FileRetriever.prototype.getUrl = function () {
    return this.url;
}, FileRetriever.prototype.loadUrl = function (url, callback) {
    this.setUrl(url);
    var divMessage = void 0;
    if (this.notify) {
        divMessage = this.notify.showNotification("loading url...");
    }
    var me = this;
    /**
     * @param {Object} recurring
     * @param {?} data
     * @return {undefined}
     */
    var callbackOnce = function (recurring, data) {
        if (callback) {
            callback(recurring, data);
            callback = void 0;
        }
        if (me.notify) {
            if (divMessage) {
                me.notify.removeMessage(divMessage);
                divMessage = void 0;
            }
        }
    };
    var scriptUrl = this.scriptUrl;
    ajax.get(url, me.headers, function (data, dataAndEvents) {
        if (200 == dataAndEvents) {
            callbackOnce(null, data);
        } else {
            var recurring;
            /** @type {string} */
            var indirectUrl = scriptUrl + "?url=" + encodeURIComponent(url);
            ajax.get(indirectUrl, me.headers, function (data, err) {
                if (200 == err) {
                    callbackOnce(null, data);
                } else {
                    if (404 == err) {
                        console.log('Error: url "' + url + '" not found', err, data);
                        /** @type {Error} */
                        recurring = new Error('Error: url "' + url + '" not found');
                        callbackOnce(recurring, null);
                    } else {
                        console.log('Error: failed to load url "' + url + '"', err, data);
                        /** @type {Error} */
                        recurring = new Error('Error: failed to load url "' + url + '"');
                        callbackOnce(recurring, null);
                    }
                }
            });
        }
    });
    setTimeout(function () {
        callbackOnce(new Error("Error loading url (time out)"));
    }, this.timeout);
}, FileRetriever.prototype.loadFile = function (callback) {
    var divMessage = void 0;
    var me = this;
    /**
     * @return {undefined}
     */
    var startLoading = function () {
        if (me.notify) {
            if (!divMessage) {
                divMessage = me.notify.showNotification("loading file...");
            }
        }
        setTimeout(function () {
            callbackOnce(new Error("Error loading url (time out)"));
        }, me.timeout);
    };
    /**
     * @param {Object} recurring
     * @param {?} data
     * @return {undefined}
     */
    var callbackOnce = function (recurring, data) {
        if (callback) {
            callback(recurring, data);
            callback = void 0;
        }
        if (me.notify) {
            if (divMessage) {
                me.notify.removeMessage(divMessage);
                divMessage = void 0;
            }
        }
    };
    var n = me.options.html5 && (window.File && window.FileReader);
    if (n) {
        this.prompt({
            title: "Open file",
            titleSubmit: "Open",
            description: "Select a file on your computer.",
            inputType: "file",
            inputName: "file",
            /**
             * @param {Array} success
             * @param {Object} field
             * @return {undefined}
             */
            callback: function (success, field) {
                if (success) {
                    if (n) {
                        var file = field.files[0];
                        /** @type {FileReader} */
                        var reader = new FileReader;
                        /**
                         * @param {Event} e
                         * @return {undefined}
                         */
                        reader.onload = function (e) {
                            var data = e.target.result;
                            callbackOnce(null, data);
                        };
                        reader.readAsText(file);
                    }
                    startLoading();
                }
            }
        });
    } else {
        /** @type {string} */
        var iframeName = "fileretriever-upload-" + Math.round(1E15 * Math.random());
        /** @type {Element} */
        var iframe = document.createElement("iframe");
        /** @type {string} */
        iframe.name = iframeName;
        me._hide(iframe);
        /**
         * @return {undefined}
         */
        iframe.onload = function () {
            var html = iframe.contentWindow.document.body.innerHTML;
            if (html) {
                var url = me.scriptUrl + "?id=" + html + "&filename=" + me.getFilename();
                ajax.get(url, me.headers, function (data, dataAndEvents) {
                    if (200 == dataAndEvents) {
                        callbackOnce(null, data);
                    } else {
                        /** @type {Error} */
                        var recurring = new Error("Error loading file " + me.getFilename());
                        callbackOnce(recurring, null);
                    }
                    if (iframe.parentNode === document.body) {
                        document.body.removeChild(iframe);
                    }
                });
            }
        };
        document.body.appendChild(iframe);
        this.prompt({
            title: "Open file",
            titleSubmit: "Open",
            description: "Select a file on your computer.",
            inputType: "file",
            inputName: "file",
            formAction: this.scriptUrl,
            formMethod: "POST",
            formTarget: iframeName,
            /**
             * @param {Array} success
             * @return {undefined}
             */
            callback: function (success) {
                if (success) {
                    startLoading();
                }
            }
        });
    }
}, FileRetriever.prototype.loadUrlDialog = function (callback) {
    var jQuery = this;
    this.prompt({
        title: "Open url",
        titleSubmit: "Open",
        description: "Enter a public url. Urls which need authentication or are located on an intranet cannot be loaded.",
        inputType: "text",
        inputName: "url",
        inputDefault: this.getUrl(),
        /**
         * @param {string} url
         * @return {undefined}
         */
        callback: function (url) {
            if (url) {
                jQuery.loadUrl(url, callback);
            } else {
                callback();
            }
        }
    });
}, FileRetriever.prototype.prompt = function (params) {
    /**
     * @return {undefined}
     */
    var removeDialog = function () {
        if (background.parentNode) {
            background.parentNode.removeChild(background);
        }
        if (overlay.parentNode) {
            overlay.parentNode.removeChild(overlay);
        }
        jsoneditor.util.removeEventListener(document, "keydown", onKeyDown);
    };
    /**
     * @return {undefined}
     */
    var onCancel = function () {
        removeDialog();
        if (params.callback) {
            params.callback(null);
        }
    };
    var onKeyDown = jsoneditor.util.addEventListener(document, "keydown", function (event) {
        var key = event.which;
        if (27 == key) {
            onCancel();
            event.preventDefault();
            event.stopPropagation();
        }
    });
    /** @type {Element} */
    var overlay = document.createElement("div");
    /** @type {string} */
    overlay.className = "fileretriever-overlay";
    document.body.appendChild(overlay);
    /** @type {Element} */
    var form = document.createElement("form");
    /** @type {string} */
    form.className = "fileretriever-form";
    form.target = params.formTarget || "";
    form.action = params.formAction || "";
    form.method = params.formMethod || "POST";
    /** @type {string} */
    form.enctype = "multipart/form-data";
    /** @type {string} */
    form.encoding = "multipart/form-data";
    /**
     * @return {?}
     */
    form.onsubmit = function () {
        return field.value ? (setTimeout(function () {
            removeDialog();
        }, 0), params.callback && params.callback(field.value, field), void 0 != params.formAction && void 0 != params.formMethod) : (alert("Enter a " + params.inputName + " first..."), false);
    };
    /** @type {Element} */
    var title = document.createElement("div");
    if (title.className = "fileretriever-title", title.appendChild(document.createTextNode(params.title || "Dialog")), form.appendChild(title), params.description) {
        /** @type {Element} */
        var description = document.createElement("div");
        /** @type {string} */
        description.className = "fileretriever-description";
        description.appendChild(document.createTextNode(params.description));
        form.appendChild(description);
    }
    /** @type {Element} */
    var field = document.createElement("input");
    /** @type {string} */
    field.className = "fileretriever-field";
    field.type = params.inputType || "text";
    field.name = params.inputName || "text";
    field.value = params.inputDefault || "";
    /** @type {Element} */
    var contents = document.createElement("div");
    /** @type {string} */
    contents.className = "fileretriever-contents";
    contents.appendChild(field);
    form.appendChild(contents);
    /** @type {Element} */
    var cancel = document.createElement("input");
    /** @type {string} */
    cancel.className = "fileretriever-cancel";
    /** @type {string} */
    cancel.type = "button";
    cancel.value = params.titleCancel || "Cancel";
    /** @type {function (): undefined} */
    cancel.onclick = onCancel;
    /** @type {Element} */
    var submit = document.createElement("input");
    /** @type {string} */
    submit.className = "fileretriever-submit";
    /** @type {string} */
    submit.type = "submit";
    submit.value = params.titleSubmit || "Ok";
    /** @type {Element} */
    var buttons = document.createElement("div");
    /** @type {string} */
    buttons.className = "fileretriever-buttons";
    buttons.appendChild(cancel);
    buttons.appendChild(submit);
    form.appendChild(buttons);
    /** @type {Element} */
    var border = document.createElement("div");
    /** @type {string} */
    border.className = "fileretriever-border";
    border.appendChild(form);
    /** @type {Element} */
    var background = document.createElement("div");
    /** @type {string} */
    background.className = "fileretriever-background";
    background.appendChild(border);
    /**
     * @param {Event} event
     * @return {undefined}
     */
    background.onclick = function (event) {
        var cur = event.target;
        if (cur == background) {
            onCancel();
        }
    };
    document.body.appendChild(background);
    field.focus();
    field.select();
}, FileRetriever.prototype.saveFile = function (data, callback) {
    var divMessage = void 0;
    if (this.notify) {
        divMessage = this.notify.showNotification("saving file...");
    }
    var me = this;
    /**
     * @param {Error} error
     * @return {undefined}
     */
    var callbackOnce = function (error) {
        if (callback) {
            callback(error);
            callback = void 0;
        }
        if (me.notify) {
            if (divMessage) {
                me.notify.removeMessage(divMessage);
                divMessage = void 0;
            }
        }
    };
    /** @type {Element} */
    var a = document.createElement("a");
    if (this.options.html5 && (void 0 != a.download && !util.isFirefox())) {
        /** @type {string} */
        a.style.display = "none";
        /** @type {string} */
        a.href = "data:application/json;charset=utf-8," + encodeURIComponent(data);
        a.download = this.getFilename();
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        callbackOnce();
    } else {
        if (data.length < this.options.maxSize) {
            ajax.post(me.scriptUrl, data, me.headers, function (dataAndEvents, deepDataAndEvents) {
                if (200 == deepDataAndEvents) {
                    /** @type {Element} */
                    var iframe = document.createElement("iframe");
                    iframe.src = me.scriptUrl + "?id=" + dataAndEvents + "&filename=" + me.getFilename();
                    me._hide(iframe);
                    document.body.appendChild(iframe);
                    callbackOnce();
                } else {
                    callbackOnce(new Error("Error saving file"));
                }
            });
        } else {
            callbackOnce(new Error("Maximum allowed file size exceeded (" + this.options.maxSize + " bytes)"));
        }
    }
    setTimeout(function () {
        callbackOnce(new Error("Error saving file (time out)"));
    }, this.timeout);
}, Notify.prototype.showNotification = function (message) {
    return this.showMessage({
        type: "notification",
        message: message,
        closeButton: false
    });
}, Notify.prototype.showError = function (error) {
    return this.showMessage({
        type: "error",
        message: error.message ? "Error: " + error.message : error.toString(),
        closeButton: true
    });
}, Notify.prototype.showMessage = function (params) {
    var frame = this.dom.frame;
    if (!frame) {
        /** @type {number} */
        var delta = 500;
        /** @type {number} */
        var newTop = 5;
        /** @type {number} */
        var x = document.body.offsetWidth || window.innerWidth;
        /** @type {Element} */
        frame = document.createElement("div");
        /** @type {string} */
        frame.style.position = "absolute";
        /** @type {string} */
        frame.style.left = (x - delta) / 2 + "px";
        /** @type {string} */
        frame.style.width = delta + "px";
        /** @type {string} */
        frame.style.top = newTop + "px";
        /** @type {string} */
        frame.style.zIndex = "999";
        document.body.appendChild(frame);
        /** @type {Element} */
        this.dom.frame = frame;
    }
    var type = params.type || "notification";
    /** @type {boolean} */
    var closeable = params.closeButton !== false;
    /** @type {Element} */
    var divMessage = document.createElement("div");
    divMessage.className = type;
    divMessage.type = type;
    /** @type {boolean} */
    divMessage.closeable = closeable;
    /** @type {string} */
    divMessage.style.position = "relative";
    frame.appendChild(divMessage);
    /** @type {Element} */
    var table = document.createElement("table");
    /** @type {string} */
    table.style.width = "100%";
    divMessage.appendChild(table);
    /** @type {Element} */
    var tbody = document.createElement("tbody");
    table.appendChild(tbody);
    /** @type {Element} */
    var tr = document.createElement("tr");
    tbody.appendChild(tr);
    /** @type {Element} */
    var tdMessage = document.createElement("td");
    if (tdMessage.innerHTML = params.message || "", tr.appendChild(tdMessage), closeable) {
        /** @type {Element} */
        var tdClose = document.createElement("td");
        /** @type {string} */
        tdClose.style.textAlign = "right";
        /** @type {string} */
        tdClose.style.verticalAlign = "top";
        tr.appendChild(tdClose);
        /** @type {Element} */
        var closeDiv = document.createElement("button");
        /** @type {string} */
        closeDiv.innerHTML = "&times;";
        /** @type {string} */
        closeDiv.title = "Close message (ESC)";
        tdClose.appendChild(closeDiv);
        var me = this;
        /**
         * @return {undefined}
         */
        closeDiv.onclick = function () {
            me.removeMessage(divMessage);
        };
    }
    return divMessage;
}, Notify.prototype.removeMessage = function (message) {
    var frame = this.dom.frame;
    if (!message && frame) {
        var child = frame.firstChild;
        for (; child && !child.closeable;) {
            child = child.nextSibling;
        }
        if (child) {
            if (child.closeable) {
                message = child;
            }
        }
    }
    if (message) {
        if (message.parentNode == frame) {
            message.parentNode.removeChild(message);
        }
    }
    if (frame) {
        if (0 == frame.childNodes.length) {
            frame.parentNode.removeChild(frame);
            delete this.dom.frame;
        }
    }
}, Notify.prototype.onKeyDown = function (event) {
    var key = event.which;
    if (27 == key) {
        this.removeMessage();
        event.preventDefault();
        event.stopPropagation();
    }
}, Splitter.prototype.onMouseDown = function (event) {
    var _this = this;
    /** @type {boolean} */
    var o = event.which ? 1 == event.which : 1 == event.button;
    if (o) {
        jsoneditor.util.addClassName(this.container, "active");
        if (!this.params.mousedown) {
            /** @type {boolean} */
            this.params.mousedown = true;
            this.params.mousemove = jsoneditor.util.addEventListener(document, "mousemove", function (event) {
                _this.onMouseMove(event);
            });
            this.params.mouseup = jsoneditor.util.addEventListener(document, "mouseup", function (event) {
                _this.onMouseUp(event);
            });
            this.params.screenX = event.screenX;
            /** @type {boolean} */
            this.params.changed = false;
            this.params.value = this.getValue();
        }
        event.preventDefault();
        event.stopPropagation();
    }
}, Splitter.prototype.onMouseMove = function (event) {
    if (void 0 != this.width) {
        /** @type {number} */
        var diff = event.screenX - this.params.screenX;
        var value = this.params.value + diff / this.width;
        value = this.setValue(value);
        if (value != this.params.value) {
            /** @type {boolean} */
            this.params.changed = true;
        }
        this.onChange(value);
    }
    event.preventDefault();
    event.stopPropagation();
}, Splitter.prototype.onMouseUp = function (event) {
    if (jsoneditor.util.removeClassName(this.container, "active"), this.params.mousedown) {
        jsoneditor.util.removeEventListener(document, "mousemove", this.params.mousemove);
        jsoneditor.util.removeEventListener(document, "mouseup", this.params.mouseup);
        this.params.mousemove = void 0;
        this.params.mouseup = void 0;
        /** @type {boolean} */
        this.params.mousedown = false;
        var value = this.getValue();
        if (!this.params.changed) {
            if (0 == value) {
                value = this.setValue(0.2);
                this.onChange(value);
            }
            if (1 == value) {
                value = this.setValue(0.8);
                this.onChange(value);
            }
        }
    }
    event.preventDefault();
    event.stopPropagation();
}, Splitter.prototype.setWidth = function (width) {
    /** @type {number} */
    this.width = width;
}, Splitter.prototype.setValue = function (value) {
    /** @type {number} */
    value = Number(value);
    if (void 0 != this.width) {
        if (this.width > this.snap) {
            if (value < this.snap / this.width) {
                /** @type {number} */
                value = 0;
            }
            if (value > (this.width - this.snap) / this.width) {
                /** @type {number} */
                value = 1;
            }
        }
    }
    /** @type {string} */
    this.value = value;
    try {
        /** @type {string} */
        localStorage.splitterValue = value;
    } catch (fmt) {
        if (console) {
            if (console.log) {
                console.log(fmt);
            }
        }
    }
    return value;
}, Splitter.prototype.getValue = function () {
    var value = this.value;
    if (void 0 == value) {
        try {
            if (void 0 != localStorage.splitterValue) {
                /** @type {number} */
                value = Number(localStorage.splitterValue);
                value = this.setValue(value);
            }
        } catch (fmt) {
            console.log(fmt);
        }
    }
    return void 0 == value && (value = this.setValue(0.5)), value;
};
/** @type {null} */
var treeEditor = null;
/** @type {null} */
var codeEditor = null;
var app = {};
app.CodeToTree = function () {
    try {
        treeEditor.set(codeEditor.get());
    } catch (err) {
        app.notify.showError(app.formatError(err));
    }
}, app.treeToCode = function () {
    try {
        codeEditor.set(treeEditor.get());
    } catch (err) {
        app.notify.showError(app.formatError(err));
    }
}, app.load = function (json) {
    try {
        app.notify = new Notify;
        app.retriever = new FileRetriever({
            scriptUrl: "fileretriever.php",
            notify: app.notify
        });
        json = json || {
                array: [1, 2, 3],
                "boolean": true,
                "null": null,
                number: 123,
                object: {
                    a: "b",
                    c: "d",
                    e: "f"
                },
                string: "Hello World"
            };
        if (window.QueryParams) {
            var qp = new QueryParams;
            var url = qp.getValue("url");
            if (url) {
                json = {};
                app.openUrl(url);
            }
        }
        app.lastChanged = void 0;
        /** @type {(HTMLElement|null)} */
        var container = document.getElementById("codeEditor");
        codeEditor = new jsoneditor.JSONEditor(container, {
            mode: "code",
            /**
             * @return {undefined}
             */
            change: function () {
                app.lastChanged = codeEditor;
            },
            /**
             * @param {?} err
             * @return {undefined}
             */
            error: function (err) {
                app.notify.showError(app.formatError(err));
            }
        });
        codeEditor.set(json);
        /** @type {(HTMLElement|null)} */
        container = document.getElementById("treeEditor");
        treeEditor = new jsoneditor.JSONEditor(container, {
            mode: "tree",
            /**
             * @return {undefined}
             */
            change: function () {
                app.lastChanged = treeEditor;
            },
            /**
             * @param {?} err
             * @return {undefined}
             */
            error: function (err) {
                app.notify.showError(app.formatError(err));
            }
        });
        treeEditor.set(json);
        app.splitter = new Splitter({
            container: document.getElementById("drag"),
            /**
             * @return {undefined}
             */
            change: function () {
                app.resize();
            }
        });
        /** @type {(HTMLElement|null)} */
        var toTree = document.getElementById("toTree");
        /**
         * @return {undefined}
         */
        toTree.onclick = function () {
            this.focus();
            app.CodeToTree();
        };
        /** @type {(HTMLElement|null)} */
        var toCode = document.getElementById("toCode");
        /**
         * @return {undefined}
         */
        toCode.onclick = function () {
            this.focus();
            app.treeToCode();
        };
        jsoneditor.util.addEventListener(window, "resize", app.resize);
        /** @type {(HTMLElement|null)} */
        var domClear = document.getElementById("clear");
        /** @type {function (): undefined} */
        domClear.onclick = app.clearFile;
        /** @type {(HTMLElement|null)} */
        var domMenuOpenFile = document.getElementById("menuOpenFile");
        /**
         * @param {?} event
         * @return {undefined}
         */
        domMenuOpenFile.onclick = function (event) {
            app.openFile();
            event.stopPropagation();
            event.preventDefault();
        };
        /** @type {(HTMLElement|null)} */
        var domMenuOpenUrl = document.getElementById("menuOpenUrl");
        /**
         * @param {?} event
         * @return {undefined}
         */
        domMenuOpenUrl.onclick = function (event) {
            app.openUrl();
            event.stopPropagation();
            event.preventDefault();
        };
        /** @type {(HTMLElement|null)} */
        var domSave = document.getElementById("save");
        /** @type {function (): undefined} */
        domSave.onclick = app.saveFile;
        codeEditor.focus();
        /** @type {boolean} */
        document.body.spellcheck = false;
    } catch (e) {
        try {
            app.notify.showError(e);
        } catch (c) {
            if (console) {
                if (console.log) {
                    console.log(e);
                }
            }
            alert(e);
        }
    }
}, app.openCallback = function (error, data) {
    if (error) {
        app.notify.showError(error);
    } else {
        if (null != data) {
            codeEditor.setText(data);
            try {
                var json = jsoneditor.util.parse(data);
                treeEditor.set(json);
            } catch (err) {
                treeEditor.set({});
                app.notify.showError(app.formatError(err));
            }
        }
    }
}, app.openFile = function () {
    app.retriever.loadFile(app.openCallback);
}, app.openUrl = function (url) {
    if (url) {
        app.retriever.loadUrl(url, app.openCallback);
    } else {
        app.retriever.loadUrlDialog(app.openCallback);
    }
}, app.saveFile = function () {
    if (app.lastChanged == treeEditor) {
        app.treeToCode();
    }
    app.lastChanged = void 0;
    var endEvent = codeEditor.getText();
    app.retriever.saveFile(endEvent, function (error) {
        if (error) {
            app.notify.showError(error);
        }
    });
}, app.formatError = function (err) {
    /** @type {string} */
    var t = '<pre class="error">' + err.toString() + "</pre>";
    return "undefined" != typeof jsonlint && (t += '<a class="error" href="http://zaach.github.com/jsonlint/" target="_blank">validated by jsonlint</a>'), t;
}, app.clearFile = function () {
    var json = {};
    codeEditor.set(json);
    treeEditor.set(json);
}, app.resize = function () {
    /** @type {(HTMLElement|null)} */
    var domMenu = document.getElementById("menu");
    /** @type {(HTMLElement|null)} */
    var domTreeEditor = document.getElementById("treeEditor");
    /** @type {(HTMLElement|null)} */
    var domCodeEditor = document.getElementById("codeEditor");
    /** @type {(HTMLElement|null)} */
    var domSplitter = document.getElementById("splitter");
    /** @type {(HTMLElement|null)} */
    var domSplitterButtons = document.getElementById("buttons");
    /** @type {(HTMLElement|null)} */
    var el = document.getElementById("drag");
    /** @type {(HTMLElement|null)} */
    var domAd = document.getElementById("ad");
    /** @type {number} */
    var margin = 15;
    var width = window.innerWidth || (document.body.offsetWidth || document.documentElement.offsetWidth);
    /** @type {number} */
    var adWidth = domAd ? domAd.clientWidth : 0;
    if (adWidth && (width -= adWidth + margin), app.splitter) {
        app.splitter.setWidth(width);
        var value = app.splitter.getValue();
        /** @type {boolean} */
        var match = value > 0;
        /** @type {boolean} */
        var tags = 1 > value;
        /** @type {boolean} */
        var height = match && tags;
        /** @type {string} */
        domSplitterButtons.style.display = height ? "" : "none";
        var splitterLeft;
        /** @type {number} */
        var splitterWidth = domSplitter.clientWidth;
        if (match) {
            if (tags) {
                /** @type {number} */
                splitterLeft = width * value - splitterWidth / 2;
                /** @type {boolean} */
                var wrap = 8 == jsoneditor.util.getInternetExplorerVersion();
                /** @type {string} */
                el.innerHTML = wrap ? "|" : "&#8942;";
                /** @type {string} */
                el.title = "Drag left or right to change the width of the panels";
            } else {
                /** @type {number} */
                splitterLeft = width * value - splitterWidth;
                /** @type {string} */
                el.innerHTML = "&lsaquo;";
                /** @type {string} */
                el.title = "Drag left to show the tree editor";
            }
        } else {
            /** @type {number} */
            splitterLeft = 0;
            /** @type {string} */
            el.innerHTML = "&rsaquo;";
            /** @type {string} */
            el.title = "Drag right to show the code editor";
        }
        /** @type {string} */
        domCodeEditor.style.display = 0 == value ? "none" : "";
        /** @type {string} */
        domCodeEditor.style.width = Math.max(Math.round(splitterLeft), 0) + "px";
        codeEditor.resize();
        /** @type {string} */
        el.style.height = domSplitter.clientHeight - domSplitterButtons.clientHeight - 2 * margin - (height ? margin : 0) + "px";
        /** @type {string} */
        el.style.lineHeight = el.style.height;
        /** @type {string} */
        domTreeEditor.style.display = 1 == value ? "none" : "";
        /** @type {string} */
        domTreeEditor.style.left = Math.round(splitterLeft + splitterWidth) + "px";
        /** @type {string} */
        domTreeEditor.style.width = Math.max(Math.round(width - splitterLeft - splitterWidth - 2), 0) + "px";
    }
    if (domMenu) {
        /** @type {string} */
        domMenu.style.right = adWidth ? margin + (adWidth + margin) + "px" : margin + "px";
    }
};
