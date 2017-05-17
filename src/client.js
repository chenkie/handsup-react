import ApolloClient, { createNetworkInterface } from 'apollo-client'
import { SubscriptionClient, addGraphQLSubscriptions } from 'subscriptions-transport-ws'

const wsClient = new SubscriptionClient('wss://subscriptions.graph.cool/v1/__ENTER_YOUR_KEY__', {
  reconnect: true,
/*  connectionParams: {
    authToken: user.authToken,
  }, */
})

const networkInterface = createNetworkInterface({
  uri: 'https://api.graph.cool/simple/v1/__ENTER_YOUR_KEY__',
  dataIdFromObject: record => record.id,
})

networkInterface.use([{
  applyMiddleware(req, next) {
    if (localStorage.getItem('auth0AccessToken')) {
      if (!req.options.headers) {
        req.options.headers = {}
      }
      req.options.headers.authorization =
        `Bearer ${localStorage.getItem('auth0AccessToken')}`
    }
    next()
  },
}])

const networkInterfaceWithSubscriptions = addGraphQLSubscriptions(
  networkInterface,
  wsClient
)

export const client = new ApolloClient({
  networkInterface: networkInterfaceWithSubscriptions,
})
