import { Recipient } from "@/domain/fast_feet_main/enterprise/entities/recipient";

export class RecipientPresenter {
    static toHttpArray(recipients: Recipient[]) {
        return recipients.map(item => {
            return {
                id: item.id.toString(),
                name: item.name,
                address: item.address,
                number: item.number
            }
        })
    }
}