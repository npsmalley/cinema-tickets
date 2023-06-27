import TicketTypeRequest from './lib/TicketTypeRequest.js';
import InvalidPurchaseException from './lib/InvalidPurchaseException.js';

export default class TicketService {
  purchaseTickets(accountId, ...ticketTypeRequests) {
    this.#validateTicketPurchase(ticketTypeRequests);

    // Calculate the total amount to pay
    const totalAmountToPay = this.#calculateTotalAmount(ticketTypeRequests);

    // Make a payment request to the external payment service
    this.#makePayment(accountId, totalAmountToPay);

    // Calculate the total seats to reserve
    const totalSeatsToAllocate = this.#calculateTotalSeats(ticketTypeRequests);

    // Make a seat reservation request to the external reservation service
    this.#reserveSeat(accountId, totalSeatsToAllocate);
  }

  #validateTicketPurchase(ticketTypeRequests) {
    if (ticketTypeRequests.length === 0) {
      throw new InvalidPurchaseException('At least one ticket type request must be provided.');
    }

    for (const request of ticketTypeRequests) {
      if (!(request instanceof TicketTypeRequest)) {
        throw new InvalidPurchaseException('Invalid ticket type request.');
      }
    }
  }

  #calculateTotalAmount(ticketTypeRequests) {
    let totalAmount = 0;

    for (const request of ticketTypeRequests) {
      totalAmount += this.#getTicketPrice(request) * request.getNoOfTickets();
    }

    return totalAmount;
  }

  #getTicketPrice(request) {
    switch (request.getTicketType()) {
      case 'INFANT':
        return 0;
      case 'CHILD':
        return 10;
      case 'ADULT':
        return 20;
      default:
        throw new InvalidPurchaseException('Invalid ticket type.');
    }
  }

  #makePayment(accountId, totalAmountToPay) {
    // Make a payment request to the external payment service
    const paymentService = new TicketPaymentService();
    paymentService.makePayment(accountId, totalAmountToPay);
  }

  #calculateTotalSeats(ticketTypeRequests) {
    let totalSeats = 0;

    for (const request of ticketTypeRequests) {
      if (request.type !== 'INFANT') {
        totalSeats += request.getNoOfTickets();
      }
    }

    return totalSeats;
  }

  #reserveSeat(accountId, totalSeatsToAllocate) {
    // Make a seat reseervation request to the external reservation service
    const reservationService = new SeatReservationService();
    reservationService.reserveSeat(accountId, totalSeatsToAllocate);
  }
}