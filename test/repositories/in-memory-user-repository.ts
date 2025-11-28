import { UserRepository } from "@/domain/fast_feet_main/application/repository/user-repository"
import { User } from "@/domain/fast_feet_main/enterprise/entities/user"

export class InMemoryUserRepository implements UserRepository {
  
  
  public items: User[] = []

  async findByCpf(cpf: string): Promise<User | null> {
    const user = this.items.find((user) => {
      return user.cpf === cpf
    })

    if (!user) return null

    return user
  }

  async findById(id: string): Promise<User | null> {
    const user = this.items.find(user => {
      return user.id.toString() === id
    })

    if (!user)
      return null

    return user
  }

  async create(user: User): Promise<void> {
    this.items.push(user)

  }

  async findAll(): Promise<User[]> {
    return this.items.filter(user => {
      return user.role === 'DELIVERYMAN'
    })
  }

  async edit(user_id: string, user: User): Promise<User | null> {
    const userIndex = this.items.findIndex(user => user.id.toString() === user_id)

    if (userIndex === -1) {
      return null
    }

    this.items[userIndex] = user

    return this.items[userIndex]
  }

  async delete(user_id: string): Promise<void> {
    const new_items = this.items.filter(item => {
      return item.id.toString() !== user_id
    })

    this.items = new_items 
  }

}
