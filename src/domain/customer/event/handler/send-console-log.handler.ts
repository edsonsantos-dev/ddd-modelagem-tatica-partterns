import EventHandlerInterface from "../../../@shared/event/event-handler.interface";
import ChangedAddressEvent from "../changed-address.event";

export default class SendConsoleLogHandler implements EventHandlerInterface<ChangedAddressEvent> {
    handle(event: ChangedAddressEvent): void {
        // console.log('Trocou endereço')
        console.log(`Endereço do cliente: ${event.eventData.id}, ${event.eventData.name}, alterado para: ${event.eventData.address}`)
    }
}