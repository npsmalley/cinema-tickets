import {jest} from '@jest/globals';
import TicketService from '../src/pairtest/TicketService';
import TicketTypeRequest from '../src/pairtest/lib/TicketTypeRequest';
import InvalidPurchaseException from '../src/pairtest/lib/InvalidPurchaseException';

import TicketPaymentService from '../src/thirdparty/paymentgateway/TicketPaymentService';
import SeatReservationService from '../src/thirdparty/seatbooking/SeatReservationService';

jest.mock('../src/thirdparty/paymentgateway/TicketPaymentService');
jest.mock('../src/thirdparty/seatbooking/SeatReservationService');

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

    ticketService.purchaseTickets(123, adultTicket, childTicket);

    const mockPaymentService = TicketPaymentService.mock.instances[0];

    expect(mockPaymentService.makePayment).toHaveBeenCalledWith(123, 50); // Total amount: 2*20 + 1*10 = 50
  });

  it('should calculate the correct total seats and make a seat reservation', () => {
    const adultTicket = new TicketTypeRequest('ADULT', 2);
    const childTicket = new TicketTypeRequest('CHILD', 1);

    ticketService.purchaseTickets(123, adultTicket, childTicket);

    const mockReservationService = SeatReservationService.mock.instances[0];

    expect(mockReservationService.reserveSeat).toHaveBeenCalledWith(123, 3); // Total seats: 2 + 1 = 3
  });
});