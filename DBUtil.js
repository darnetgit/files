/**
 * Created by D on 04-Jun-17.
 */
//this is only an example, handling everything is yours responsibilty !

var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;
var Connection = require('tedious').Connection;

//----------------------------------------------------------------------------------------------------------------------

exports.Select = function(connection, query, callback) {
    var req = new Request(query, function (err, rowCount) {
        if (err) {
            console.log(err);
            return;
        }
    });
    var ans = [];
    var properties = [];
    req.on('columnMetadata', function (columns) {
        columns.forEach(function (column) {
            if (column.colName != null)
                properties.push(column.colName);
        });
    });
    req.on('row', function (row) {
        var item = {};
        for (i=0; i<row.length; i++) {
            item[properties[i]] = row[i].value;
        }
        ans.push(item);
    });

    req.on('requestCompleted', function () {
        //don't forget handle your errors
        console.log('request Completed: '+ req.rowCount + ' row(s) returned');
        console.log(ans);
        callback(ans);
    });



    connection.execSql(req);

};
//----------------------------------------------------------------------------------------------------------------------

exports.Insert= function(query2,config) {
    var connection2 = new Connection(config);
    connection2.on('connect', function (err) {
        if (err) {
            console.log(err);
        }
        else {
            var request = new Request(query2,function (err2, rowCount,rows) {
                if(err2)
                    console.log(err2);
            });
            connection2.execSql(request);
        }
    });

};
exports.Delete= function(query2,config) {
    var connection2 = new Connection(config);
    connection2.on('connect', function (err) {
        if (err) {
            console.log(err);
        }
        else {
            var request = new Request(query2,function (err2, rowCount,rows) {
                if(err2)
                    console.log(err2);
            });
            connection2.execSql(request);
        }
    });

};
exports.Update= function(query2,config) {
    var connection2 = new Connection(config);
    connection2.on('connect', function (err) {
        if (err) {
            console.log(err);
        }
        else {
            var request = new Request(query2,function (err2, rowCount,rows) {
                if(err2)
                    console.log(err2);
            });
            connection2.execSql(request);
        }
    });

};

exports.promiseSelect = function(connection, query) {
    return new Promise(function(resolve,reject){
        var req = new Request(query, function (err, rowCount) {
            if (err) {
                console.log(err);
                reject(err.message);
            }
        });
        var ans = [];
        var properties = [];
        req.on('columnMetadata', function (columns) {
            columns.forEach(function (column) {
                if (column.colName != null)
                    properties.push(column.colName);
            });
        });
        req.on('row', function (row) {
            var item = {};
            for (i=0; i<row.length; i++) {
                item[properties[i]] = row[i].value;
            }
            ans.push(item);
        });
        req.on('requestCompleted', function () {
            //don't forget handle your errors
            console.log('request Completed: '+ req.rowCount + ' row(s) returned');
            console.log(ans);
            resolve(ans);
            //callback(ans);
        });
        connection.execSql(req)
    });
};

exports.promiseInsert= function(connection, query) {
    return new Promise(function(resolve,reject){
        var req = new Request(query, function (err) {
            if (err) {
                console.log(err);
                reject(err.message);
            }
            else
            {
                console.log('request Completed');
                resolve();
            }
        });

        connection.execSql(req);

    });

};





