import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Optional } from "@/core/types";

interface NotificationProps {
    recipientId: UniqueEntityID
    title: string
    content: string
    createdAt: Date 
    readtAt?: Date | null
}

export class Notification extends Entity<NotificationProps> {

    get recipientId() {
        return this.props.recipientId
    }

    get title() {
        return this.props.title
    }

    get content() {
        return this.props.content
    }

    get createdAt() {
        return this.props.createdAt
    }

    get readTat() {
        return this.props.readtAt
    }

    read() {
        this.props.readtAt = new Date()
    } 

    static create(
        props: Optional<NotificationProps, 'createdAt'>,
        id?: UniqueEntityID
    ) {
        const notification = new Notification({
            createdAt: props.createdAt ?? new Date(),
            ...props
        }, id)

        return notification
    }
}