import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

export interface UserProps {
    name: string
    cpf: string
    password: string
    role: 'ADMIN' | 'DELIVERYMAN'

}

export class User extends Entity<UserProps> {
    get name() {
        return this.props.name
    }

    get cpf() {
        return this.props.cpf
    }

    get password() {
        return this.props.password
    }

    get role() {
        return this.props.role
    }

    get user_short() {
        return {
            id_user: this.id.toString(),
            name: this.props.name,
            cpf: this.props.cpf,
            password: this.props.password,
            role: this.props.role
        }
    }

    
    set name(new_name: string) {
        this.props.name = new_name
    }
    
    set cpf(new_cpf: string) {
        this.props.cpf = new_cpf
    }

    set password(new_password: string) {
        this.props.password = new_password
    }

    set role(new_role: 'ADMIN' | 'DELIVERYMAN') {
        this.props.role = new_role
    }

    static create(
        props: UserProps,
        id?: UniqueEntityID
    ) {
        const user = new User(
            {
                ...props
            }, 
            id
        )

        return user
    }
}