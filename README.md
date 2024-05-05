# streema-api

## Description

Unofficial API for Streema.com using web parsing

## Installation

```bash
npm install streema-api
```

## Usage

```javascript
const StreemaAPI = require('streema-api').default

const streemaApi = new StreemaApi()
const genres = await streemaApi.getGenres()
const featuredCountries = await streemaApi.featuredCountries()
const featuredCities = await streemaApi.featuredCities()
const stations = await streemaApi.getStationsBySlug('/radios/country/Egypt')
const stations = await streemaApi.getStationsBySlug('/radios/country/Egypt', (stations) => {
  // callback function
  // ex. store to db
})
```

### Available Methods / Attributes

- `REGIONS`
- `getRegions()`
- `featuredCountries()`
- `featuresCities()`
- `getGenres()`
- `getStationBySlug()`
