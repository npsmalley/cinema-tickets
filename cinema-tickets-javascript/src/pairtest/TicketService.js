import TicketTypeRequest from './lib/TicketTypeRequest';
import InvalidPurchaseException from './lib/InvalidPurchaseException';

export default class TicketService {
  /**
   * Should only have private methods other than the one below.
   */
  purchaseTickets(accountId, ...ticketTypeRequests) {
    const totalAmount = this.calculateTotalPrice(...ticketTypeRequests);
    this.makePayment(accountId, totalAmount);

    const seatCount = this.calculateSeatCount(...ticketTypeRequests);
    this.reserveSeats(seatCount);
  }

  calculateTotalPrice(...ticketTypeRequests) {
    let totalPrice = 0;

    for (const request of ticketTypeRequests) {
      const type = request.getTicketType();
      const noOfTickets = request.getNoOfTickets();

      switch (type) {
        case 'ADULT':
          totalPrice += 20 * noOfTickets;
          break;
        case 'CHILD':
          totalPrice += 10 * noOfTickets;
          break;
        // No price for INFANT as they are free
        default:
          break;
      }
    }

    return totalPrice;
  }

  makePayment(accountId, amount) {
    // Payment logic here
  }

  calculateSeatCount(...ticketTypeRequests) {
    let seatCount = 0;

    for (const request of ticketTypeRequests) {
      const type = request.getTicketType();
      const noOfTickets = request.getNoOfTickets();

      if (type !== 'INFANT') {
        seatCount += noOfTickets;
      }
    }

    return seatCount;
  }

  reserveSeats(seatCount) {
    // Seat reservation logic here
  }
}