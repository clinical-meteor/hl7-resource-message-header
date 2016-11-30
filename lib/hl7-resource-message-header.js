
// create the object using our BaseModel
MessageHeader = BaseModel.extend();


//Assign a collection so the object knows how to perform CRUD operations
MessageHeader.prototype._collection = MessageHeaders;

// Create a persistent data store for addresses to be stored.
// HL7.Resources.Patients = new Mongo.Collection('HL7.Resources.Patients');
MessageHeaders = new Mongo.Collection('MessageHeaders');

//Add the transform to the collection since Meteor.users is pre-defined by the accounts package
MessageHeaders._transform = function (document) {
  return new MessageHeader(document);
};


if (Meteor.isClient){
  Meteor.subscribe("MessageHeaders");
}

if (Meteor.isServer){
  Meteor.publish("MessageHeaders", function (argument){
    if (this.userId) {
      return MessageHeaders.find();
    } else {
      return [];
    }
  });
}



MessageHeaderSchema = new SimpleSchema({
  "resourceType" : {
    type: String,
    defaultValue: "MessageHeader"
  },
  "timestamp" : {
    optional: true,
    type: Date
  },
  "event" : {
    optional: true,
    type: CodingSchema
  },
  "response.identifier" : {
    optional: true,
    type: String
  },
  "response.code" : {
    optional: true,
    type: String
  },
  "response.details" : {
    optional: true,
    type: ReferenceSchema
  },
  "source.name" : {
    optional: true,
    type: String
  },
  "source.software" : {
    optional: true,
    type: String
  },
  "source.version" : {
    optional: true,
    type: String
  },
  "source.contact" : {
    optional: true,
    blackbox: true,
    type: ContactPointSchema
  },
  "source.endpoint" : {
    optional: true,
    type: String
  },
  "destination.$.name" : {
    optional: true,
    type: String
  },
  "destination.$.target" : {
    optional: true,
    type: ReferenceSchema
  },
  "destination.$.endpoint" : {
    optional: true,
    type: String
  },
  "enterer" : {
    optional: true,
    type: ReferenceSchema
  },
  "author" : {
    optional: true,
    type: ReferenceSchema
  },
  "receiver" : {
    optional: true,
    type: ReferenceSchema
  },
  "responsible" : {
    optional: true,
    type: ReferenceSchema
  },
  "reason" : {
    optional: true,
    type: CodeableConceptSchema
  },
  "data" : {
    optional: true,
    blackbox: true,
    type: [ ReferenceSchema ]
  }
});

MessageHeaders.attachSchema(MessageHeaderSchema);
