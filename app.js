/*global remoteStorage*/
(function () {
    "use strict";
    
    var NoteStore, view;
    NoteStore = remoteStorage.notes;
    
    view = {
        init: function () {
            var me = this;
            this.list = document.getElementById("noteslist");
            this.noteTitle = document.getElementById("notetitle");
            this.noteContent = document.getElementById("notecontent");
            
            document.getElementById("action-add").addEventListener('click', function () {
                NoteStore.add("New Note", "");
            }, false);

            this.list.addEventListener("click", function (e) {
                if (e.target.tagName === 'A') {
                    NoteStore.get(e.target.parentNode.id).then(function (note) {
                        view.show(note);
                    });
                } else if (e.target.tagName === 'DIV' && e.target.className.indexOf("delete-button") > -1) {
                    NoteStore.remove(e.target.parentNode.id);
                }
            }, false);

            this.noteTitle.addEventListener("keyup", function () {
                if (!me.currentNote) {
                    return;
                }
                
                me.currentNote.title = this.value;
                NoteStore.update(me.currentNote);
            }, false);

            this.noteContent.addEventListener("keyup", function () {
                if (!me.currentNote) {
                    return;
                }
                
                me.currentNote.content = this.value;
                NoteStore.update(me.currentNote);
            }, false);
        },

        add: function (note) {
            var noteLi = document.createElement("li"),
                contents = document.createElement("a"),
                delBtn = document.createElement("div");

            noteLi.setAttribute("class", "note");
            noteLi.setAttribute("id", note.id);
            
            contents.innerHTML = note.title;
            
            delBtn.innerHTML = "x";
            delBtn.className = "delete-button";
            
            noteLi.appendChild(contents);
            noteLi.appendChild(delBtn);

            this.list.appendChild(noteLi);
        },
        
        remove: function (note) {
            var dom = document.getElementById(note.id);
            if (dom) {
                dom.parentNode.removeChild(dom);
            }
        },
        
        update: function (note) {
            var dom = document.getElementById(note.id);
            if (dom) {
                dom.innerHTML = note.title;
            }
        },
        
        show: function (note) {
            this.currentNote = note;
            this.noteTitle.value = note.title;
            this.noteContent.value = note.content;
            this.noteTitle.focus();
        }
    };

    NoteStore.on('change', function (event) {
        if (event.newValue && !event.oldValue) {
            view.add(event.newValue);
            view.show(event.newValue);
        } else if (!event.newValue && event.oldValue) {
            view.remove(event.oldValue);
        } else {
            view.update(event.newValue);
        }
    });
    
    window.addEventListener("DOMContentLoaded", function () {
        remoteStorage.access.claim('notes', 'rw');
        remoteStorage.displayWidget();
        view.init();
    }, false);
}());