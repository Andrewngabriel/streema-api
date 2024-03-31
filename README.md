# streema-api

## Description

Unofficial API for Streema.com using web parsing

## Installation

```bash
npm install streema-api
```

## Usage

```javascript
const StreemaAPI = require('streema-api')

const streemaApi = new StreemaApi()
const genres = await streemaApi.getGenres()
const featuredCountries = await streemaApi.featuredCountries()
const featuredCities = await streemaApi.featuredCities()
const stations = await streemaApi.getStationsBySlug('/radios/country/Egypt')
```

### Available Methods / Attributes

- `REGIONS`
- `getRegions()`
- `featuredCountries()`
- `featuresCities()`
- `getGenres()`
- `getStationBySlug()`
