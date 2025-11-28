import { Entity } from "@/core/entities/entity"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"

interface AttachmentProps {
    url: string
    title: string
}

export class Attachment extends Entity<AttachmentProps> {
    get url() {
        return this.props.url
    }

    get title() {
        return this.props.title
    }

    set url(link: string) {
        this.props.url = link
    }

    static create(
        props: AttachmentProps,
        id?: UniqueEntityID
    ) {
        const attachment = new Attachment(
            {
                ...props,
            },
            id
        )

        return attachment
    }

}