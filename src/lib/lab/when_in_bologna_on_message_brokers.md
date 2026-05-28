<div class="flex items-baseline justify-between mb-2">
  <h1 class="text-2xl font-light tracking-tight">When in Bologna, on message brokers</h1>
  <time class="text-sm text-gray-600 ml-4">May 28, 2026</time>
</div>

> *Queues, topics, dead letters, and a broker I had never heard of*

Day two of [PyCon Italy 2026](https://2026.pycon.it/en/schedule/2026-05-28), and I've been at a [workshop](https://2026.pycon.it/en/event/hands-on-amqp-building-scalable-microservices-with-python-and-lavinmq) on building resilient microservices with `Python` and **[LavinMQ](https://lavinmq.com)**.

I signed up partly because it promised hands-on failure handling, dead letter exchanges, retries, and partly because I had never heard of `LavinMQ`.

Message brokers and I have history. It started with [RabbitMQ](https://www.rabbitmq.com), then spent some time with [kafka](https://kafka.apache.org), and now I work day-to-day with [ActiveMQ](https://activemq.apache.org). So sitting in this workshop, listening to someone explain `AMQP` exchanges and bindings, I kept mapping everything back to what I already knew, and noting where it diverged.

## What the workshop covered

The session built a distributed system from scratch. The tasks are available at [workshop.lavinmq.com](https://workshop.lavinmq.com/#info), so you can work through it at your own pace.

A producer pushes tasks onto a queue, workers pull from it. Then Pub/Sub: one message fans out to several consumers through an exchange. Then the part I was there for: *what happens when things go wrong*.

Dead-letter exchanges are the mechanism that ensures that when a message fails (or it's rejected), rather than silently dropping it, the broker routes it to a designated dead-letter queue. From there you can inspect it, retry it, alert on it.

## The broker I did not know

`LavinMQ` is a compatible alternative for `RabbitMQ` with a dramatically smaller footprint. Single binary, low memory, fast startup.

If you have used [pika](https://pika.readthedocs.io/en/stable/) with `RabbitMQ`, you need to change exactly one line: **the connection URI**. The mental model, exchanges, queues, bindings, routing keys map across directly.

## What I actually think

`RabbitMQ` was where I started, and it still sits in my head as the reference `AMQP` implementation. The routing model is expressive: direct, topic, fanout, headers, exchanges give you a lot of flexibility before you have to write any application logic.

`kafka` is a different category. It is not a message queue, it is an append-only log that happens to be consumable by many clients. You do not `pop` messages off a queue. You read from an **offset**, and the log stays there. That makes replay easy, and stream processing (joining, windowing, aggregating) possible. But the operational surface is a bit more complex: `kafka`'s own protocol, `ZooKeeper` or `KRaft`, topic partitioning strategies, consumer group rebalancing.

`ActiveMQ` is where I am now. For `Python` work, it is less convenient than it could be, and the client support is less mature than `pika`'s.

`LavinMQ` is compelling for exactly the use case where `RabbitMQ` is the obvious answer but you want a lighter deployment, better throughput per unit of memory and you are already using `pika`.

These tools look similar from the outside, they all move messages from producers to consumers, but the abstractions they expose are quite different. `RabbitMQ` and `LavinMQ` give you a smart broker that routes messages on your behalf. `kafka` gives you a dumb pipe and smart consumers. `ActiveMQ` tries to be both.

| Broker | Protocol | Model | Best for | Ops weight |
|---|---|---|---|---|
| `RabbitMQ` | `AMQP 0-9-1` | Push, smart broker | Task queues, routing, RPC | low–medium |
| `kafka` | `kafka` binary | Pull, log append | Event streaming, replay, analytics | high |
| `ActiveMQ` | `AMQP 1.0` | Push + pull, `JMS` | Enterprise `JMS`, legacy integration | medium |
| `LavinMQ` | `AMQP 0-9-1` | Push, smart broker | `RabbitMQ` workloads, low footprint | low |

*Note: the protocol gap between `AMQP 0-9-1` and `1.0` is **significant**. They are **not** interoperable. `kafka` exactly-once delivery requires idempotent producers and transactional consumers.*

So when in Bologna, keep doing as the Bolognesi do - and today that means knowing that the best broker is the one that fits both your **architecture** and your **people's skills**.
