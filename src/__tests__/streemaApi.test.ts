import StreemaAPI from '../'

describe('Streema API', () => {
  const api = new StreemaAPI()

  test('Get regions', async () => {
    const regions = await api.getRegions()
    expect(regions.length).toBe(7)
    expect(regions[0].name).toBe('North America')
    expect(regions[0]).toHaveProperty('name')
    expect(regions[0]).toHaveProperty('slug')
  })

  test('Get featured countries', async () => {
    const countries = await api.featuredCountries()
    expect(countries.length).toBe(20)
    expect(countries[0].name).toBe('Antigua and Barbuda')
    expect(countries[0]).toHaveProperty('name')
    expect(countries[0]).toHaveProperty('slug')
  })

  test('Get featured cities', async () => {
    const cities = await api.featuredCities()
    expect(cities.length).toBe(18)
    expect(cities[0].name).toBe('Atlanta')
    expect(cities[0]).toHaveProperty('name')
    expect(cities[0]).toHaveProperty('slug')
  })

  test('Get featured genres', async () => {
    const genres = await api.getGenres()
    expect(genres.length).toBe(26)
    expect(genres[0].name).toBe('African')
    expect(genres[0]).toHaveProperty('name')
    expect(genres[0]).toHaveProperty('slug')
  })

  // test('Get stations by slug using invalid input', async () => {
  //   try {
  //     await api.getStationsBySlug('sss')
  //   } catch (error) {
  //     console.log(error.toString())
  //     expect(error?.message).toBe('Invalid slug')
  //   }
  // })

  // test('Get stations by slug - single page', async () => {
  //   const stations = await api.getStationsBySlug('/radios/Andorra_la_Vella')
  //   expect(stations.length).toBe(8)


  //   // expect(stations.length).toBe(10)
  //   // expect(stations[0].name).toBe('KQED Radio')
  //   // expect(stations[0]).toHaveProperty('name')
  //   // expect(stations[0]).toHaveProperty('url')
  //   // expect(stations[0]).toHaveProperty('streamURL')
  //   // expect(stations[0]).toHaveProperty('desc')
  //   // expect(stations[0]).toHaveProperty('tags')
  //   // expect(stations[0]).toHaveProperty('website')
  //   // expect(stations[0]).toHaveProperty('links')
  //   // expect(stations[0]).toHaveProperty('source')
  //   // expect(stations[0]).toHaveProperty('uuid')
  //   // expect(stations[0]).toHaveProperty('img')
  // }, 40_000)
})
