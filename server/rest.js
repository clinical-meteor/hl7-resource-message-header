
JsonRoutes.Middleware.use(
    '/api/*',
    oAuth2Server.oauthserver.authorise()   // OAUTH FLOW - A7.1
);




JsonRoutes.add("get", "/fhir/MessageHeader/:id", function (req, res, next) { process.env.DEBUG && console.log('GET /fhir/MessageHeader/' + req.params.id);
  res.setHeader("Access-Control-Allow-Origin", "*");

  var accessTokenStr = (req.params && req.params.access_token) || (req.query && req.query.access_token);
  var accessToken = oAuth2Server.collections.accessToken.findOne({accessToken: accessTokenStr});

  if (accessToken || process.env.NOAUTH) {
    process.env.TRACE && console.log('accessToken', accessToken);
    process.env.TRACE && console.log('accessToken.userId', accessToken.userId);

    if (typeof SiteStatistics === "object") {
      SiteStatistics.update({_id: "configuration"}, {$inc:{
        "MessageHeaders.count.read": 1 }});
    }

    var id = req.params.id;
    var messageHeaderData = MessageHeaders.findOne(id); delete messageHeaderData._document;
    process.env.TRACE && console.log('messageHeaderData', messageHeaderData);

    JsonRoutes.sendResult(res, {
      code: 200,
      data: messageHeaderData
    });
  } else {
    JsonRoutes.sendResult(res, {
      code: 401
    });
  }
});



JsonRoutes.add("get", "/fhir/MessageHeader", function (req, res, next) { process.env.DEBUG && console.log('GET /fhir/MessageHeader', req.query);
  res.setHeader("Access-Control-Allow-Origin", "*");

  var accessTokenStr = (req.params && req.params.access_token) || (req.query && req.query.access_token);
  var accessToken = oAuth2Server.collections.accessToken.findOne({accessToken: accessTokenStr});

  if (accessToken || process.env.NOAUTH) {
    process.env.TRACE && console.log('accessToken', accessToken);
    process.env.TRACE && console.log('accessToken.userId', accessToken.userId);

    if (typeof SiteStatistics === "object") {
      SiteStatistics.update({_id: "configuration"}, {$inc:{
        "MessageHeaders.count.search-type": 1 }});
    }

    var databaseQuery = {};

    process.env.DEBUG && console.log('databaseQuery', databaseQuery);
    process.env.DEBUG && console.log('MessageHeaders.find(id)', MessageHeaders.find(databaseQuery).fetch()); // because we're using BaseModel and a _transform() function
    // MessageHeaders returns an object instead of a pure JSON document // it stores a shadow reference of the original doc, which we're removing here
    var messageHeaderData = MessageHeaders.find(databaseQuery).fetch();
    messageHeaderData.forEach(function(patient){
      delete patient._document;
    });

    JsonRoutes.sendResult(res, {
      code: 200,
      data: messageHeaderData
    });
  } else {
    JsonRoutes.sendResult(res, {
      code: 401
    });
  }
});
