import {jest} from '@jest/globals';
import TicketService from '../src/pairtest/TicketService';
import TicketTypeRequest from '../src/pairtest/lib/TicketTypeRequest';
import InvalidPurchaseException from '../src/pairtest/lib/InvalidPurchaseException';

describe('TicketService', () => {
  let ticketService;

  beforeEach(() => {
    ticketService = new TicketService();
  });

  it('should throw an exception if no ticket type requests are provided', () => {
    expect(() => {
      ticketService.purchaseTickets(123);
    }).toThrow(InvalidPurchaseException);
  });

  it('should calculate the correct total amount and make a payment', () => {
    const adultTicket = new TicketTypeRequest('ADULT', 2);
    const childTicket = new TicketTypeRequest('CHILD', 1);

    const mockPaymentService = {
      makePayment: jest.fn(),
    };
    ticketService.paymentService = mockPaymentService;

    ticketService.purchaseTickets(123, adultTicket, childTicket);

    expect(mockPaymentService.makePayment).toHaveBeenCalledWith(123, 50); // Total amount: 2*20 + 1*10 = 50
  });

  it('should calculate the correct total seats and make a seat reservation', () => {
    const adultTicket = new TicketTypeRequest('ADULT', 2);
    const childTicket = new TicketTypeRequest('CHILD', 1);

    const mockReservationService = {
      reserveSeat: jest.fn(),
    };
    ticketService.reservationService = mockReservationService;

    ticketService.purchaseTickets(123, adultTicket, childTicket);

    expect(mockReservationService.reserveSeat).toHaveBeenCalledWith(123, 3); // Total seats: 2 + 1 = 3
  });
});