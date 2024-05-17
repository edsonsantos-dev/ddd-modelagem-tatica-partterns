import SendConsoleLog1Handler from "../../customer/event/handler/send-console-log1.handler";
import SendConsoleLog2Handler from "../../customer/event/handler/send-console-log2.handler";
import SendEmailWhenProductIsCreatedHandler from "../../product/event/handler/send-email-when-product-is-created.handler";
import ProductCreatedEvent from "../../product/event/product-created.event";
import EventDispatcher from "./event-dispatcher";
import CustumerCreatedEvent from './../../customer/event/custumer-created.event';
import Address from "../../customer/value-object/address";
import SendConsoleLogHandler from "../../customer/event/handler/send-console-log.handler";
import ChangedAddressEvent from "../../customer/event/changed-address.event";
import Customer from "../../customer/entity/customer";

describe("Domain events tests", () => {
  it("should register an event handler", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();

    eventDispatcher.register("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"]
    ).toBeDefined();
    expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(
      1
    );
    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
    ).toMatchObject(eventHandler);
  });

  it("should unregister an event handler", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();

    eventDispatcher.register("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
    ).toMatchObject(eventHandler);

    eventDispatcher.unregister("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"]
    ).toBeDefined();
    expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(
      0
    );
  });

  it("should unregister all event handlers", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();

    eventDispatcher.register("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
    ).toMatchObject(eventHandler);

    eventDispatcher.unregisterAll();

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"]
    ).toBeUndefined();
  });

  it("should notify all event handlers", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();
    const spyEventHandler = jest.spyOn(eventHandler, "handle");

    eventDispatcher.register("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
    ).toMatchObject(eventHandler);

    const productCreatedEvent = new ProductCreatedEvent({
      name: "Product 1",
      description: "Product 1 description",
      price: 10.0,
    });

    // Quando o notify for executado o SendEmailWhenProductIsCreatedHandler.handle() deve ser chamado
    eventDispatcher.notify(productCreatedEvent);

    expect(spyEventHandler).toHaveBeenCalled();
  });

  it("should notify custumer created event handlers", () => {
    const eventDispatcher = new EventDispatcher();
    const sendConsoleLog1Handler = new SendConsoleLog1Handler();
    const sendConsoleLog2Handler = new SendConsoleLog2Handler();
    const spyEvent1Handler = jest.spyOn(sendConsoleLog1Handler, "handle");
    const spyEvent2Handler = jest.spyOn(sendConsoleLog2Handler, "handle");

    eventDispatcher.register("CustumerCreatedEvent", sendConsoleLog1Handler);
    eventDispatcher.register("CustumerCreatedEvent", sendConsoleLog2Handler);

    expect(
      eventDispatcher.getEventHandlers["CustumerCreatedEvent"][0]
    ).toMatchObject(sendConsoleLog1Handler);

    expect(
      eventDispatcher.getEventHandlers["CustumerCreatedEvent"][1]
    ).toMatchObject(sendConsoleLog2Handler);

    const custumerCreatedEvent = new CustumerCreatedEvent({});

    // Quando o notify for executado o SendEmailWhenProductIsCreatedHandler.handle() deve ser chamado
    eventDispatcher.notify(custumerCreatedEvent);

    expect(spyEvent1Handler).toHaveBeenCalled();
    expect(spyEvent2Handler).toHaveBeenCalled();
  });

  it("should notify changed address event handlers", () => {
    const eventDispatcher = new EventDispatcher();
    const sendConsoleLogHandler = new SendConsoleLogHandler();
    const spyEventHandler = jest.spyOn(sendConsoleLogHandler, "handle");

    const customer = new Customer("123", "Fulano da Silva");
    const address = new Address("Alguma rua 1", 1, "74999-888","Alguma cidade");
    customer.Address = address;
    customer.activate();
    const newAddress = new Address("Alguma rua 2", 2, "74000-999","Alguma cidade Nova");
    customer.changeAddress(newAddress);

    eventDispatcher.register("ChangedAddressEvent", sendConsoleLogHandler);

    expect(
      eventDispatcher.getEventHandlers["ChangedAddressEvent"][0]
    ).toMatchObject(sendConsoleLogHandler);

    const changedAddressEvent = new ChangedAddressEvent({
      id: customer.id,
      name: customer.name,
      address: customer.Address.toString()
    });

    // Quando o notify for executado o SendEmailWhenProductIsCreatedHandler.handle() deve ser chamado
    eventDispatcher.notify(changedAddressEvent);

    expect(spyEventHandler).toHaveBeenCalled();
  });
});
