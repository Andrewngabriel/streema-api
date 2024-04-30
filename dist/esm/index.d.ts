import { Region, Country, City, Genre, RadioStation } from "./models";
export default class StreemaAPI {
    private readonly BASE_URL;
    readonly REGIONS: {
        North_America: {
            name: string;
            countries: number;
        };
        Central_America: {
            name: string;
            countries: number;
        };
        South_America: {
            name: string;
            countries: number;
        };
        Europe: {
            name: string;
            countries: number;
        };
        Africa: {
            name: string;
            countries: number;
        };
        Asia: {
            name: string;
            countries: number;
        };
        Oceania: {
            name: string;
            countries: number;
        };
    };
    private domCache;
    /**
    * Obtains the DOM of the Streema website and caches it
    * @returns {Promise<cheerio.Root>} Cheerio root object
    */
    private obtainCachedDOM;
    /**
     * Obtains the DOM of any given URL
     * @param {string} url URL to obtain the DOM from
     * @returns {Promise<cheerio.Root>} Cheerio root object
     */
    private obtainDOM;
    /**
     * Returns a list of regions
     * @returns {Promise<Region[]>} List of regions
     */
    getRegions(): Promise<Region[]>;
    /**
     * Returns a list of featured countries
     * @returns {Promise<Country[]>} List of featured countries
     */
    featuredCountries(): Promise<Country[]>;
    /**
     * Returns a list of featured cities
     * @returns {Promise<City[]>} List of featured cities
     */
    featuredCities(): Promise<City[]>;
    /**
     * Returns a list of featured genres
     * @returns {Promise<Genre[]>} List of featured genres
     */
    getGenres(): Promise<Genre[]>;
    /**
     * Obtains a list of stations by url slug
     * @param slug URL slug to look up stations by
     * @returns Promise<RadioStation[]>
     */
    getStationsBySlug(slug: string): Promise<RadioStation[]>;
    /**
     * Takes a station URL and obtains stream URL then checks whether the stream is working or not
     * @param {string} url Station URL
     * @returns {Promise<string | undefined>}
     */
    private obtainStreamURL;
    private obtainStationImage;
}
