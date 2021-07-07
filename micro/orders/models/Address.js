const {EntitySchema} = require("typeorm")

class Address {
    constructor(id, user_id, street_address, unit_number, city, state_code, zip) {
        this.id = id;
        this.user_id = user_id;
        this.street_address = street_address;
        this.city = city;
        this.state_code = state_code;
        this.zip = zip;
    }
}

module.exports = new EntitySchema({
    name: "Address",
    target: Address,
    tableName: "addresses",
    columns:{
        id: {
            primary: true,
            generated: true,
            type: "int",
        },
        user_id: {
            type: String,
            length: 24,
            nullable: false,
        },
        street_address: {
            type: String,
            length: 64,
            nullable: false,
        },
        city: {
            type: String,
            length: 64,
            nullable: false,
        },
        state_code: {
            type: String,
            length: 2,
            nullable: false,
        },
        zip: {
            type: "int",
            nullable: false,
        }
    }
})