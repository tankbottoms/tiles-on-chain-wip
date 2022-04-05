"use strict";
var __awaiter =
        (this && this.__awaiter) ||
        function (e, r, t, s) {
            return new (t || (t = Promise))(function (n, a) {
                function i(e) {
                    try {
                        d(s.next(e));
                    } catch (e) {
                        a(e);
                    }
                }

                function o(e) {
                    try {
                        d(s.throw(e));
                    } catch (e) {
                        a(e);
                    }
                }

                function d(e) {
                    var r;
                    e.done
                        ? n(e.value)
                        : ((r = e.value),
                          r instanceof t
                              ? r
                              : new t(function (e) {
                                    e(r);
                                })).then(i, o);
                }
                d((s = s.apply(e, r || [])).next());
            });
        },
    __generator =
        (this && this.__generator) ||
        function (e, r) {
            var t,
                s,
                n,
                a,
                i = {
                    label: 0,
                    sent: function () {
                        if (1 & n[0]) throw n[1];
                        return n[1];
                    },
                    trys: [],
                    ops: [],
                };
            return (
                (a = {
                    next: o(0),
                    throw: o(1),
                    return: o(2),
                }),
                "function" == typeof Symbol &&
                    (a[Symbol.iterator] = function () {
                        return this;
                    }),
                a
            );

            function o(a) {
                return function (o) {
                    return (function (a) {
                        if (t)
                            throw new TypeError(
                                "Generator is already executing."
                            );
                        for (; i; )
                            try {
                                if (
                                    ((t = 1),
                                    s &&
                                        (n =
                                            2 & a[0]
                                                ? s.return
                                                : a[0]
                                                ? s.throw ||
                                                  ((n = s.return) && n.call(s),
                                                  0)
                                                : s.next) &&
                                        !(n = n.call(s, a[1])).done)
                                )
                                    return n;
                                switch (
                                    ((s = 0),
                                    n && (a = [2 & a[0], n.value]),
                                    a[0])
                                ) {
                                    case 0:
                                    case 1:
                                        n = a;
                                        break;
                                    case 4:
                                        return (
                                            i.label++,
                                            {
                                                value: a[1],
                                                done: !1,
                                            }
                                        );
                                    case 5:
                                        i.label++, (s = a[1]), (a = [0]);
                                        continue;
                                    case 7:
                                        (a = i.ops.pop()), i.trys.pop();
                                        continue;
                                    default:
                                        if (
                                            !(n =
                                                (n = i.trys).length > 0 &&
                                                n[n.length - 1]) &&
                                            (6 === a[0] || 2 === a[0])
                                        ) {
                                            i = 0;
                                            continue;
                                        }
                                        if (
                                            3 === a[0] &&
                                            (!n || (a[1] > n[0] && a[1] < n[3]))
                                        ) {
                                            i.label = a[1];
                                            break;
                                        }
                                        if (6 === a[0] && i.label < n[1]) {
                                            (i.label = n[1]), (n = a);
                                            break;
                                        }
                                        if (n && i.label < n[2]) {
                                            (i.label = n[2]), i.ops.push(a);
                                            break;
                                        }
                                        n[2] && i.ops.pop(), i.trys.pop();
                                        continue;
                                }
                                a = r.call(e, i);
                            } catch (e) {
                                (a = [6, e]), (s = 0);
                            } finally {
                                t = n = 0;
                            }
                        if (5 & a[0]) throw a[1];
                        return {
                            value: a[0] ? a[1] : void 0,
                            done: !0,
                        };
                    })([a, o]);
                };
            }
        },
    __importDefault =
        (this && this.__importDefault) ||
        function (e) {
            return e && e.__esModule
                ? e
                : {
                      default: e,
                  };
        };
exports.__esModule = !0;
var sharp_1 = __importDefault(require("sharp")),
    ethers_1 = require("ethers"),
    express_1 = __importDefault(require("express")),
    tile_1 = require("./tile"),
    port = 9600,
    app = express_1.default();
app.get("*", function (e, r, t) {
    r.header("Access-Control-Allow-Origin", "*"),
        "OPTIONS" === e.method ? r.status(200).end() : t();
});
var baseUrl = "http://api.tiles.art/";
app.get("/tile/:address", function (e, r) {
    var t = checkAddressExists(e.params.address, r);
    if (t)
        try {
            r.setHeader("Content-Type", "image/svg+xml")
                .send(tile_1.tileForAddress(t).svg())
                .end();
        } catch (e) {
            r.status(500).send(
                "Couldn't render Tile for address: " + t + ". Error: " + e
            );
        }
}),
    app.get("/svg/:address", function (e, r) {
        var t = checkAddressExists(e.params.address, r);
        if (t)
            try {
                r.setHeader("Content-Type", "image/svg+xml")
                    .send(tile_1.tileForAddress(t).svg())
                    .end();
            } catch (e) {
                r.status(500).send(
                    "Couldn't render Tile for address: " + t + ". Error: " + e
                );
            }
    }),
    app.get("/png/:address", function (e, r) {
        return __awaiter(void 0, void 0, void 0, function () {
            var t, s, n, a;
            return __generator(this, function (i) {
                switch (i.label) {
                    case 0:
                        return (t = checkAddressExists(e.params.address, r))
                            ? (3,
                              (s = tile_1
                                  .tileForAddress(
                                      t,
                                      ("string" ==
                                          typeof (null === (a = e.query) ||
                                          void 0 === a
                                              ? void 0
                                              : a.scale) &&
                                          parseFloat(e.query.scale)) ||
                                          3
                                  )
                                  .svg()),
                              [
                                  4,
                                  sharp_1
                                      .default(Buffer.from(s))
                                      .toFormat("png", {
                                          compressionLevel: 1,
                                          palette: !0,
                                      })
                                      .toBuffer(),
                              ])
                            : [2];
                    case 1:
                        n = i.sent();
                        try {
                            r.setHeader("Content-Type", "image/png")
                                .send(n)
                                .end();
                        } catch (e) {
                            r.status(500).send(
                                "Couldn't render Tile for address: " +
                                    t +
                                    ". Error: " +
                                    e
                            );
                        }
                        return [2];
                }
            });
        });
    }),
    app.get("/metadata/:address", function (e, r) {
        var t = checkAddressExists(e.params.address, r);
        t &&
            r
                .json({
                    name: "0x" + t,
                    image: baseUrl + "png/" + t,
                    description:
                        "**0x" +
                        t +
                        "** &NewLine;&NewLine; [SVG](" +
                        baseUrl +
                        "svg/" +
                        t +
                        ") &NewLine;&NewLine; [PNG](" +
                        baseUrl +
                        "png/" +
                        t +
                        "?scale=5)",
                })
                .end();
    }),
    app.get("*", function (e, r) {
        return r.sendStatus(404).end();
    });
var checkAddressExists = function (e, r) {
        var t = e.startsWith("0x") ? e.slice(2) : e;
        if (ethers_1.utils.isAddress(t) && 40 === t.length) return t;
        r.status(404).send("Not a valid ETH address").end();
    },
    server = app.listen(process.env.PORT || port, function () {
        console.log("Server now listening on port", server.address().port);
    });
