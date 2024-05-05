import axios from "axios"
import * as followRedirects from 'follow-redirects'
import * as cheerio from "cheerio"
import { Region, Country, City, Genre, RadioStation, Image } from "./models"

type CallbackFunction = (stations: RadioStation[]) => void
export default class StreemaAPI {
  private readonly BASE_URL = "https://streema.com"
  public readonly REGIONS = {
    North_America: {
      name: 'North_America', countries: [
        { name: 'United States', slug: '/radios/country/United_States' },
        { name: 'Canada', slug: '/radios/country/Canada' },
        { name: 'Mexico', slug: '/radios/country/Mexico' },
        { name: 'Lesser Antilles, France', slug: '/radios/country/Lesser_Antilles' },
        { name: 'Saint Vincent and the Grenadines', slug: '/radios/country/Saint_Vincent_and_the_Grenadines' }
      ]
    },
    Central_America: {
      name: 'Central_America', countries: [
        { name: 'Anguilla', slug: '/radios/country/Anguilla' },
        { name: 'Antigua and Barbuda', slug: '/radios/country/Antigua_and_Barbuda' },
        { name: 'Aruba', slug: '/radios/country/Aruba' },
        { name: 'Bahamas', slug: '/radios/country/Bahamas' },
        { name: 'Barbados', slug: '/radios/country/Barbados' },
        { name: 'Belize', slug: '/radios/country/Belize' },
        { name: 'Bermuda', slug: '/radios/country/Bermuda' },
        { name: 'Cayman Islands', slug: '/radios/country/Cayman_Islands' },
        { name: 'Costa Rica', slug: '/radios/country/' },
        { name: 'Cuba', slug: '/radios/country/Cuba' },
        { name: 'Dominica', slug: '/radios/country/Dominica' },
        { name: 'Dominican Republic', slug: '/radios/country/Dominican_Republic' },
        { name: 'El Salvador', slug: '/radios/country/El_Salvador' },
        { name: 'Grenada', slug: '/radios/country/Grenada' },
        { name: 'Guadeloupe', slug: '/radios/country/Guadeloupe' },
        { name: 'Guatemala', slug: '/radios/country/Guatemala' },
        { name: 'Haiti', slug: '/radios/country/Haiti' },
        { name: 'Honduras', slug: '/radios/country/Honduras' },
        { name: 'Jamaica', slug: '/radios/country/Jamaica' },
        { name: 'Montserrat', slug: '/radios/country/Montserrat' },
        { name: 'Netherlands Antilles', slug: '/radios/country/Netherlands_Antilles' },
        { name: 'Nicaragua', slug: '/radios/country/Nicaragua' },
        { name: 'Panama', slug: '/radios/country/Panama' },
        { name: 'Puerto Rico', slug: '/radios/country/Puerto_Rico' },
        { name: 'Saint Kitts and Nevis', slug: '/radios/country/Saint_Kitts_and_Nevis' },
        { name: 'Saint Lucia', slug: '/radios/country/Saint_Lucia' },
        { name: 'Sint Maarten', slug: '/radios/country/Sint_Maarten' },
        { name: 'Trinidad and Tobago', slug: '/radios/country/Trinidad_and_Tobago' },
        { name: 'Virgin Islands (US)', slug: '/radios/country/Virgin_Islands_US' }
      ]
    },
    South_America: {
      name: 'South_America', countries: [
        { name: 'Argentina', slug: '/radios/country/Argentina' },
        { name: 'Bolivia', slug: '/radios/country/Bolivia' },
        { name: 'Brazil', slug: '/radios/country/Brazil' },
        { name: 'Chile', slug: '/radios/country/Chile' },
        { name: 'Colombia', slug: '/radios/country/Colombia' },
        { name: 'Ecuador', slug: '/radios/country/Ecuador' },
        { name: 'Falkland Islands', slug: '/radios/country/Falkland_Islands' },
        { name: 'Guyana', slug: '/radios/country/Guyana' },
        { name: 'Paraguay', slug: '/radios/country/Paraguay' },
        { name: 'Peru', slug: '/radios/country/Peru' },
        { name: 'Suriname', slug: '/radios/country/Suriname' },
        { name: 'Uruguay', slug: '/radios/country/Uruguay' },
        { name: 'Venezuela', slug: '/radios/country/Venezuela' }
      ]
    },
    Europe: {
      name: 'Europe', countries: [
        { name: 'Albania', slug: '/radios/country/Albania' },
        { name: 'Andorra', slug: '/radios/country/Andorra' },
        { name: 'Austria', slug: '/radios/country/Austria' },
        { name: 'Belarus', slug: '/radios/country/Belarus' },
        { name: 'Belgium', slug: '/radios/country/Belgium' },
        { name: 'Bosnia and Herzegovina', slug: '/radios/country/Bosnia_and_Herzegovina' },
        { name: 'Bulgaria', slug: '/radios/country/Bulgaria' },
        { name: 'Croatia', slug: '/radios/country/Croatia' },
        { name: 'Cyprus', slug: '/radios/country/Cyprus' },
        { name: 'Czech Republic', slug: '/radios/country/Czech' },
        { name: 'Denmark', slug: '/radios/country/Denmark' },
        { name: 'Estonia', slug: '/radios/country/Estonia' },
        { name: 'Faroe Islands, Denmark', slug: '/radios/country/Faroe_Islands' },
        { name: 'Finland', slug: '/radios/country/Finland' },
        { name: 'France', slug: '/radios/country/France' },
        { name: 'Germany', slug: '/radios/country/Germany' },
        { name: 'Greece', slug: '/radios/country/Greece' },
        { name: 'Guernsey, United Kingdom', slug: '/radios/country/Guernsey' },
        { name: 'Hungary', slug: '/radios/country/Hungary' },
        { name: 'Iceland', slug: '/radios/country/Iceland' },
        { name: 'Ireland', slug: '/radios/country/Ireland' },
        { name: 'Italy', slug: '/radios/country/Italy' },
        { name: 'Kosovo', slug: '/radios/country/Kosovo' },
        { name: 'Latvia', slug: '/radios/country/Latvia' },
        { name: 'Liechtenstein', slug: '/radios/country/Liechtenstein' },
        { name: 'Lithuania', slug: '/radios/country/Lithuania' },
        { name: 'Luxembourg', slug: '/radios/country/Luxembourg' },
        { name: 'Macedonia', slug: '/radios/country/Macedonia' },
        { name: 'Malta', slug: '/radios/country/Malta' },
        { name: 'Moldova', slug: '/radios/country/Moldova' },
        { name: 'Monaco', slug: '/radios/country/Monaco' },
        { name: 'Montenegro', slug: '/radios/country/Montenegro' },
        { name: 'Netherlands', slug: '/radios/country/Netherlands' },
        { name: 'Norway', slug: '/radios/country/Norway' },
        { name: 'Poland', slug: '/radios/country/Poland' },
        { name: 'Portugal', slug: '/radios/country/Portugal' },
        { name: 'Republic of San Marino', slug: '/radios/country/San_Marino' },
        { name: 'Romania', slug: '/radios/country/Romania' },
        { name: 'Serbia', slug: '/radios/country/Serbia' },
        { name: 'Slovakia', slug: '/radios/country/Slovakia' },
        { name: 'Slovenia', slug: '/radios/country/Slovenia' },
        { name: 'Spain', slug: '/radios/country/Spain' },
        { name: 'Sweden', slug: '/radios/country/Sweden' },
        { name: 'Switzerland', slug: '/radios/country/Switzerland' },
        { name: 'Turkey', slug: '/radios/country/Turkey' },
        { name: 'Ukraine', slug: '/radios/country/Ukraine' },
        { name: 'United Kingdom', slug: '/radios/country/United_Kingdom' },
        { name: 'Vatican', slug: '/radios/country/Vatican' },

      ]
    },
    Africa: {
      name: 'Africa', countries: [
        { name: 'Algeria', slug: '/radios/country/Algeria' },
        { name: 'Angola', slug: '/radios/country/Angola' },
        { name: 'Benin', slug: '/radios/country/Benin' },
        { name: 'Botswana', slug: '/radios/country/Botswana' },
        { name: 'Burkina Faso', slug: '/radios/country/Burkina' },
        { name: 'Burundi', slug: '/radios/country/Burundi' },
        { name: 'Cameroon', slug: '/radios/country/Cameroon' },
        { name: 'Cape Verde', slug: '/radios/country/Cape' },
        { name: 'Central African Republic', slug: '/radios/country/Central_Africa_Republic' },
        { name: 'Chad', slug: '/radios/country/Chad' },
        { name: 'Congo', slug: '/radios/country/Congo' },
        { name: 'Djibouti', slug: '/radios/country/Djibouti' },
        { name: 'DR Congo', slug: '/radios/country/DR' },
        { name: 'Egypt', slug: '/radios/country/Egypt' },
        { name: 'Equatorial Guinea', slug: '/radios/country/Equatorial' },
        { name: 'Eritrea', slug: '/radios/country/Eritrea' },
        { name: 'Ethiopia', slug: '/radios/country/Ethiopia' },
        { name: 'Gabon', slug: '/radios/country/Gabon' },
        { name: 'Gambia (The)', slug: '/radios/country/Gambia_The' },
        { name: 'Ghana', slug: '/radios/country/Ghana' },
        { name: 'Guinea', slug: '/radios/country/Guinea' },
        { name: 'Guinea-Bissau', slug: '/radios/country/Guinea_Bissau' },
        { name: 'Ivory Coast', slug: '/radios/country/Ivory_Coast' },
        { name: 'Kenya', slug: '/radios/country/Kenya' },
        { name: 'Lesotho', slug: '/radios/country/Lesotho' },
        { name: 'Liberia', slug: '/radios/country/Liberia' },
        { name: 'Libya', slug: '/radios/country/Libya' },
        { name: 'Madagascar', slug: '/radios/country/Madagascar' },
        { name: 'Malawi', slug: '/radios/country/Malawi' },
        { name: 'Mali', slug: '/radios/country/Mali' },
        { name: 'Mauritania', slug: '/radios/country/Mauritania' },
        { name: 'Mauritius', slug: '/radios/country/Mauritius' },
        { name: 'Morocco', slug: '/radios/country/Morocco' },
        { name: 'Mozambique', slug: '/radios/country/Mozambique' },
        { name: 'Namibia', slug: '/radios/country/Namibia' },
        { name: 'Nigeria', slug: '/radios/country/Nigeria' },
        { name: 'Rwanda', slug: '/radios/country/Rwanda' },
        { name: 'São Tomé and Príncipe', slug: '/radios/country/Sao_Tome_and_Principe' },
        { name: 'Senegal', slug: '/radios/country/Senegal' },
        { name: 'Seychelles', slug: '/radios/country/Seychelles' },
        { name: 'Sierra Leone', slug: '/radios/country/Sierra_Leone' },
        { name: 'Somalia', slug: '/radios/country/Somalia' },
        { name: 'South Africa', slug: '/radios/country/South_Africa' },
        { name: 'Sudan', slug: '/radios/country/Sudan' },
        { name: 'Swaziland', slug: '/radios/country/Swaziland' },
        { name: 'Tanzania', slug: '/radios/country/Tanzania' },
        { name: 'Togo', slug: '/radios/country/Togo' },
        { name: 'Tunisia', slug: '/radios/country/Tunisia' },
        { name: 'Uganda', slug: '/radios/country/Uganda' },
        { name: 'Western Sahara', slug: '/radios/country/Western_Sahara' },
        { name: 'Zambia', slug: '/radios/country/Zambia' },
        { name: 'Zimbabwe', slug: '/radios/country/Zimbabwe' },
      ]
    },
    Asia: {
      name: 'Asia', countries: [
        { name: 'Afghanistan', slug: '/radios/country/Afghanistan' },
        { name: 'Armenia', slug: '/radios/country/Armenia' },
        { name: 'Azerbaijan', slug: '/radios/country/Azerbaijan' },
        { name: 'Bahrain', slug: '/radios/country/Bahrain' },
        { name: 'Bangladesh', slug: '/radios/country/Bangladesh' },
        { name: 'Bhutan', slug: '/radios/country/Bhutan' },
        { name: 'Brunei', slug: '/radios/country/Brunei' },
        { name: 'Cambodia', slug: '/radios/country/Cambodia' },
        { name: 'China', slug: '/radios/country/China' },
        { name: 'East Timor', slug: '/radios/country/East_Timor' },
        { name: 'Georgia', slug: '/radios/country/Georgia' },
        { name: 'Hong Kong', slug: '/radios/country/Hong_Kong' },
        { name: 'India', slug: '/radios/country/India' },
        { name: 'Indonesia', slug: '/radios/country/Indonesia' },
        { name: 'Iran', slug: '/radios/country/Iran' },
        { name: 'Iraq', slug: '/radios/country/Iraq' },
        { name: 'Israel', slug: '/radios/country/Israel' },
        { name: 'Japan', slug: '/radios/country/Japan' },
        { name: 'Jordan', slug: '/radios/country/Jordan' },
        { name: 'Kazakhstan', slug: '/radios/country/Kazakhstan' },
        { name: 'Kuwait', slug: '/radios/country/Kuwait' },
        { name: 'Kyrgyzstan', slug: '/radios/country/Kyrgyzstan' },
        { name: 'Laos', slug: '/radios/country/Laos' },
        { name: 'Lebanon', slug: '/radios/country/Lebanon' },
        { name: 'Malaysia', slug: '/radios/country/Malaysia' },
        { name: 'Maldives', slug: '/radios/country/Maldives' },
        { name: 'Mongolia', slug: '/radios/country/Mongolia' },
        { name: 'Myanmar', slug: '/radios/country/Myanmar' },
        { name: 'Nepal', slug: '/radios/country/Nepal' },
        { name: 'North Korea', slug: '/radios/country/North' },
        { name: 'Oman', slug: '/radios/country/Oman' },
        { name: 'Pakistan', slug: '/radios/country/Pakistan' },
        { name: 'Palau', slug: '/radios/country/Palau' },
        { name: 'Palestine', slug: '/radios/country/Palestine' },
        { name: 'Papua New Guinea', slug: '/radios/country/Papua_New_Guinea' },
        { name: 'Philippines', slug: '/radios/country/Philippines' },
        { name: 'Qatar', slug: '/radios/country/Qatar' },
        { name: 'Russia', slug: '/radios/country/Russia' },
        { name: 'Saudi Arabia', slug: '/radios/country/Saudi_Arabia' },
        { name: 'Singapore', slug: '/radios/country/Singapore' },
        { name: 'South Korea', slug: '/radios/country/South_Korea' },
        { name: 'Sri Lanka', slug: '/radios/country/Sri_Lanka' },
        { name: 'Syria', slug: '/radios/country/Syria' },
        { name: 'Taiwan', slug: '/radios/country/Taiwan' },
        { name: 'Tajikistan', slug: '/radios/country/Tajikistan' },
        { name: 'Thailand', slug: '/radios/country/Thailand' },
        { name: 'United Arab Emirates', slug: '/radios/country/United_Arab_Emirates' },
        { name: 'Uzbekistan', slug: '/radios/country/Uzbekistan' },
        { name: 'Vietnam', slug: '/radios/country/Vietnam' },
        { name: 'Yemen', slug: '/radios/country/Yemen' },
      ]
    },
    Oceania: {
      name: 'Oceania', countries: [
        { name: 'American Samoa', slug: '/radios/country/American_Samoa' },
        { name: 'Australia', slug: '/radios/country/Australia' },
        { name: 'Cook Islands', slug: '/radios/country/Cook_Islands' },
        { name: 'Fiji', slug: '/radios/country/Fiji' },
        { name: 'French Polynesia', slug: '/radios/country/French_Polynesia' },
        { name: 'French West Indies', slug: '/radios/country/French_West_Indies' },
        { name: 'Guam', slug: '/radios/country/Guam' },
        { name: 'Kiribati', slug: '/radios/country/Kiribati' },
        { name: 'Micronesia', slug: '/radios/country/Micronesia' },
        { name: 'Nauru', slug: '/radios/country/Nauru' },
        { name: 'New Zealand', slug: '/radios/country/New_Zealand' },
        { name: 'Niue', slug: '/radios/country/Niue' },
        { name: 'Northern Mariana Islands', slug: '/radios/country/Northern_Mariana_Islands' },
        { name: 'Solomon Islands', slug: '/radios/country/Solomon_Islands' },
        { name: 'Tonga', slug: '/radios/country/Tonga' },
        { name: 'Tuvalu', slug: '/radios/country/Tuvalu' },
        { name: 'Vanuatu', slug: '/radios/country/Vanuatu' },
      ]
    }
  }

  private domCache: cheerio.Root | null = null

  /**
  * Obtains the DOM of the Streema website and caches it
  * @returns {Promise<cheerio.Root>} Cheerio root object
  */
  private async obtainCachedDOM(): Promise<cheerio.Root> {
    if (this.domCache) {
      return this.domCache
    }

    const result = await axios.get(`${this.BASE_URL}/radios`)
    this.domCache = cheerio.load(result.data)
    return this.domCache
  }

  /**
   * Obtains the DOM of any given URL
   * @param {string} url URL to obtain the DOM from
   * @returns {Promise<cheerio.Root>} Cheerio root object
   */
  private async obtainDOM(url: string): Promise<cheerio.Root> {
    const result = await axios.get(url)
    return cheerio.load(result.data)
  }

  /**
   * Returns a list of regions
   * @returns {Promise<Region[]>} List of regions
   */
  public async getRegions(): Promise<Region[]> {
    const $ = await this.obtainCachedDOM()
    const regions: Region[] = []

    $('.geo-list ul:first li').each((index, element) => {
      const link = $(element).find('a')
      const name = link.text().trim()
      const slug = link.attr('href')
      regions.push({ name, slug })
    })

    return regions
  }

  /**
   * Returns a list of featured countries
   * @returns {Promise<Country[]>} List of featured countries
   */
  public async featuredCountries(): Promise<Country[]> {
    const $ = await this.obtainCachedDOM()
    const countries: Country[] = []
    $('.geo-list ul').eq(1).find('li a').each((index, element) => {
      const name = $(element).text().trim()
      const slug = $(element).attr('href')
      countries.push({ name, slug })
    })

    return countries
  }

  /**
   * Returns a list of featured cities
   * @returns {Promise<City[]>} List of featured cities
   */
  public async featuredCities(): Promise<City[]> {
    const $ = await this.obtainCachedDOM()
    const cities: City[] = []
    $('.geo-list ul').eq(2).find('li a').each((index, element) => {
      const name = $(element).text().trim()
      const slug = $(element).attr('href')
      cities.push({ name, slug })
    })

    return cities
  }

  /**
   * Returns a list of featured genres
   * @returns {Promise<Genre[]>} List of featured genres
   */
  public async getGenres(): Promise<Genre[]> {
    const $ = await this.obtainCachedDOM()
    const genres: Genre[] = []
    $('.geo-list ul.column').each((index, element) => {
      $(element).find('li a').each((index, element) => {
        const name = $(element).text().trim()
        const slug = $(element).attr('href')
        genres.push({ name, slug })
      })
    })

    return genres
  }

  /**
   * Obtains a list of stations by url slug
   * @param slug URL slug to look up stations by
   * @param callback Optional callback function
   * @returns Promise<RadioStation[]>
   */
  public async getStationsBySlug(slug: string, callback?: CallbackFunction): Promise<RadioStation[]> {
    // if (!slug.match(/^\/radios\/[\w\s]+$/)) {
    //   throw new Error('Invalid slug')
    // }

    if (!slug.startsWith('/')) {
      slug = `/${slug}`
    }

    let nextPageLink: string | undefined = ''
    const stations: RadioStation[] = []
    while (nextPageLink !== undefined) {
      const $ = await this.obtainDOM(this.BASE_URL + slug + (nextPageLink ? `?${nextPageLink.split('?')[1]}` : ''))
      const stationsDOM = $('.items-list .item')
      nextPageLink = $("a.next").attr("href")
      console.log('nextPageLink:', nextPageLink)

      for (let index = 0; index < stationsDOM.length; index++) {
        const element = stationsDOM[index]
        const name = $(element).find('h5 a').text().trim()
        console.log('name:', name)
        const band = $(element).find('p.band-dial').text().trim()
        const genre = $(element).find('.item-extra .item-info .genre').text().split('\n').map((genre: string) => genre.trim()).filter((genre: string) => genre !== '')
        const location = $(element).find('.item-extra .item-info .location').text().split('\n').map((location: string) => location.trim()).filter((location: string) => location !== '' && location !== ' ').join(',').replace(/,{2,}/g, ',')
        const url = $(element).attr('data-profile-url')
        const thumbnail = $(element).find('.item-logo img')

        try {
          const streamURL = await this.obtainStreamURL(url)
          const img = await this.obtainStationImage(url)
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
            })
            console.info(`Station ${name} has been added to the list`)
            console.log('stations.length:', stations.length)

            if (stations.length == 100 && callback) {
              callback(stations)
              stations.length = 0 // empty & reset our array
            }
          }
        } catch (e) {
          console.error(e)
          console.error(`Station ${name} has no stream URL`)
          console.error('url:', url)
        }
      }
    }

    // Add any remaining stations to the list
    if (stations.length > 0 && callback) {
      callback(stations)
    }

    return stations
  }

  /**
   * Takes a station URL and obtains stream URL then checks whether the stream is working or not
   * @param {string} url Station URL
   * @returns {Promise<string | undefined>}
   */
  private async obtainStreamURL(url: string | undefined): Promise<string | undefined> {
    if (!url) return undefined

    const transformedUrl = url.replace('/radios/', '/radios/play/')
    const fetchUrl = this.BASE_URL + transformedUrl

    try {
      const $ = await this.obtainDOM(fetchUrl)
      const streamURL = $('#source-stream').attr('data-src')
      console.info(`Checking stream ${streamURL}`)

      if (streamURL) {
        // check if the stream is working and buffering content
        // if it's not working, return undefined
        return new Promise((resolve, reject) => {
          const protocol = streamURL.startsWith('https') ? followRedirects.https : followRedirects.http
          const request = protocol.get(streamURL, (response) => {
            response.on('data', () => {
              request.destroy()
              resolve(streamURL)
            })

            response.on('end', () => reject('Stream ended without receiving any data'))
            response.on('error', (err) => reject(err))
          }).on('error', (err) => reject(err))

          request.setTimeout(20_000, () => {
            request.destroy()
            reject('Stream connection timed out')
          })
        })
      } else return undefined
    } catch (e) {
      console.error(e)
      return undefined
    }
  }

  private async obtainStationImage(url: string | undefined): Promise<Image | undefined> {
    if (!url) return undefined

    const transformedUrl = url.replace('/radios/', '/radios/play/')
    const fetchUrl = `${this.BASE_URL}${transformedUrl}`

    try {
      const $ = await this.obtainDOM(fetchUrl)
      const img = $('.song-image img')
      const src = img.attr('src')
      const alt = img.attr('alt')
      const width = img.attr('width')
      const height = img.attr('height')

      return {
        url: src,
        alt,
        width,
        height
      }
    } catch (e) {
      console.error(e)
      return undefined
    }
  }
}
