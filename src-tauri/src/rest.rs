use serde::{Deserialize, Serialize};
use serde_json::Value;


#[derive(Debug, Deserialize, Serialize)]
struct ApiOutRequest {
    ch: String,
    kind: String,
    value: Value,
}

#[tauri::command]
pub async fn send_message(message: String) -> Result<(), String> {
  println!("Received message: {}", message);

  let Ok(value): Result<Value, _> = serde_json::to_value(&message) else {
    eprintln!("Failed to parse message: {}", message);
    return Err(format!("Failed to parse message: {}", message));
  };

  let api_out_request = ApiOutRequest {
      ch: "chat".to_string(),
      kind: "text".to_string(),
      value,
  };

  let client = reqwest::Client::new();
  match client.post("http://localhost:3298/out")
      .header("Content-Type", "application/json")
      .bearer_auth("")
      .json(&api_out_request)
      .send()
      .await {
          Ok(response) => {
            if response.status().is_success() {
                println!("Message sent successfully");
                Ok(())
            } else {
                eprintln!("Failed to send message: {:?}", response);
                return Err(format!("Failed to send message: {:?}", response));
            }
          }
          Err(err) => {
            eprintln!("connection error: {:?}", err);
            Err(format!("connection error: {:?}", err))
          }
      }
}
