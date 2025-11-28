export class NotSameDeliveryman extends Error {
    constructor() {
        super('Only the deliveryman who picked up the order can deliver it.')
    }
}