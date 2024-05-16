import EventHandlerInterface from "../../../@shared/event/event-handler.interface";
import CustumerCreatedEvent from "../custumer-created.event";

export default class SendConsoleLog1Handler implements EventHandlerInterface<CustumerCreatedEvent> {
    handle(event: CustumerCreatedEvent): void {
        console.log(`Esse é o primeiro console.log do evento: CustomerCreated`)
    }
}