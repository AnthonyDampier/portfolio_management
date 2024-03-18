import { IEvent } from '@/lib/database/models/event.model'
import { CheckoutOrderParams } from '@/types'
import React from 'react'
import { loadStripe } from '@stripe/stripe-js';
import { Button } from '../ui/button';
import { checkoutOrder } from '@/lib/actions/order.actions';

interface CheckoutProps {
    event: IEvent,
    userId: string
}

const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as any
);

const Checkout = ({ event, userId }: CheckoutProps) => {
    const onCheckout = async () => {
        const order = {
            eventId: event._id,
            eventTitle: event.title,
            buyerId: userId,
            price: event.price,
            isFree: event.isFree
        } as CheckoutOrderParams;

        await checkoutOrder(order);
        }

    React.useEffect(() => {
        // Check to see if this is a redirect back from Checkout
        const query = new URLSearchParams(window.location.search);
        if (query.get('success')) {
            console.log('Order placed! You will receive an email confirmation.');
        }

        if (query.get('canceled')) {
            console.log('Order canceled -- continue to shop around and checkout when you’re ready.');
        }
    }, []);

    return (
        <form action={onCheckout} method="post">
            <Button type="submit" role="link"  className='button rounded-full' size='lg'>
                {event.isFree ? 'Get Ticket' : 'Buy Ticket'}
            </Button>
        </form>
    )
}

export default Checkout