<div class="flex items-baseline justify-between mb-2">
  <h1 class="text-2xl font-light tracking-tight">A cookbook for a weather station — Part II</h1>
  <time class="text-sm text-gray-600 ml-4">September 3, 2025</time>
</div>

## Collecting and archiving measurement data

In part I of my weather station cookbook, I wrote about setting up and publishing sensor data to `MQTT` using an `Arduino`. In this post, I’ll focus on storing that data so it can be analyzed over time.

`MQTT` only keeps the latest value, so to create a proper history, I decided to save everything in a database  — in `SQLite` because it’s file-based — you can open it directly, inspect the data, or even move it like any other file.

A tidbit diverging from the name of this blog, I implemented the logger in `Rust` instead of `Python`.

The script itself is pretty simple:

- it sets up the `SQLite` database and ensures the measurements table exists:

```rust
use rusqlite::Connection;

...

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> { 
    let conn = Connection::open("weather_station.db").expect("Failed to open DB");
        conn.execute(
            "CREATE TABLE IF NOT EXISTS measurements (
                timestamp TEXT NOT NULL,
                value REAL NOT NULL,
                metric TEXT NOT NULL,
                unit TEXT NOT NULL
            )",
            [],
        )?;   

    ...

}
```

- it configures and connects the `MQTT` client to the broker and subscribes to the **temperature** and **humidity** topics:

```rust
use rumqttc::{MqttOptions, Client, QoS};
use std::time::Duration;

...

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {

    let mut mqttoptions = MqttOptions::new("mqtt_logger", "localhost", 1883);

    mqttoptions.set_keep_alive(Duration::from_secs(15 * 60));

    mqttoptions.set_clean_session(false);

    let (client, mut eventloop) = Client::new(mqttoptions, 10);
    client.subscribe("weather/indoor-sensor/temperature", QoS::AtMostOnce)?;
    client.subscribe("weather/indoor-sensor/humidity", QoS::AtMostOnce)?;

    ...

}
```

- it continuously listens for incoming messages in a dedicated thread, which parses each message from `json` and inserts it into the database - errors in parsing or database operations are logged, and the `MQTT` connection automatically retries on failure: 

```rust
use rusqlite::params;
use serde::Deserialize;
use serde_json;
use std::thread;

#[derive(Deserialize)]
struct SensorPayload {
    timestamp: i64,
    metric: String,
    value: f64,
    unit: String,
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    ...

    let handle = thread::spawn(move || {
        for message in eventloop.iter() {
            match message {
                Ok(rumqttc::Event::Incoming(rumqttc::Packet::Publish(p))) => {
                    if let Ok(text) = String::from_utf8(p.payload.to_vec()) {
                        match serde_json::from_str::<SensorPayload>(&text) {
                        Ok(data) => {
                            if let Err(e) = conn.execute(
                                    "INSERT INTO measurements
                                        (timestamp, value, metric, unit)
                                    VALUES (?1, ?2, ?3, ?4)",
                                    params![
                                        data.timestamp,
                                        data.value,
                                        data.metric,
                                        data.unit
                                    ],
                                )  {
                                    eprintln!("DB insert error: {}", e);
                                } else {
                                    println!("Inserted @ {}", data.timestamp);
                                }
                            }
                            Err(e) => eprintln!("JSON parse error: {}", e),
                        }
                    }
                }
                Ok(_) => {}
                Err(e) => {
                    eprintln!("MQTT error: {} — reconnecting in 5s", e);
                    std::thread::sleep(std::time::Duration::from_secs(5));
                }
            }
        }
    });

    ...

}
```

- the main thread is blocked until the `MQTT` thread finishes - in practice it runs forever:

```rust

...

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    ...

    let handle = ... ;

    handle.join().unwrap();

    Ok(())
}
```