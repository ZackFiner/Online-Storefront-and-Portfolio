const {getConnection} = require('typeorm');
const {Item, ItemPrice, Order, Address} = require('../models');

retrieveOrCreateAddress = async (queryrunner, userdata, addressdata) => {
    const {id, street_address, city, state_code, zip} = addressdata;

    if (id) {
        const r_address = await queryrunner.manager.createQueryBuilder()
                                .select("address")
                                .from(Address, "address")
                                .where("address.id = :adr_id", {adr_id: address.id})
                                .getOne();
        return r_address;
    } else {
        const result = await runner.manager.insert(Address, {
            user_id : userdata._id,
            street_address : street_address,
            city : city,
            state_code : state_code,
            zip : zip,
        });
        return {
            ...addressdata,
            id: result.identifiers[0].id
        }
    }
}

getItemRecords = async (queryrunner, item_ids) => {
    return await queryrunner.manager
    .createQueryBuilder()
    .select("item")
    .from(Item, "item")
    .leftJoinAndMapOne("item.price", ItemPrice, "price", "price.id = item.id")
    .where("item.item_desc_id IN (:...ids) AND item.qty > 0", {ids: item_ids})
    .getMany();
}

getOrderCost = async (queryrunner, item_ids) => {
    const rawcost = await queryrunner.manager
    .createQueryBuilder()
    .select("SUM(price)", "cost")
    .from(Item, "item")
    .leftJoinAndMapOne("item.price", ItemPrice, "price", "price.id = item.id")
    .where("item.item_desc_id IN (:...ids) AND item.qty > 0", {ids: item_ids})
    .getRawOne();
    
    return rawcost.cost;
}

module.exports = {retrieveOrCreateAddress, getItemRecords, getOrderCost};