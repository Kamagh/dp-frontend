// import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
//
// export const apiSlice = createApi({
//     // Orders
//     createOrder: builder.mutation({
//         query: (newOrder) => ({
//             url: 'orders',
//             method: 'POST',
//             body: newOrder,
//         }),
//     }),
//     // Payments
//     createPaymentIntent: builder.mutation({
//         query: (data) => ({
//             url: 'payments/intents',
//             method: 'POST',
//             body: data,
//         }),
//     }),
// })
//
//
// export const {
//     useCreatePaymentIntentMutation,
//     useCreateOrderMutation
// } = apiSlice;