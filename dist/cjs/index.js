"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const followRedirects = __importStar(require("follow-redirects"));
const cheerio = __importStar(require("cheerio"));
class Index {
    constructor() {
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
    obtainCachedDOM() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.domCache) {
                return this.domCache;
            }
            const result = yield axios_1.default.get(`${this.BASE_URL}/radios`);
            this.domCache = cheerio.load(result.data);
            return this.domCache;
        });
    }
    /**
     * Obtains the DOM of any given URL
     * @param {string} url URL to obtain the DOM from
     * @returns {Promise<cheerio.Root>} Cheerio root object
     */
    obtainDOM(url) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield axios_1.default.get(url);
            return cheerio.load(result.data);
        });
    }
    /**
     * Returns a list of regions
     * @returns {Promise<Region[]>} List of regions
     */
    getRegions() {
        return __awaiter(this, void 0, void 0, function* () {
            const $ = yield this.obtainCachedDOM();
            const regions = [];
            $('.geo-list ul:first li').each((index, element) => {
                const link = $(element).find('a');
                const name = link.text().trim();
                const slug = link.attr('href');
                regions.push({ name, slug });
            });
            return regions;
        });
    }
    /**
     * Returns a list of featured countries
     * @returns {Promise<Country[]>} List of featured countries
     */
    featuredCountries() {
        return __awaiter(this, void 0, void 0, function* () {
            const $ = yield this.obtainCachedDOM();
            const countries = [];
            $('.geo-list ul').eq(1).find('li a').each((index, element) => {
                const name = $(element).text().trim();
                const slug = $(element).attr('href');
                countries.push({ name, slug });
            });
            return countries;
        });
    }
    /**
     * Returns a list of featured cities
     * @returns {Promise<City[]>} List of featured cities
     */
    featuredCities() {
        return __awaiter(this, void 0, void 0, function* () {
            const $ = yield this.obtainCachedDOM();
            const cities = [];
            $('.geo-list ul').eq(2).find('li a').each((index, element) => {
                const name = $(element).text().trim();
                const slug = $(element).attr('href');
                cities.push({ name, slug });
            });
            return cities;
        });
    }
    /**
     * Returns a list of featured genres
     * @returns {Promise<Genre[]>} List of featured genres
     */
    getGenres() {
        return __awaiter(this, void 0, void 0, function* () {
            const $ = yield this.obtainCachedDOM();
            const genres = [];
            $('.geo-list ul.column').each((index, element) => {
                $(element).find('li a').each((index, element) => {
                    const name = $(element).text().trim();
                    const slug = $(element).attr('href');
                    genres.push({ name, slug });
                });
            });
            return genres;
        });
    }
    /**
     * Obtains a list of stations by url slug
     * @param slug URL slug to look up stations by
     * @returns Promise<RadioStation[]>
     */
    getStationsBySlug(slug) {
        return __awaiter(this, void 0, void 0, function* () {
            // if (!slug.match(/^\/radios\/[\w\s]+$/)) {
            //   throw new Error('Invalid slug')
            // }
            if (!slug.startsWith('/')) {
                slug = `/${slug}`;
            }
            const $ = yield this.obtainDOM(`${this.BASE_URL}${slug}`);
            const stationsDOM = $('.items-list .item');
            const nextPageLink = $("a.next").attr('href');
            const stations = [];
            do {
                for (let index = 0; index < stationsDOM.length; index++) {
                    const element = stationsDOM[index];
                    const name = $(element).attr('title');
                    const band = $(element).find('p.band-dial').text().trim();
                    const genre = $(element).find('.item-extra .item-info .genre').text().split('\n').map((genre) => genre.trim()).filter((genre) => genre !== '');
                    const location = $(element).find('.item-extra .item-info .location').text().split('\n').map((location) => location.trim()).filter((location) => location !== '' && location !== ' ').join(',').replace(/,{2,}/g, ',');
                    const url = $(element).attr('data-profile-url');
                    const thumbnail = $(element).find('.item-logo img');
                    try {
                        const streamURL = yield this.obtainStreamURL(url);
                        const img = yield this.obtainStationImage(url);
                        if (url && streamURL) {
                            stations.push({
                                name,
                                band,
                                genre,
                                location,
                                url,
                                img,
                                streamURL,
                                thumbnail: {
                                    url: thumbnail.attr('src'),
                                    alt: thumbnail.attr('alt'),
                                    width: thumbnail.attr('width'),
                                    height: thumbnail.attr('height')
                                }
                            });
                        }
                    }
                    catch (e) {
                        console.error(e);
                        console.error(`Station ${name} has no stream URL`);
                        console.error('url:', url);
                    }
                }
            } while (nextPageLink === undefined);
            return stations;
        });
    }
    /**
     * Takes a station URL and obtains stream URL then checks whether the stream is working or not
     * @param {string} url Station URL
     * @returns {Promise<string | undefined>}
     */
    obtainStreamURL(url) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!url)
                return undefined;
            const transformedUrl = url.replace('/radios/', '/radios/play/');
            const fetchUrl = `${this.BASE_URL}${transformedUrl}`;
            try {
                const $ = yield this.obtainDOM(fetchUrl);
                const streamURL = $('#source-stream').attr('data-src');
                console.info(`Checking stream ${streamURL}`);
                if (streamURL) {
                    // check if the stream is working and buffering content
                    // if it's not working, return undefined
                    return new Promise((resolve, reject) => {
                        const protocol = streamURL.startsWith('https') ? followRedirects.https : followRedirects.http;
                        const request = protocol.get(streamURL, (response) => {
                            response.on('data', () => {
                                request.destroy();
                                resolve(streamURL);
                            });
                            response.on('end', () => reject('Stream ended without receiving any data'));
                            response.on('error', (err) => reject(err));
                        }).on('error', (err) => reject(err));
                        request.setTimeout(20000, () => {
                            request.destroy();
                            reject('Stream connection timed out');
                        });
                    });
                }
                else
                    return undefined;
            }
            catch (e) {
                console.error(e);
                return undefined;
            }
        });
    }
    obtainStationImage(url) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!url)
                return undefined;
            const transformedUrl = url.replace('/radios/', '/radios/play/');
            const fetchUrl = `${this.BASE_URL}${transformedUrl}`;
            try {
                const $ = yield this.obtainDOM(fetchUrl);
                const img = $('.song-image img');
                const src = img.attr('src');
                const alt = img.attr('alt');
                const width = img.attr('width');
                const height = img.attr('height');
                return {
                    url: src,
                    alt,
                    width,
                    height
                };
            }
            catch (e) {
                console.error(e);
                return undefined;
            }
        });
    }
}
exports.default = Index;
//# sourceMappingURL=index.js.map