var fhirVersion = 'fhir-3.0.0';

if(typeof oAuth2Server === 'object'){
  // TODO:  double check that this is needed; and that the /api/ route is correct
  JsonRoutes.Middleware.use(
    // '/api/*',
    '/fhir-3.0.0/*',
    oAuth2Server.oauthserver.authorise()   // OAUTH FLOW - A7.1
  );
}


JsonRoutes.add("post", "/fhir/MessageHeader", function (req, res, next) {
  process.env.DEBUG && console.log('POST /fhir/MessageHeader/', req.body);

  console.log("Meteor.settings.private.disableOauth", Meteor.settings.private.disableOauth);
  res.setHeader("Access-Control-Allow-Origin", "*");

  var accessTokenStr = (req.params && req.params.access_token) || (req.query && req.query.access_token);
  var accessToken = oAuth2Server.collections.accessToken.findOne({accessToken: accessTokenStr});

  if (accessToken || process.env.NOAUTH || Meteor.settings.private.disableOauth) {



    process.env.TRACE && console.log('accessToken', accessToken);
    if (accessToken) {
      process.env.TRACE && console.log('accessToken.userId', accessToken.userId);
    }
    if (typeof SiteStatistics === "object") {
      SiteStatistics.update({_id: "configuration"}, {$inc:{
        "MessageHeaders.count.read": 1 }});
    }

    if (!req.body.timestamp) {
      req.body.timestamp = new Date();
    }

    var messageHeaderId = MessageHeaders.insert(req.body);
    process.env.TRACE && console.log('messageHeaderId', messageHeaderId);

    JsonRoutes.sendResult(res, {
      code: 200,
      data: messageHeaderId
    });
  } else {
    JsonRoutes.sendResult(res, {
      code: 401
    });
  }
});


JsonRoutes.add("get", "/fhir/MessageHeader/:id", function (req, res, next) {
  process.env.DEBUG && console.log('GET /fhir/MessageHeader/' + req.params.id);
  res.setHeader("Access-Control-Allow-Origin", "*");

  var accessTokenStr = (req.params && req.params.access_token) || (req.query && req.query.access_token);
  var accessToken = oAuth2Server.collections.accessToken.findOne({accessToken: accessTokenStr});

  if (accessToken || process.env.NOAUTH || Meteor.setttings.app.disableOauth) {
    process.env.TRACE && console.log('accessToken', accessToken);
    process.env.TRACE && console.log('accessToken.userId', accessToken.userId);

    if (typeof SiteStatistics === "object") {
      SiteStatistics.update({_id: "configuration"}, {$inc:{
        "MessageHeaders.count.read": 1 }});
    }

    var id = req.params.id;
    var messageHeaderData = MessageHeaders.findOne(id);

    if (messageHeaderData) {
      delete messageHeaderData._document;
      process.env.TRACE && console.log('messageHeaderData', messageHeaderData);

      JsonRoutes.sendResult(res, {
        code: 200,
        data: messageHeaderData
      });
    } else {
      JsonRoutes.sendResult(res, {
        code: 410
      });
    }

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
    if (messageHeaderData) {
      messageHeaderData.forEach(function(patient){
        delete patient._document;
      });

      JsonRoutes.sendResult(res, {
        code: 200,
        data: messageHeaderData
      });
    } else {
      JsonRoutes.sendResult(res, {
        code: 410
      });
    }
  } else {
    JsonRoutes.sendResult(res, {
      code: 401
    });
  }
});
