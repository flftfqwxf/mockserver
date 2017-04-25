var treeEditor = null,
    codeEditor = null;
"https:" === location.protocol && (location.href = location.href.replace(/^https:/, "http:"));
var app = {},
    AUTO_SAVE_DELAY = 4e3,
    LOCAL_SAVE_DELAY = 1e3,
    MAX_LOAD_DURATION = 3e3;
app.doc = {
    name: null,
    _id: null,
    _rev: null
}, app.lastChanged = void 0, app.changed = !1, app.autoSaveTimer = null, app.localSaveTimer = null, app.conflictMessages = [], app.codeToTree = function() {
    try {
        treeEditor.set(codeEditor.get())
    } catch (e) {
        app.notify.showError(app.formatError(e))
    }
}, app.treeToCode = function() {
    try {
        codeEditor.set(treeEditor.get())
    } catch (e) {
        app.notify.showError(app.formatError(e))
    }
}, app.load = function(json) {
    try {
        app.notify = new Notify, app.retriever = new FileRetriever({
            scriptUrl: "fileretriever.php",
            notify: app.notify,
            timeout: 12e4
        }), app.store = new OnlineStore({
            url: "//api.jsoneditoronline.org/v1/docs/",
            notify: app.notify
        });
        var e = document.getElementById("codeEditor");
        codeEditor = new JSONEditor(e, {
            mode: "code",
            onChange: function() {
                app.setChanged(codeEditor)
            }, onError: function(e) {
                app.notify.showError(app.formatError(e))
            }
        }), localStorage.indentation && (codeEditor.indentation = parseInt(localStorage.indentation)), e = document.getElementById("treeEditor"), treeEditor = new JSONEditor(e, {
            mode: "tree",
            onChange: function() {
                app.setChanged(treeEditor)
            },
            onError: function(e) {
                app.notify.showError(app.formatError(e))
            }
        }), app.applySchema(localStorage.schemaUrl), app.splitter = new Splitter({
            container: document.getElementById("drag"),
            change: function() {
                app.resize()
            }
        });
        document.getElementById("toTree").onclick = function() {
            this.focus(), app.codeToTree()
        };
        document.getElementById("toCode").onclick = function() {
            this.focus(), app.treeToCode()
        }, util.addEventListener(window, "resize", app.resize), codeEditor.aceEditor.commands.removeCommand("showSettingsMenu"), document.body.onkeydown = function(e) {
            var t = e.which ? e.which : e.keyCode || 0;
            if (e.ctrlKey) switch (t) {
                case 83:
                    app.saveOnline(), e.stopPropagation(), e.preventDefault();
                    break;
                case 188:
                    app.treeToCode(), codeEditor.focus();
                    break;
                case 190:
                    app.codeToTree();
                    var i = treeEditor.content.querySelector("[contenteditable=true]");
                    i ? i.focus() : treeEditor.node.dom.expand ? treeEditor.node.dom.expand.focus() : treeEditor.node.dom.menu ? treeEditor.node.dom.menu.focus() : (i = this.frame.querySelector("button")) && i.focus()
            }
        };
        document.getElementById("name").onclick = app.renameOnline;
        var t = document.getElementById("new");
        t.href = document.location.pathname + "#/new", t.onclick = function(e) {
            app.doc._id || (document.location.href = document.location.pathname + "#/new", location.reload())
        };
        document.getElementById("openFromDisk").onclick = function(e) {
            app.openFromDisk(), e.stopPropagation(), e.preventDefault()
        };
        document.getElementById("openUrl").onclick = function(e) {
            app.openUrl(), e.stopPropagation(), e.preventDefault()
        };
        document.getElementById("saveToDisk").onclick = app.saveToDisk;
        document.getElementById("saveOnline").onclick = app.saveOnline;
        var i = document.getElementById("indentation");
        i.value = localStorage.indentation || "2", i.onfocus = function() {
            util.addClassName(document.querySelector("li.settings"), "active")
        }, i.onchange = function() {
            app.applyIndentation(i.value, !0)
        }, i.onblur = function() {
            app.applyIndentation(i.value), util.removeClassName(document.querySelector("li.settings"), "active")
        }, addDragDropListener(window, function(e, t, i) {
            if (e) app.notify.showError(e);
            else if (app.doc.name && app.doc._id) {
                if (app.changed) {
                    app._saveOnline(!0)
                }
                localStorage.data = t, document.location.href = document.location.pathname
            } else app.setData(t), app.setMetaData({
                name: i
            }), localStorage.data = t
        }), window.onblur = app._saveOnlineIfChanged, document.getElementById("menu").onmouseover = app._saveOnlineIfChanged, window.onfocus = function() {
            app.showFilesList(), app.showSchemasList()
        }, codeEditor.focus(), document.body.spellcheck = !1, app.showFilesList(), app.showSchemasList();
        var n = new QueryParams,
            r = n.getValue("json"),
            o = n.getValue("url"),
            s = n.getValue("id"),
            a = "#/new" == location.hash,
            l = "#/open" == location.hash;


        // console.log('r:',r);
        //
        // console.log('r:',r);

        if (s) app.openOnline(s);
        else if (r) app.setData(r), app.changed = !1;
        else if (o) app.openUrl(o);
        else if (a) location.hash = "/", codeEditor.setText(""), app.changed = !1;
        else if (l) location.hash = "/", app.openFromDisk();
        // else if (void 0 !== localStorage.data) app.openLocalStorage(!0), app.changed = !1;
        else {
            var c = json || {
                    array: [1, 2, 3],
                    boolean: !0,
                    null: null,
                    number: 123,
                    object: {
                        a: "b",
                        c: "d",
                        e: "f"
                    },
                    string: "Hello World"
                };
            codeEditor.set(c), treeEditor.set(c)
        }
        newFeatureInfo()
    } catch (e) {
        try {
            app.notify.showError(app.formatError(e))
        } catch (t) {
            console && console.log && console.log(e), alert(e)
        }
    }
}, app.setChanged = function(e) {
    app.lastChanged = e, app.changed = !0, app.doc._id ? (app.showStatus('changed (<a href="javascript: app._saveOnline(true)">save now</a>)'), app.autoSaveTimer && clearTimeout(app.autoSaveTimer), app.autoSaveTimer = setTimeout(app._saveOnlineIfChanged, AUTO_SAVE_DELAY)) : (app.localSaveTimer && clearTimeout(app.localSaveTimer), app.localSaveTimer = setTimeout(function() {
            app.changed && (app.changed = !1, localStorage.data = app.getData())
        }, LOCAL_SAVE_DELAY))
}, app.sync = function() {
    app.lastChanged == treeEditor && app.treeToCode()
}, app.setData = function(e) {
    codeEditor.setText(e);
    try {
        var t = util.parse(e);
        treeEditor.set(t)
    } catch (e) {
        treeEditor.set({}), app.notify.showError(app.formatError(e))
    }
}, app.setMetaData = function(e) {
    void 0 != e._id && (this.doc._id = e._id), void 0 != e._rev && (this.doc._rev = e._rev), void 0 != e.name && (this.doc.name = e.name), e._id && app.showName(e.name || "unnamed document")
}, app.showName = function(e) {
    for (var t = document.getElementById("name"); t.firstChild;) t.removeChild(t.firstChild);
    t.appendChild(document.createTextNode(e)), t.style.visibility = "visible", document.title = e + " - JSON Editor Online"
}, app.openLocalStorage = function(e) {
    if (e) {
        const t = app.getLastLoadDuration();
        if (t < MAX_LOAD_DURATION) app.openLocalStorage(!1);
        else if (isFinite(t)) {
            const i = Math.round(t / 1e3);
            confirm("Loading data took very long last time, about " + i + " seconds. Do you want to load this data again?") && app.openLocalStorage(!1)
        } else confirm("Loading data was not successful last time. Do you want to try to load this data again?") && app.openLocalStorage(!1)
    } else {
        var n = Date.now();
        localStorage.dataLoadTime = JSON.stringify({
            start: n
        });
        var r = localStorage.data;
        app.setData(r);
        var o = Date.now(),
            s = o - n;
        localStorage.dataLoadTime = JSON.stringify({
            start: n,
            end: o,
            duration: s
        })
    }
}, app.getLastLoadDuration = function() {
    try {
        if (localStorage.dataLoadTime) {
            var e = JSON.parse(localStorage.dataLoadTime);
            if ("duration" in e) return e.duration;
            if ("start" in e && !("end" in e)) return 1 / 0
        }
    } catch (e) {
        console.error(e)
    }
    return 0
}, app.openFromDisk = function() {
    app.doc._id ? document.location.href = document.location.pathname + "#/open" : app.retriever.loadFile(function(e, t, i) {
            e ? app.notify.showError(e) : (app.setData(t), app.setMetaData({
                    name: util.getName(i)
                }), localStorage.data = t)
        })
}, app.openUrl = function(e) {
    function t(t, i) {
        t ? app.notify.showError(t) : i && (app.setData(i), app.setMetaData({
                name: util.getName(e)
            }))
    }

    e ? app.retriever.loadUrl(e, t) : app.retriever.loadUrlDialog(function(e) {
            e && (document.location.href = document.location.pathname + "?url=" + encodeURIComponent(e))
        })
}, app.getData = function() {
    return app.lastChanged === treeEditor ? JSON.stringify(treeEditor.get(), null, codeEditor.indentation) : codeEditor.getText()
}, app.saveToDisk = function() {
    app.sync();
    var e = app.getData();
    app.retriever.saveFile(e, app.doc.name, function(e) {
        e && app.notify.showError(e)
    })
}, app.saveOnline = function() {
    if (app.sync(), app.doc.name && app.doc._id) app._saveOnline();
    else {
        var e = app.doc.name || null;
        util.prompt({
            title: "Save online",
            titleSubmit: "Save",
            description: "Enter a name for the document.<br><br>The saved document is stored online and can be shared with others via an url.",
            inputType: "text",
            inputName: "filename",
            inputDefault: e,
            callback: function(e) {
                void 0 != e && (app.setMetaData({
                    name: e
                }), app._saveOnline())
            }
        })
    }
}, app.saveLocal = function(e) {
    var t = localStorage.files,
        i = t ? JSON.parse(t) : {};
    i[e._id] = {
        _id: e._id,
        _rev: e._rev,
        name: e.name,
        updated: (new Date).toISOString()
    }, localStorage.files = JSON.stringify(i), app.showFilesList(i), app.showSchemasList()
}, app.applyIndentation = function(e, t) {
    var i = parseInt(e);
    isNaN(i) ? t || app.notify.showError(new TypeError("Integer number expected for indentation")) : (localStorage.indentation = i, codeEditor.indentation = i, codeEditor.aceEditor.getSession().setTabSize(i))
}, app.applySchema = function(e) {
    if (e || (e = ""), localStorage.schemaUrl = e, "" !== e.trim()) {
        var t = app.notify.showNotification("loading schema...");
        ajax.get(e, {}, function(e, i, n) {
            if (app.notify.removeMessage(t), n >= 200 && n < 300) try {
                var r = util.parse(i);
                treeEditor.setSchema(r), codeEditor.setSchema(r)
            } catch (e) {
                app.notify.showError(app.formatError("Failed to parse JSON schema: " + e))
            } else app.notify.showError(e || new Error("Failed to load JSON schema"))
        })
    } else treeEditor.setSchema(null), codeEditor.setSchema(null);
    app.showSchemasList()
}, app.lastFilesStr = null, app.showFilesList = function(e) {
    if (!e) {
        var t = localStorage.files;
        e = t ? JSON.parse(t) : {}
    }
    if (app.lastFilesStr != t) {
        app.lastFilesStr = t;
        var i = document.getElementById("filesList"),
            n = Object.keys(e).sort(function(t, i) {
                return e[t].updated < e[i].updated
            });
        i.innerHTML = "", n.length > 0 && n.forEach(function(t) {
            var n = e[t],
                r = document.createElement("div");
            r.className = "file";
            var o = document.createElement("a");
            o.className = "open", o.href = location.pathname + "?id=" + t, o.appendChild(document.createTextNode(n.name || t)), o.title = "Date: " + n.updated.substring(0, 19).replace("T", " "), r.appendChild(o);
            var s = document.createElement("a");
            s.className = "remove", s.innerHTML = "&times;", s.title = 'Delete "' + n.name + '"', s.onclick = function(e) {
                e.stopPropagation(), e.preventDefault(), confirm('Are you sure you want to delete document "' + n.name + '"?\n\nThis action cannot be undone') && app.removeOnline(n)
            }, r.appendChild(s), i.appendChild(r)
        })
    }
}, app.lastSchemasStr = null, app.showSchemasList = function() {
    var e = JSON.parse(localStorage.schemas || "[]"),
        t = JSON.stringify(e);
    if (app.lastSchemasStr != t) {
        app.lastSchemasStr = t;
        var i = document.getElementById("schemasList");
        i.innerHTML = "";
        var n = document.createElement("div");
        n.appendChild(document.createTextNode("JSON schema validation")), i.appendChild(n);
        var r = e.map(app.schemaMetaData).filter(function(e) {
            return null != e
        });
        if (r.length < e.length) {
            var o = r.map(function(e) {
                return e.schema
            });
            localStorage.schemas = JSON.stringify(o)
        }
        if (r.length > 0) r.forEach(function(e) {
            var t = document.createElement("div");
            t.className = "schema";
            var n = document.createElement("label");
            t.appendChild(n);
            var r = document.createElement("input");
            r.type = "checkbox", r.checked = localStorage.schemaUrl === e.url, r.onchange = function() {
                if (r.checked) {
                    for (var t = i.querySelectorAll("input"), n = 0; n < t.length; n++) t[n] !== r && (t[n].checked = !1);
                    app.applySchema(e.url)
                } else app.applySchema(null)
            }, n.appendChild(r), n.appendChild(document.createTextNode(" " + e.name)), n.title = e.title;
            var o = document.createElement("a");
            o.className = "remove", o.innerHTML = "&times;", o.title = 'Remove "' + e.name + '" from the list (the file itself will not be removed)', o.onclick = function(t) {
                t.stopPropagation(), t.preventDefault(), app.removeSchema(e.url)
            }, t.appendChild(o), i.appendChild(t)
        });
        else {
            var s = document.createElement("div");
            s.className = "info", s.appendChild(document.createTextNode("(no schemas added yet)")), i.appendChild(s)
        }
        var a = document.createElement("button");
        a.className = "addSchema flat", a.appendChild(document.createTextNode("Add schema")), a.onclick = app.addSchema;
        var l = document.createElement("div");
        l.appendChild(a), i.appendChild(l)
    }
}, app.schemaMetaData = function(e) {
    try {
        var t = JSON.parse(localStorage.files || "{}");
        return "url" === e.type ? {
                url: e.url,
                name: e.url.split("/").pop(),
                title: e.url,
                schema: e
            } : {
                url: app.store.getDataUrl(e.id),
                name: t[e.id].name,
                title: "id: " + e.id,
                schema: e
            }
    } catch (e) {
        console.error(e)
    }
    return null
}, app.addSchema = function() {
    var e = JSON.parse(localStorage.files || "{}");
    util.addClassName(document.querySelector("li.settings"), "active"), util.selectSchema(e, function(e) {
        if (util.removeClassName(document.querySelector("li.settings"), "active"), e) {
            var t = JSON.parse(localStorage.schemas || "[]");
            t.push(e), localStorage.schemas = JSON.stringify(t);
            var i = app.schemaMetaData(e).url;
            app.applySchema(i), app.showSchemasList()
        }
    })
}, app.removeSchema = function(e) {
    var t = JSON.parse(localStorage.schemas || "[]"),
        i = t.filter(function(t) {
            return app.schemaMetaData(t).url !== e
        });
    localStorage.schemas = JSON.stringify(i), app.showSchemasList()
}, app.renameOnline = function() {
    var e = app.doc.name || null;
    util.prompt({
        title: "Rename file",
        titleSubmit: "Save",
        description: "Enter a new name for the document.",
        inputType: "text",
        inputName: "filename",
        inputDefault: e,
        callback: function(e) {
            void 0 != e && (app.setMetaData({
                name: e
            }), app.doc._id && app._saveOnline())
        }
    })
}, app._saveOnlineIfChanged = function() {
    if (app.changed && app.doc._id) {
        app.changed = !1;
        return app._saveOnline(!0), "Still saving your latest changes..."
    }
}, app._saveOnline = function(e) {
    var t = {
        name: app.doc.name || null,
        data: app.getData()
    };
    app.doc._id && app.doc._rev && (t._id = app.doc._id, t._rev = app.doc._rev), app.changed = !1;
    var i = {
        silent: e
    };
    app.showStatus("saving changes..."), app.store.save(t, i, function(t, i) {
        if (t) "Error: Document update conflict." == t.toString() && (t = new Error('Document update conflict.<p>This document has been changed in an other browser or tab.</p><p>Solutions:</p><ul><li><a href="javascript: location.reload();">load latest version from the server</a> (overrides your local changes)</li><li><a href="javascript: app._forceSaveOnline();">save my version to the server</a> (overrides the changes on the server)</li></ul>')), app.conflictMessages.push(app.notify.showError(t)), app.showStatus("failed to save");
        else {
            app.saveLocal(i), app.setMetaData(i), app.showStatus("saved"), app.showFilesList(), e || app.notify.showNotification('file has been saved as "' + app.doc.name + '"', 1e3);
            var n = (new QueryParams).getValue("id");
            app.doc._id != n && (document.location.href = document.location.pathname + "?id=" + i._id)
        }
    })
}, app._forceSaveOnline = function() {
    for (var e; e = app.conflictMessages.shift();) app.notify.removeMessage(e);
    app.store.load(app.doc._id, function(e, t) {
        e ? app.notify.showError(e) : (app.setMetaData(t), app.saveLocal(t), app._saveOnline())
    })
}, app.removeOnline = function(e) {
    app.store.remove(e, function(t, i) {
        if (t) app.notify.showError(t);
        else {
            var n = localStorage.files,
                r = n ? JSON.parse(n) : {};
            delete r[e._id], localStorage.files = JSON.stringify(r), app.doc._id == e._id ? (app.changed = !1, document.location.href = document.location.pathname + "#/new") : (app.showFilesList(r), app.showSchemasList())
        }
    })
}, app.showStatus = function(e) {
    document.getElementById("name-status").innerHTML = e
}, app.openOnline = function(e) {
    app.changed = !1, app.store.load(e, function(e, t) {
        e ? app.notify.showError(e) : (app.setData(t.data), app.setMetaData(t), app.saveLocal(t), app.changed = !1, app.showStatus("saved"))
    })
}, app.askTitle = function(e, t) {
    util.prompt({
        title: "Save online",
        titleSubmit: "Save",
        description: "Enter a name for the document.<br><br>The saved document is stored online and can be shared with others via an url.",
        inputType: "text",
        inputName: "filename",
        inputDefault: e,
        callback: t
    })
}, app.formatError = function(e) {
    var t = e.toString().replace(/</g, "&lt;").replace(/>/g, "&gt;");
    return -1 !== t.indexOf("Parse error") ? '<pre class="error">' + t + '</pre><a class="error" href="http://zaach.github.com/jsonlint/" target="_blank">validated by jsonlint</a>' : t
}, app.clearFile = function() {
    var e = {};
    codeEditor.set(e), treeEditor.set(e)
}, app.resize = function() {
    var e = document.getElementById("menu"),
        t = document.getElementById("treeEditor"),
        i = document.getElementById("codeEditor"),
        n = document.getElementById("splitter"),
        r = document.getElementById("buttons"),
        o = document.getElementById("drag"),
        s = document.getElementById("ad"),
        a = window.innerWidth || document.body.offsetWidth || document.documentElement.offsetWidth,
        l = s ? s.clientWidth : 0;
    if (l && (a -= l + 15), app.splitter) {
        app.splitter.setWidth(a);
        var c = app.splitter.getValue(),
            h = c > 0,
            d = c < 1,
            u = h && d;
        r.style.display = u ? "" : "none";
        var f, p = n.clientWidth;
        if (h)
            if (d) {
                f = a * c - p / 2;
                var m = 8 == util.getInternetExplorerVersion();
                o.innerHTML = m ? "|" : "&#8942;", o.title = "Drag left or right to change the width of the panels"
            } else f = a * c - p, o.innerHTML = "&lsaquo;", o.title = "Drag left to show the tree editor";
        else f = 0, o.innerHTML = "&rsaquo;", o.title = "Drag right to show the code editor";
        i.style.display = 0 == c ? "none" : "", i.style.width = Math.max(Math.round(f), 0) + "px", codeEditor.resize(), o.style.height = n.clientHeight - r.clientHeight - 30 - (u ? 15 : 0) + "px", o.style.lineHeight = o.style.height, t.style.display = 1 == c ? "none" : "", t.style.left = Math.round(f + p) + "px", t.style.width = Math.max(Math.round(a - f - p - 2), 0) + "px"
    }
    e && (e.style.right = l ? 15 + (l + 15) + "px" : "15px")
}, window.addEventListener("load", function() {
    var e = document.getElementById("ad");
    if (e && "function" == typeof window.getComputedStyle) {
        var t = window.getComputedStyle(e, null);
        e.style.width = t.getPropertyValue("width"), e.style.height = t.getPropertyValue("height")
    }
});