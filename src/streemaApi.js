"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = require("axios");
var followRedirects = require("follow-redirects");
var cheerio = require("cheerio");
// Remove the duplicate import statement for 'cheerio'
// import cheerio from "cheerio"
var StreemaAPI = /** @class */ (function () {
    function StreemaAPI() {
        this.BASE_URL = "https://streema.com";
        this.REGIONS = {
            North_America: { name: 'North_America', countries: 5 },
            Central_America: { name: 'Central_America', countries: 29 },
            South_America: { name: 'South_America', countries: 13 },
            Europe: { name: 'Europe', countries: 48 },
            Africa: { name: 'Africa', countries: 50 },
            Asia: { name: 'Asia', countries: 49 },
            Oceania: { name: 'Oceania', countries: 15 }
        };
        this.domCache = null;
    }
    /**
    * Obtains the DOM of the Streema website and caches it
    * @returns {Promise<cheerio.Root>} Cheerio root object
    */
    StreemaAPI.prototype.obtainCachedDOM = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.domCache) {
                            return [2 /*return*/, this.domCache];
                        }
                        return [4 /*yield*/, axios_1.default.get("".concat(this.BASE_URL, "/radios"))];
                    case 1:
                        result = _a.sent();
                        this.domCache = cheerio.load(result.data);
                        return [2 /*return*/, this.domCache];
                }
            });
        });
    };
    /**
     * Obtains the DOM of any given URL
     * @param {string} url URL to obtain the DOM from
     * @returns {Promise<cheerio.Root>} Cheerio root object
     */
    StreemaAPI.prototype.obtainDOM = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, axios_1.default.get(url)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, cheerio.load(result.data)];
                }
            });
        });
    };
    /**
     * Returns a list of regions
     * @returns {Promise<Region[]>} List of regions
     */
    StreemaAPI.prototype.getRegions = function () {
        return __awaiter(this, void 0, void 0, function () {
            var $, regions;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.obtainCachedDOM()];
                    case 1:
                        $ = _a.sent();
                        regions = [];
                        $('.geo-list ul:first li').each(function (index, element) {
                            var link = $(element).find('a');
                            var name = link.text().trim();
                            var slug = link.attr('href');
                            regions.push({ name: name, slug: slug });
                        });
                        return [2 /*return*/, regions];
                }
            });
        });
    };
    /**
     * Returns a list of featured countries
     * @returns {Promise<Country[]>} List of featured countries
     */
    StreemaAPI.prototype.featuredCountries = function () {
        return __awaiter(this, void 0, void 0, function () {
            var $, countries;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.obtainCachedDOM()];
                    case 1:
                        $ = _a.sent();
                        countries = [];
                        $('.geo-list ul').eq(1).find('li a').each(function (index, element) {
                            var name = $(element).text().trim();
                            var slug = $(element).attr('href');
                            countries.push({ name: name, slug: slug });
                        });
                        return [2 /*return*/, countries];
                }
            });
        });
    };
    /**
     * Returns a list of featured cities
     * @returns {Promise<City[]>} List of featured cities
     */
    StreemaAPI.prototype.featuredCities = function () {
        return __awaiter(this, void 0, void 0, function () {
            var $, cities;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.obtainCachedDOM()];
                    case 1:
                        $ = _a.sent();
                        cities = [];
                        $('.geo-list ul').eq(2).find('li a').each(function (index, element) {
                            var name = $(element).text().trim();
                            var slug = $(element).attr('href');
                            cities.push({ name: name, slug: slug });
                        });
                        return [2 /*return*/, cities];
                }
            });
        });
    };
    /**
     * Returns a list of featured genres
     * @returns {Promise<Genre[]>} List of featured genres
     */
    StreemaAPI.prototype.getGenres = function () {
        return __awaiter(this, void 0, void 0, function () {
            var $, genres;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.obtainCachedDOM()];
                    case 1:
                        $ = _a.sent();
                        genres = [];
                        $('.geo-list ul.column').each(function (index, element) {
                            $(element).find('li a').each(function (index, element) {
                                var name = $(element).text().trim();
                                var slug = $(element).attr('href');
                                genres.push({ name: name, slug: slug });
                            });
                        });
                        return [2 /*return*/, genres];
                }
            });
        });
    };
    /**
     * Obtains a list of stations by url slug
     * @param slug URL slug to look up stations by
     * @returns Promise<RadioStation[]>
     */
    StreemaAPI.prototype.getStationsBySlug = function (slug) {
        return __awaiter(this, void 0, void 0, function () {
            var $, stationsDOM, nextPageLink, stations, index, element, name_1, band, genre, location_1, url, thumbnail, streamURL, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // if (!slug.match(/^\/radios\/[\w\s]+$/)) {
                        //   throw new Error('Invalid slug')
                        // }
                        if (!slug.startsWith('/')) {
                            slug = "/".concat(slug);
                        }
                        return [4 /*yield*/, this.obtainDOM("".concat(this.BASE_URL).concat(slug))];
                    case 1:
                        $ = _a.sent();
                        stationsDOM = $('.items-list .item');
                        nextPageLink = $("a.next").attr('href');
                        stations = [];
                        _a.label = 2;
                    case 2:
                        index = 0;
                        _a.label = 3;
                    case 3:
                        if (!(index < stationsDOM.length)) return [3 /*break*/, 8];
                        element = stationsDOM[index];
                        name_1 = $(element).attr('title');
                        band = $(element).find('p.band-dial').text().trim();
                        genre = $(element).find('.item-extra .item-info .genre').text().split('\n').map(function (genre) { return genre.trim(); }).filter(function (genre) { return genre !== ''; });
                        location_1 = $(element).find('.item-extra .item-info .location').text().split('\n').map(function (location) { return location.trim(); }).filter(function (location) { return location !== '' && location !== ' '; }).join(',').replace(/,{2,}/g, ',');
                        url = $(element).attr('data-profile-url');
                        thumbnail = $(element).find('.item-logo img');
                        _a.label = 4;
                    case 4:
                        _a.trys.push([4, 6, , 7]);
                        return [4 /*yield*/, this.obtainStreamURL(url)];
                    case 5:
                        streamURL = _a.sent();
                        if (url && streamURL) {
                            stations.push({
                                name: name_1,
                                band: band,
                                genre: genre,
                                location: location_1,
                                url: url,
                                thumbnail: {
                                    url: thumbnail.attr('src'),
                                    alt: thumbnail.attr('alt'),
                                    width: thumbnail.attr('width'),
                                    height: thumbnail.attr('height')
                                }
                            });
                        }
                        return [3 /*break*/, 7];
                    case 6:
                        e_1 = _a.sent();
                        console.error(e_1);
                        console.error("Station ".concat(name_1, " has no stream URL"));
                        console.error('url:', url);
                        return [3 /*break*/, 7];
                    case 7:
                        index++;
                        return [3 /*break*/, 3];
                    case 8:
                        if (nextPageLink === undefined) return [3 /*break*/, 2];
                        _a.label = 9;
                    case 9: return [2 /*return*/, stations];
                }
            });
        });
    };
    /**
     * Takes a station URL and obtains stream URL then checks whether the stream is working or not
     * @param {string} url Station URL
     * @returns {Promise<string | undefined>}
     */
    StreemaAPI.prototype.obtainStreamURL = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            var transformedUrl, fetchUrl, $, streamURL_1, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!url)
                            return [2 /*return*/, undefined];
                        transformedUrl = url.replace('/radios/', '/radios/play/');
                        fetchUrl = "".concat(this.BASE_URL).concat(transformedUrl);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.obtainDOM(fetchUrl)];
                    case 2:
                        $ = _a.sent();
                        streamURL_1 = $('#source-stream').attr('data-src');
                        console.info("Checking stream ".concat(streamURL_1));
                        if (streamURL_1) {
                            // check if the stream is working and buffering content
                            // if it's not working, return undefined
                            return [2 /*return*/, new Promise(function (resolve, reject) {
                                    var protocol = streamURL_1.startsWith('https') ? followRedirects.https : followRedirects.http;
                                    var request = protocol.get(streamURL_1, function (response) {
                                        response.on('data', function () {
                                            request.destroy();
                                            resolve(url);
                                        });
                                        response.on('end', function () { return reject('Stream ended without receiving any data'); });
                                        response.on('error', function (err) { return reject(err); });
                                    }).on('error', function (err) { return reject(err); });
                                    request.setTimeout(20000, function () {
                                        request.destroy();
                                        reject('Stream connection timed out');
                                    });
                                })];
                        }
                        else
                            return [2 /*return*/, undefined];
                        return [3 /*break*/, 4];
                    case 3:
                        e_2 = _a.sent();
                        console.error(e_2);
                        return [2 /*return*/, undefined];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    StreemaAPI.prototype.getRegionCountries = function (region) {
        return __awaiter(this, void 0, void 0, function () {
            var regionLink, result, $_1, links_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!Object.keys(this.REGIONS).includes(region)) return [3 /*break*/, 2];
                        regionLink = "".concat(this.BASE_URL, "/radios/region/").concat(region);
                        return [4 /*yield*/, axios_1.default.get(regionLink)];
                    case 1:
                        result = _a.sent();
                        $_1 = cheerio.load(result.data);
                        links_1 = [];
                        $_1('.geo-list ul li a').each(function () { links_1.push($_1(_this).attr('href')); });
                        return [2 /*return*/, links_1];
                    case 2: throw new Error("Region is invalid.\nSelect one of the following ".concat(this.REGIONS));
                }
            });
        });
    };
    /**
     * Queries Streema by given country name
     * @param {string} country Country name to look up stations by
     */
    StreemaAPI.prototype.fetchStations = function (country) {
        return __awaiter(this, void 0, void 0, function () {
            var pages, stations;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.fetchPages(country)
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    ];
                    case 1:
                        pages = _a.sent();
                        stations = [];
                        pages.forEach(function (page) { return __awaiter(_this, void 0, void 0, function () {
                            var currentPage, $;
                            var _this = this;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, axios_1.default.get(page)];
                                    case 1:
                                        currentPage = _a.sent();
                                        $ = cheerio.load(currentPage.data);
                                        $('.items-list .item').each(function () {
                                            debugger;
                                            console.log($(_this));
                                        });
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                        return [2 /*return*/];
                }
            });
        });
    };
    StreemaAPI.prototype.fetchPages = function (country) {
        return __awaiter(this, void 0, void 0, function () {
            var pages, nextLink, currentPage, $, nextPageLink, link, e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        pages = ["".concat(this.BASE_URL, "/radios/country/").concat(country)];
                        nextLink = pages[0];
                        _a.label = 1;
                    case 1:
                        if (!true) return [3 /*break*/, 6];
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, axios_1.default.get(nextLink)];
                    case 3:
                        currentPage = _a.sent();
                        $ = cheerio.load(currentPage.data);
                        nextPageLink = $("a.next").attr('href');
                        if (nextPageLink) {
                            link = "".concat(this.BASE_URL).concat(nextPageLink);
                            pages.push(link);
                            nextLink = link;
                        }
                        else
                            return [3 /*break*/, 6];
                        return [3 /*break*/, 5];
                    case 4:
                        e_3 = _a.sent();
                        // console.log(e)
                        return [3 /*break*/, 6];
                    case 5: return [3 /*break*/, 1];
                    case 6: return [2 /*return*/, pages];
                }
            });
        });
    };
    return StreemaAPI;
}());
exports.default = StreemaAPI;
