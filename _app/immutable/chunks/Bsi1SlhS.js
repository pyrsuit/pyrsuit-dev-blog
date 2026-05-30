const e=`<div class="flex items-baseline justify-between mb-2">
  <h1 class="text-2xl font-light tracking-tight">AMQP 0-9-1 vs 1.0</h1>
  <time class="text-sm text-gray-600 ml-4">May 30, 2026</time>
</div>

After the [previous post](https://pyrsuit.dev/lab/when_in_bologna_on_message_brokers) I got a follow-up question: why are \`AMQP 0-9-1\` and \`1.0\` **not** interoperable?

The difference for the application side: **who is responsible for routing your messages, and what happens when delivery fails.**

## Similar name, different protocol

\`AMQP 1.0\` is not a newer version of \`0-9-1\`. It is a ground-up redesign. So this is not \`Python 3.11\` vs \`3.12\`. It is closer to two languages that happen to be spelled the same.

## Where the routing lives

\`AMQP 0-9-1\` puts routing **inside the protocol**. Exchanges, queues, bindings, and routing keys are part of the protocol. You declare an exchange, bind a queue to it with a routing key, and publish to the exchange with a key. From then on the broker fans messages out for you. Your application only ever says *"publish to exchange X with key Y"* or *"consume from queue Z"* - the wiring in between is the broker's task.

\`AMQP 1.0\` has **none of that** in the protocol. No exchanges, no bindings, no routing keys. You attach a **link** to an address: a **target** when you send, a **source** when you receive. What that address resolves to - a queue, a topic - is entirely up to the broker. The protocol itself only defines how two peers move messages across a link. It deliberately refuses to say how a broker should route anything.

The practical consequence: with \`1.0\`, **routing is not a protocol feature you configure**.

## The dead-letter queue

Dead-letter queues are defined in neither protocol. Both in \`RabbitMQ\` and \`ActiveMQ\` it comes with the broker, not with the protocol.


## Whose job is it?

| Concern | \`AMQP 0-9-1\` | \`AMQP 1.0\` |
|---|---|---|
| Routing topology | Exchanges, bindings, routing keys - **in the protocol** | Not in the protocol; links attach to addressed nodes |
| How you address a message | Publish to \`(exchange, routing key)\` | Attach a link to a target/source **address** |
| Mental model | Smart broker, you declare topology | Wire protocol between peers, broker semantics live elsewhere |

So from a user's point of view, with \`0-9-1\` you reason about *topology* - exchanges, bindings - you wired up once and forgot:

\`\`\`mermaid
flowchart LR
    P["Producer"] -->|"exchange X, key Y"| E["Exchange (direct, topic, fanout)"]
    E -->|binding| QA["Queue A"]
    E -->|binding| QB["Queue B"]
    QA --> CA["Consumer"]
    QB --> CB["Consumer"]
\`\`\`

With \`1.0\` you reason about *addresses and outcomes*, and then you go read your broker's documentation to learn what those addresses and outcomes actually do:

\`\`\`mermaid
flowchart LR
    S["Publisher"] -->|"target: 'queue/new'"| A["Broker 'queue/new'"]
    A -->|"source: 'queue/new'"| R["Subscriber"]
\`\`\`
`;export{e as default};
