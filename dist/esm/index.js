import axios from "axios";
import * as followRedirects from 'follow-redirects';
import * as cheerio from "cheerio";
export default class Index {
    BASE_URL = "https://streema.com";
    REGIONS = {
        North_America: { name: 'North_America', countries: 5 },
        Central_America: { name: 'Central_America', countries: 29 },
        South_America: { name: 'South_America', countries: 13 },
        Europe: { name: 'Europe', countries: 48 },
        Africa: { name: 'Africa', countries: 50 },
        Asia: { name: 'Asia', countries: 49 },
        Oceania: { name: 'Oceania', countries: 15 }
    };
    domCache = null;
    /**
    * Obtains the DOM of the Streema website and caches it
    * @returns {Promise<cheerio.Root>} Cheerio root object
    */
    async obtainCachedDOM() {
        if (this.domCache) {
            return this.domCache;
        }
        const result = await axios.get(`${this.BASE_URL}/radios`);
        this.domCache = cheerio.load(result.data);
        return this.domCache;
    }
    /**
     * Obtains the DOM of any given URL
     * @param {string} url URL to obtain the DOM from
     * @returns {Promise<cheerio.Root>} Cheerio root object
     */
    async obtainDOM(url) {
        const result = await axios.get(url);
        return cheerio.load(result.data);
    }
    /**
     * Returns a list of regions
     * @returns {Promise<Region[]>} List of regions
     */
    async getRegions() {
        const $ = await this.obtainCachedDOM();
        const regions = [];
        $('.geo-list ul:first li').each((index, element) => {
            const link = $(element).find('a');
            const name = link.text().trim();
            const slug = link.attr('href');
            regions.push({ name, slug });
        });
        return regions;
    }
    /**
     * Returns a list of featured countries
     * @returns {Promise<Country[]>} List of featured countries
     */
    async featuredCountries() {
        const $ = await this.obtainCachedDOM();
        const countries = [];
        $('.geo-list ul').eq(1).find('li a').each((index, element) => {
            const name = $(element).text().trim();
            const slug = $(element).attr('href');
            countries.push({ name, slug });
        });
        return countries;
    }
    /**
     * Returns a list of featured cities
     * @returns {Promise<City[]>} List of featured cities
     */
    async featuredCities() {
        const $ = await this.obtainCachedDOM();
        const cities = [];
        $('.geo-list ul').eq(2).find('li a').each((index, element) => {
            const name = $(element).text().trim();
            const slug = $(element).attr('href');
            cities.push({ name, slug });
        });
        return cities;
    }
    /**
     * Returns a list of featured genres
     * @returns {Promise<Genre[]>} List of featured genres
     */
    async getGenres() {
        const $ = await this.obtainCachedDOM();
        const genres = [];
        $('.geo-list ul.column').each((index, element) => {
            $(element).find('li a').each((index, element) => {
                const name = $(element).text().trim();
                const slug = $(element).attr('href');
                genres.push({ name, slug });
            });
        });
        return genres;
    }
    /**
     * Obtains a list of stations by url slug
     * @param slug URL slug to look up stations by
     * @returns Promise<RadioStation[]>
     */
    async getStationsBySlug(slug) {
        // if (!slug.match(/^\/radios\/[\w\s]+$/)) {
        //   throw new Error('Invalid slug')
        // }
        if (!slug.startsWith('/')) {
            slug = `/${slug}`;
        }
        const $ = await this.obtainDOM(`${this.BASE_URL}${slug}`);
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
                    const streamURL = await this.obtainStreamURL(url);
                    const img = await this.obtainStationImage(url);
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
    }
    /**
     * Takes a station URL and obtains stream URL then checks whether the stream is working or not
     * @param {string} url Station URL
     * @returns {Promise<string | undefined>}
     */
    async obtainStreamURL(url) {
        if (!url)
            return undefined;
        const transformedUrl = url.replace('/radios/', '/radios/play/');
        const fetchUrl = `${this.BASE_URL}${transformedUrl}`;
        try {
            const $ = await this.obtainDOM(fetchUrl);
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
                    request.setTimeout(20_000, () => {
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
    }
    async obtainStationImage(url) {
        if (!url)
            return undefined;
        const transformedUrl = url.replace('/radios/', '/radios/play/');
        const fetchUrl = `${this.BASE_URL}${transformedUrl}`;
        try {
            const $ = await this.obtainDOM(fetchUrl);
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
    }
}
//# sourceMappingURL=index.js.map