use wasm_bindgen::prelude::*;

pub mod locales;

#[wasm_bindgen]
pub fn name1() -> String {
    let name: String = "gholi".to_string();
    name
}
