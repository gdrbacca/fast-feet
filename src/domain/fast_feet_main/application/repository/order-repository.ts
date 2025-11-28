import { Order } from "../../enterprise/entities/order";

export abstract class OrderRepository {
    abstract create(order: Order): Promise<void>
    abstract findById(id_order: string): Promise<Order | null>
    abstract findMany(): Promise<Order[]>
    abstract edit(id_order: string, order: Order): Promise<Order | null>
    abstract changeStatus(id_order: string, id_user: string, order: Order): Promise<Order | null>
    abstract delete(id_order: string): Promise<void>
    abstract findOrdersNearby(latitude: number, longitude: number): Promise<Order[]>
}