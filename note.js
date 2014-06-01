/*global RemoteStorage*/
RemoteStorage.defineModule('notes', function (privateClient, publicClient) {
    "use strict";
    
    /**
     * Generates a GUID string.
     * @returns {String} The generated GUID.
     * @example af8a8416-6e18-a307-bd9c-f2c947bbb3aa
     * @author Slavik Meltser (slavik@meltser.info).
     * @link http://slavik.meltser.info/?p=142
     */
    function guid() {
        var p8 = function (s) {
            var p = (Math.random().toString(16) + "000000000").substr(2, 8);
            return s ? "-" + p.substr(0, 4) + "-" + p.substr(4, 4) : p;
        };
        return p8() + p8(true) + p8(true) + p8();
    }

    // Define a common data type using JSON Schema
    privateClient.declareType('note', {
        "description": "a simple note",
        "type": "object",
        "properties": {
            "id": {
                "type": "string",
                "format": "id"
            },
            "title": {
                "type": "string"
            },
            "content": {
                "type": "string"
            }
        }
    });

    return {
        exports: {
            add: function (title, content) {
                var id = guid();
                
                return privateClient.storeObject('note', id, {
                    id: id,
                    title: title,
                    content: content
                });
            },
            
            update: function (note) {
                return privateClient.storeObject('note', note.id, note);
            },
            
            remove: function (id) {
                return privateClient.remove(id);
            },
            
            get: function (id) {
                return privateClient.getObject(id);
            },
            
            list: function () {
                return privateClient.getAll('');
            },
            
            on: privateClient.on.bind(privateClient)
        }
    };
});