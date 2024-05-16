import EventHandlerInterface from "../../../@shared/event/event-handler.interface";
import CustumerCreatedEvent from "../custumer-created.event";

export default class SendConsoleLog2Handler implements EventHandlerInterface<CustumerCreatedEvent> {
    handle(event: CustumerCreatedEvent): void {
        console.log(`Esse é o segundo console.log do evento: CustomerCreated`)
    }
}