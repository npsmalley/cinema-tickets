import {jest} from '@jest/globals';
import TicketService from '../src/pairtest/TicketService';
import TicketTypeRequest from '../src/pairtest/lib/TicketTypeRequest';
import InvalidPurchaseException from '../src/pairtest/lib/InvalidPurchaseException';

describe('TicketService', () => {
  let ticketService;

  beforeEach(() => {
    ticketService = new TicketService();
  });

  it('should calculate total price correctly for valid ticket requests', () => {
    const ticketRequest1 = new TicketTypeRequest('ADULT', 2);
    const ticketRequest2 = new TicketTypeRequest('CHILD', 3);
    const totalPrice = ticketService.calculateTotalPrice(ticketRequest1, ticketRequest2);
    expect(totalPrice).toEqual(70);
  });

  it('should calculate seat count correctly for valid ticket requests', () => {
    const ticketRequest1 = new TicketTypeRequest('ADULT', 2);
    const ticketRequest2 = new TicketTypeRequest('CHILD', 3);
    const seatCount = ticketService.calculateSeatCount(ticketRequest1, ticketRequest2);
    expect(seatCount).toEqual(5);
  });

  it('should make payment and reserve seats for valid ticket purchases', () => {
    const accountId = 123;
    const ticketRequest1 = new TicketTypeRequest('ADULT', 2);
    const ticketRequest2 = new TicketTypeRequest('CHILD', 3);

    // Mock the makePayment and reserveSeats methods
    ticketService.makePayment = jest.fn();
    ticketService.reserveSeats = jest.fn();

    ticketService.purchaseTickets(accountId, ticketRequest1, ticketRequest2);

    // Expect makePayment to be called with the correct arguments
    expect(ticketService.makePayment).toHaveBeenCalledWith(accountId, 70);

    // Expect reserveSeats to be called with the correct argument
    expect(ticketService.reserveSeats).toHaveBeenCalledWith(5);
  });
});