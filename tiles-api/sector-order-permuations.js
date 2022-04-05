"use strict";
(exports.__esModule = !0), (exports.sectorOrderPermutations = void 0);
var permutate = function (e) {
    for (var t = [], r = 0; r < e.length; r++) {
        var s = permutate(e.slice(0, r).concat(e.slice(r + 1)));
        if (s.length)
            for (var o = 0; o < s.length; o++) t.push([e[r]].concat(s[o]));
        else t.push([e[r]]);
    }
    return t;
};
exports.sectorOrderPermutations = permutate([0, 1, 2, 3, 4, 5, 6, 7, 8]);
