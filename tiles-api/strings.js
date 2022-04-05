"use strict";
(exports.__esModule = !0),
    (exports.getCircleProps = exports.getPath = exports.getInnerHtml = void 0);
var getInnerHtml = function (e) {
    return e.slice(e.indexOf(">") + 1, e.lastIndexOf("<"));
};
exports.getInnerHtml = getInnerHtml;
var getPath = function (e) {
    var t = e.slice(e.indexOf('d="') + 3);
    return t.slice(0, t.indexOf('"'));
};
exports.getPath = getPath;
var getCircleProps = function (e) {
    var t = e.slice(e.indexOf('cx="') + 4),
        r = parseFloat(t.slice(0, t.indexOf('"'))),
        i = e.slice(e.indexOf('cy="') + 4),
        n = parseFloat(i.slice(0, i.indexOf('"'))),
        s = e.slice(e.indexOf('r="') + 3);
    return { cx: r, cy: n, r: parseFloat(s.slice(0, s.indexOf('"'))) };
};
exports.getCircleProps = getCircleProps;
