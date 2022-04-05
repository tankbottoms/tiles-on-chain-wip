"use strict";
(exports.__esModule = !0), (exports.getCircleProps = exports.getPath = void 0);
var getPath = function (e) {
    var r = e.slice(e.indexOf('d="') + 3);
    return r.slice(0, r.indexOf('"'));
};
exports.getPath = getPath;
var getCircleProps = function (e) {
    var r = e.slice(e.indexOf('cx="') + 4),
        t = parseFloat(r.slice(0, r.indexOf('"'))),
        i = e.slice(e.indexOf('cy="') + 4),
        s = parseFloat(i.slice(0, i.indexOf('"'))),
        c = e.slice(e.indexOf('r="') + 3);
    return { cx: t, cy: s, r: parseFloat(c.slice(0, c.indexOf('"'))) };
};
exports.getCircleProps = getCircleProps;
