const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()
const queryString = require('query-string')

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares)

// Add custom routes before JSON Server router
server.get('/echo', (req, res) => {
  res.jsonp(req.query)
})

// To handle POST, PUT and PATCH you need to use a body-parser
// You can use the one used by JSON Server
server.use(jsonServer.bodyParser)
server.use((req, res, next) => {
  if (req.method === 'POST') {
    req.body.createdAt = Date.now()
    req.body.updatedAt = Date.now()
  } else if (req.method === 'PATCH') {
    req.body.updatedAt = Date.now()
  }
  // Continue to JSON Server router
  next()
})
//customize response
router.render = (req, res) => {
  const headers = res.getHeaders()
  const totalRows = headers['x-total-count']
  if (req.method === 'GET' && totalRows) {
    const params = queryString.parse(req._parsedUrl.search)
    const result = {
      data: res.locals.data,
      pagination: {
        _page: Number.parseInt(params._page) || 1,
        _limit: Number.parseInt(params._limit) || 10,
        _totalRows: Number.parseInt(totalRows),
      },
    }
    return res.jsonp(result)
  }
  res.jsonp(res.locals.data)
}

// Use default router
server.use('/api', router)
server.listen(4000, () => {
  console.log('JSON Server is running')
})
