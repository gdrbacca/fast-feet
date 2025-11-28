import { Entity } from "@/core/entities/entity"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"

export interface RecipientProps {
    name: string
    address: string
    number: string
}

export class Recipient extends Entity<RecipientProps> {
    get name() {
        return this.props.name
    }

    get address() {
        return this.props.address
    }

    get number() {
        return this.props.number
    }

    set name(nameNew: string) {
        this.props.name = nameNew
    }

    set address(addressNew: string) {
        this.props.address = addressNew
    }

    set number(number: string) {
        this.props.number = number
    }

    static create(
        props: RecipientProps,
        id?: UniqueEntityID
    ) {
        const recipient = new Recipient(
            {
                ...props
            },
            id
        )

        return recipient
    }
}