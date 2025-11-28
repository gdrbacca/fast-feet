import { User } from "@/domain/fast_feet_main/enterprise/entities/user";

export class GetUserPresenter {

    static toHttpArray(raw: User[]) {
        return raw.map(user => {
            return {
                id: user.id.toString(),
                name: user.name,
                cpf: user.cpf,
                role: user.role
            }
        })
    }

    static toHttp(raw: User) {
        return {
            id: raw.id.toString(),
            name: raw.name,
            cpf: raw.cpf,
            password: raw.password,
            role: raw.role
        }
    }

}