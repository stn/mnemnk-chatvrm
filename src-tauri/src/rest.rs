use serde::{Deserialize, Serialize};
use serde_json::Value;
use tauri::{AppHandle, Emitter, Manager};
use warp::{http::StatusCode, Filter};

#[derive(Debug, Deserialize, Serialize)]
struct ApiOutRequest {
    ch: String,
    kind: String,
    value: Value,
}

#[tauri::command]
pub async fn send_message(
    host: String,
    api_key: String,
    board: String,
    message: String,
) -> Result<(), String> {
    println!("send_message: {}", message);

    let Ok(value): Result<Value, _> = serde_json::to_value(&message) else {
        eprintln!("Failed to parse message: {}", message);
        return Err(format!("Failed to parse message: {}", message));
    };

    let api_out_request = ApiOutRequest {
        ch: board.to_string(),
        kind: "text".to_string(),
        value,
    };
    dbg!(&api_out_request);

    let client = reqwest::Client::new();
    match client
        .post(format!("http://{}/out", host))
        .header("Content-Type", "application/json")
        .bearer_auth(api_key)
        .json(&api_out_request)
        .send()
        .await
    {
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

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Message {
    text: String,
}

pub fn spawn_server(app_handle: AppHandle) {
    tauri::async_runtime::spawn(async move {
        let route = warp::path("message")
            .and(warp::post())
            .and(warp::body::json())
            .map(move |msg: Message| {
                dbg!(&msg); // TODO: remove
                if let Some(window) = app_handle.get_webview_window("main") {
                    window
                        .emit("message-received", msg.clone())
                        .unwrap_or_else(|e| eprintln!("emit error: {}", e));
                }
                warp::reply::with_status("ok", StatusCode::OK)
            });

        // TODO: config
        warp::serve(route).run(([127, 0, 0, 1], 3299)).await;
    });
}
