import { Region, Country, City, Genre, RadioStation } from "./models";
type CallbackFunction = (stations: RadioStation[]) => void;
export default class StreemaAPI {
    private readonly BASE_URL;
    readonly REGIONS: {
        North_America: {
            name: string;
            countries: {
                name: string;
                slug: string;
            }[];
        };
        Central_America: {
            name: string;
            countries: {
                name: string;
                slug: string;
            }[];
        };
        South_America: {
            name: string;
            countries: {
                name: string;
                slug: string;
            }[];
        };
        Europe: {
            name: string;
            countries: {
                name: string;
                slug: string;
            }[];
        };
        Africa: {
            name: string;
            countries: {
                name: string;
                slug: string;
            }[];
        };
        Asia: {
            name: string;
            countries: {
                name: string;
                slug: string;
            }[];
        };
        Oceania: {
            name: string;
            countries: {
                name: string;
                slug: string;
            }[];
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
     * @param callback Optional callback function
     * @returns Promise<RadioStation[]>
     */
    getStationsBySlug(slug: string, callback?: CallbackFunction): Promise<RadioStation[]>;
    /**
     * Takes a station URL and obtains stream URL then checks whether the stream is working or not
     * @param {string} url Station URL
     * @returns {Promise<string | undefined>}
     */
    private obtainStreamURL;
    private obtainStationImage;
}
export {};
