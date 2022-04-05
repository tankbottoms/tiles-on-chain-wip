"use strict";
var __spreadArray =
    (this && this.__spreadArray) ||
    function (r, e) {
        for (var s = 0, i = e.length, o = r.length; s < i; s++, o++)
            r[o] = e[s];
        return r;
    };
(exports.__esModule = !0), (exports.tileForAddress = void 0);
var svg_js_1 = require("@svgdotjs/svg.js"),
    ethers_1 = require("ethers"),
    svgdom_1 = require("svgdom"),
    svgs_1 = require("./svgs"),
    utils_1 = require("./utils"),
    window = svgdom_1.createSVGWindow(),
    document = window.document;
svg_js_1.registerWindow(svgdom_1.createSVGWindow(), document);
var sectorSize = 100,
    borderSize = 30,
    tileSize = 3 * sectorSize + 2 * borderSize,
    canvasColor = "#FAF3E8",
    shapeOpacity = ".88",
    red = "#FE4465",
    black = "#222",
    blue = "#1A49EF",
    yellow = "#F8D938",
    hexInt = {
        0: 0,
        1: 1,
        2: 2,
        3: 3,
        4: 4,
        5: 5,
        6: 6,
        7: 7,
        8: 8,
        9: 9,
        a: 10,
        A: 10,
        b: 11,
        B: 11,
        c: 12,
        C: 12,
        d: 13,
        D: 13,
        e: 14,
        E: 14,
        f: 15,
        F: 15,
    },
    toNum = function (r) {
        return ethers_1.BigNumber.from("0x" + r.join("")).toNumber();
    },
    ringVariantsFrom = function (r) {
        var e = r.positions,
            s = r.positionKind,
            i = r.sizes,
            o = r.layers,
            t = r.solid;
        return e.flatMap(function (r) {
            return i.flatMap(function (e) {
                return o.map(function (i) {
                    return {
                        positionIndex: r,
                        positionKind: s,
                        size: e,
                        layer: i,
                        solid: t,
                    };
                });
            });
        });
    },
    ringVariants = __spreadArray(
        __spreadArray(
            __spreadArray(
                __spreadArray(
                    __spreadArray(
                        __spreadArray(
                            __spreadArray(
                                [null],
                                ringVariantsFrom({
                                    positionKind: "intersection",
                                    positions: [
                                        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,
                                        12, 13, 14, 15,
                                    ],
                                    sizes: [1, 2, 3],
                                    layers: [2],
                                })
                            ),
                            ringVariantsFrom({
                                positionKind: "intersection",
                                positions: [
                                    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
                                    13, 14, 15,
                                ],
                                sizes: [1, 2],
                                layers: [1, 2],
                                solid: !0,
                            })
                        ),
                        ringVariantsFrom({
                            positionKind: "intersection",
                            positions: [
                                0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
                                14, 15,
                            ],
                            sizes: [3],
                            layers: [0, 1],
                            solid: !0,
                        })
                    ),
                    ringVariantsFrom({
                        positionKind: "sector",
                        positions: [0, 1, 2, 3, 4, 5, 6, 7, 8],
                        sizes: [1, 2],
                        layers: [1, 2],
                    })
                ),
                ringVariantsFrom({
                    positionKind: "sector",
                    positions: [0, 1, 2, 3, 4, 5, 6, 7, 8],
                    sizes: [0, 1],
                    layers: [0, 1, 2],
                    solid: !0,
                })
            ),
            ringVariantsFrom({
                positionKind: "sector",
                positions: [0, 1, 2, 3, 4, 5, 6, 7, 8],
                sizes: [2],
                layers: [0, 1],
                solid: !0,
            })
        ),
        ringVariantsFrom({
            positionKind: "sector",
            positions: [4],
            sizes: [1, 2],
            layers: [0],
        })
    );
console.log(
    "Ring variants:",
    { count: ringVariants.length },
    {
        duplicates:
            ringVariants
                .map(function (r, e) {
                    return __spreadArray(
                        __spreadArray([], ringVariants.slice(0, e)),
                        ringVariants.slice(e + 1)
                    ).some(function (e, s) {
                        return r && e
                            ? r.layer === e.layer &&
                                  r.positionIndex === e.positionIndex &&
                                  r.positionKind === e.positionKind &&
                                  r.size === e.size &&
                                  r.solid === e.solid &&
                                  (console.log("found duplicate", r, e), !0)
                            : r === e;
                    });
                })
                .filter(function (r) {
                    return r;
                }).length / 2,
    }
);
var drawRing = function (r, e, s) {
        if ((void 0 === s && (s = 1), e)) {
            var i,
                o = sectorSize,
                t = 0,
                n = 0,
                a = 0;
            switch (e.size) {
                case 0:
                    t = o - 90;
                    break;
                case 1:
                    t = o - 50 - 1.2;
                    break;
                case 2:
                    t = o - 10;
                    break;
                case 3:
                    t = 2 * o - 10;
            }
            if (
                (2 === e.layer && (t += 0.5), "intersection" === e.positionKind)
            )
                (n = o * ((i = e.positionIndex) % 4)),
                    (a = i > 11 ? 3 * o : i > 7 ? 2 * o : i > 3 ? o : 0);
            if ("sector" === e.positionKind)
                (n = o * ((i = e.positionIndex) % 3)),
                    (a = i > 5 ? 2 * o : i > 2 ? o : 0),
                    (n += 0.5 * o),
                    (a += 0.5 * o);
            r.circle()
                .size(t * s)
                .stroke({ width: 10 * s, color: canvasColor })
                .fill(e.solid ? canvasColor : "none")
                .translate(n * s, a * s);
        }
    },
    sectorColorVariants = {
        0: [red, yellow, black],
        1: [red, black, blue],
        2: [red, yellow, blue],
        3: [red, blue, yellow],
        4: [blue, yellow, red],
        5: [blue, red, yellow],
        6: [blue, yellow, yellow],
        7: [blue, black, red],
        8: [black, red, yellow],
        9: [black, red, blue],
        10: [black, blue, red],
        11: [black, yellow, blue],
        12: [yellow, red, black],
        13: [yellow, blue, red],
        14: [yellow, black, blue],
        15: [yellow, black, red],
    },
    sectorColorsFromInt16 = function (r) {
        var e = sectorColorVariants[r];
        return { layer0: e[0], layer1: e[1], layer2: e[2] };
    },
    getAddressSegments = function (r) {
        var e = [];
        return r.split("").reduce(function (r, s) {
            if ((e.push(s), 4 === e.length)) {
                var i = e;
                return (e = []), __spreadArray(__spreadArray([], r), [i]);
            }
            return r;
        }, []);
    },
    generateTileSectors = function (r) {
        return r.map(function (r) {
            var e = sectorColorsFromInt16(hexInt[r[0]]);
            return [
                { svg: svgs_1.svgs[hexInt[r[1]]], color: e.layer0 },
                { svg: svgs_1.svgs[hexInt[r[2]]], color: e.layer1 },
                { svg: svgs_1.svgs[hexInt[r[3]]], color: e.layer2 },
            ];
        });
    },
    tileForAddress = function (r, e) {
        void 0 === e && (e = 1);
        var s = r.startsWith("0x") ? r.split("0x")[1] : r;
        if (
            ((s = s.substr(s.length - 40, 40)),
            !ethers_1.utils.isAddress(s) || 40 !== s.length)
        )
            throw r + " is not a valid Tile address.";
        var i = getAddressSegments(s),
            o = i[0],
            t = i.slice(1),
            n = generateTileSectors(t),
            a = tileSize * e,
            l = svg_js_1.SVG().size(a, a);
        console.log(`${a}`);
        console.log(`${l}`);
        l.rect(a, a).fill(canvasColor);
        console.log(l);
        for (
            var d = l.group(),
                c = ringVariants[toNum([o[0], o[1]])],
                u = ringVariants[toNum([o[2], o[3]])],
                p = function (r) {
                    for (
                        var s = d.group(),
                            i = function (i) {
                                var o = s.group();
                                i > 0 &&
                                    o.translate(sectorSize * (i % 3) * e, 0),
                                    i >= 6
                                        ? o.translate(0, 2 * sectorSize * e)
                                        : i >= 3 &&
                                          o.translate(0, sectorSize * e),
                                    o.scale(e),
                                    (function (e) {
                                        var s = e[r],
                                            i = s.svg,
                                            t = s.color;
                                        if (
                                            (i.startsWith("<path") &&
                                                o
                                                    .path(utils_1.getPath(i))
                                                    .css({
                                                        opacity: shapeOpacity,
                                                    })
                                                    .fill(t),
                                            i.startsWith("<circle"))
                                        ) {
                                            var n = utils_1.getCircleProps(i),
                                                a = n.cx,
                                                l = n.cy,
                                                d = n.r;
                                            o.circle(2 * d)
                                                .css({ opacity: shapeOpacity })
                                                .translate(a - d, l - d)
                                                .fill(t);
                                        }
                                    })(n[i]);
                            },
                            o = 0;
                        o < 9;
                        o++
                    )
                        i(o);
                    (null == c ? void 0 : c.layer) === r && drawRing(s, c, e),
                        (null == u ? void 0 : u.layer) === r &&
                            drawRing(s, u, e);
                },
                g = 0;
            g < 3;
            g++
        )
            p(g);
        return d.translate(borderSize * e, borderSize * e), l;
    };
exports.tileForAddress = tileForAddress;
